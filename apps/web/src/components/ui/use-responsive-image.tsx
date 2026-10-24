import * as React from "react"
import { useSize } from "../../hooks/use-size"
import { cn } from "../../lib/utils"
import { DEFAULT_TRANSFORM_WIDTH, getImagePreviewClassName } from "../../lib/image-helpers"
import type { TransformOptions } from "../../lib/image-helpers"
import type { ParsedWixMediaUrl } from "../../lib/image-helpers"

export interface ResponsiveImageOptions extends TransformOptions {
  crop: boolean;
}

export function useResponsiveImage(
  {
    parsed,
    fittingType,
    focalPoint,
    quality,
    className,
    onLoad,
    onSourceChange,
  }: {
    parsed: ParsedWixMediaUrl | null;
    fittingType?: "fit" | "fill";
    focalPoint?: { x: number; y: number };
    quality?: number;
    className?: string;
    onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
    onSourceChange?: (src: string, className: string) => void;
  },
  parentRef: React.Ref<HTMLImageElement>
) {
  const wrapperRef = React.useRef<HTMLSpanElement>(null)
  const imgRef = React.useRef<HTMLImageElement | null>(null)
  const size = useSize(wrapperRef)
  const [loaded, setLoaded] = React.useState(false)

  React.useImperativeHandle(parentRef, () => imgRef.current as HTMLImageElement)
  React.useEffect(() => setLoaded(false), [parsed?.baseUrl])
  React.useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const replace = (event: Event) => {
      const detail = (event as CustomEvent<{ src: string }>).detail
      onSourceChange?.(
        detail.src as string,
        getImagePreviewClassName(className as string, wrapper.className, cn("inline-block relative", className as string))
      )
    }
    wrapper.addEventListener("base44:image-replace", replace)
    return () => wrapper.removeEventListener("base44:image-replace", replace)
  }, [className, onSourceChange])

  const crop = fittingType !== "fit"
  // Wait for useSize's pre-paint measurement before requesting a transform.
  const options: ResponsiveImageOptions | undefined = size
    ? {
        width: size.width || DEFAULT_TRANSFORM_WIDTH,
        height: size.height || undefined,
        crop,
        focalPoint: crop ? focalPoint : undefined,
        quality,
      }
    : undefined

  return {
    wrapperRef,
    imgRef,
    loaded,
    options,
    handleLoad: (event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true)
      onLoad?.(event)
    },
  }
}