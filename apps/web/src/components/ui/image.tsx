import * as React from "react"
import { ResponsiveImage } from "./responsive-image"
import {
  getOriginalImageUrl,
  IMAGE_LOAD_MODE,
  nextImageLoadMode,
  parseWixMediaUrl,
  type ImageLoadMode,
} from "../../lib/image-helpers"

const FALLBACK_IMAGE_URL =
  "https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png"

interface PreviewSource {
  source: string;
  value: string;
  className: string;
  sourceClassName: string;
}

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fittingType?: "fill" | "fit";
  originWidth?: number;
  originHeight?: number;
  focalPointX?: number;
  focalPointY?: number;
  quality?: number;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src: source,
      fittingType = "fill",
      originWidth,
      originHeight,
      focalPointX,
      focalPointY,
      quality = 90,
      onError,
      className,
      ...props
    },
    ref
  ) => {
    const [previewSource, setPreviewSource] = React.useState<PreviewSource | null>(null)
    const preview = previewSource?.source === source ? previewSource : null
    const src = preview ? preview.value : source
    const replaceSource = (value: string, nextClassName: string) =>
      setPreviewSource({
        source,
        value,
        className: nextClassName,
        sourceClassName: className as string,
      })
    React.useEffect(() => setPreviewSource(null), [source])
    const parsedSource = src && src !== FALLBACK_IMAGE_URL ? parseWixMediaUrl(src) : null
    const initialMode: ImageLoadMode = parsedSource ? IMAGE_LOAD_MODE.OPTIMIZED : IMAGE_LOAD_MODE.ORIGINAL
    const [loadState, setLoadState] = React.useState<{ src: string; mode: ImageLoadMode }>({
      src,
      mode: initialMode,
    })
    const mode = loadState.src === src ? loadState.mode : initialMode

    React.useEffect(() => {
      setLoadState({ src, mode: initialMode })
    }, [src, initialMode])

    const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
      if (mode === IMAGE_LOAD_MODE.FALLBACK) return
      const nextMode = nextImageLoadMode(mode)
      setLoadState({ src, mode: nextMode })
      if (nextMode === IMAGE_LOAD_MODE.FALLBACK) onError?.(event)
    }

    const activeClassName =
      preview && preview.sourceClassName === className ? preview.className : className

    const imageProps = {
      ...props,
      className: ["object-top", activeClassName].filter(Boolean).join(" "),
      onError: handleError,
    }

    if (!src) {
      return <img ref={ref} src={FALLBACK_IMAGE_URL} {...imageProps} data-empty-image />
    }

    const parsed = mode === IMAGE_LOAD_MODE.OPTIMIZED ? parsedSource : null

    if (!parsed) {
      const isErrorMode = mode === IMAGE_LOAD_MODE.FALLBACK
      const imageSrc = isErrorMode ? FALLBACK_IMAGE_URL : getOriginalImageUrl(src, parsedSource)
      return (
        <img
          ref={ref}
          src={imageSrc}
          {...imageProps}
          data-error-image={isErrorMode || undefined}
        />
      )
    }

    const focalPoint =
      typeof focalPointX === "number" && typeof focalPointY === "number"
        ? { x: focalPointX, y: focalPointY }
        : undefined
    const aspectRatio =
      originWidth && originHeight ? `${originWidth} / ${originHeight}` : undefined

    return (
      <ResponsiveImage
        ref={ref}
        src={src}
        parsed={parsed}
        onSourceChange={replaceSource}
        fittingType={fittingType}
        focalPoint={focalPoint}
        quality={quality}
        aspectRatio={aspectRatio}
        {...imageProps}
      />
    )
  }
)
Image.displayName = "Image"

export { Image }