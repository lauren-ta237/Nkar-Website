import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { EmptySearch } from "@/components/illustrations";
import { cn } from "@/lib/utils";

export type FileViewerItem = {
  src?: string;
  name: string;
  mimeType: string;
  label?: string;
};

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.5;

function isImage(mimeType: string) {
  return mimeType.startsWith("image/");
}

type Props = {
  files: FileViewerItem[];
  open: boolean;
  index: number;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
  className?: string;
};

/**
 * Full-file overlay for images now, other MIME types later.
 * See DESIGN.md section 9.
 */
export default function FileViewer({
  files,
  open,
  index,
  onOpenChange,
  onIndexChange,
  className,
}: Props) {
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const safeIndex =
    files.length === 0 ? 0 : Math.min(Math.max(index, 0), files.length - 1);
  const file = files[safeIndex];
  const canPage = files.length > 1;
  const image = Boolean(file && isImage(file.mimeType) && file.src);
  const [zoom, setZoom] = useState(ZOOM_MIN);

  useEffect(() => {
    setZoom(ZOOM_MIN);
  }, [safeIndex, image]);

  const clampZoom = (value: number) =>
    Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));
  const zoomIn = () => setZoom((current) => clampZoom(current + ZOOM_STEP));
  const zoomOut = () => setZoom((current) => clampZoom(current - ZOOM_STEP));
  const resetZoom = () => setZoom(ZOOM_MIN);

  const go = useCallback(
    (delta: number) => {
      if (!canPage) return;
      onIndexChange((safeIndex + delta + files.length) % files.length);
    },
    [canPage, files.length, onIndexChange, safeIndex],
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const heading = file?.label || file?.name || "File";
  const canZoom = image && Boolean(file?.src);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => onOpenChange(next)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-foreground/55 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-sm" />
        <DialogPrimitive.Popup
          aria-labelledby={titleId}
          className={cn(
            "fixed inset-3 z-50 flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-2xl bg-surface-raised text-foreground shadow-e4 outline-none sm:inset-6",
            "transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
            className,
          )}>
          <header className="flex shrink-0 items-center gap-3 border-b border-border/60 bg-surface-raised px-3 py-2.5 sm:px-4">
            <div className="min-w-0 flex-1">
              <DialogPrimitive.Title
                id={titleId}
                className="truncate text-sm font-semibold text-foreground">
                {heading}
              </DialogPrimitive.Title>
              {file && (
                <DialogPrimitive.Description className="truncate text-xs text-muted-foreground">
                  {file.name}
                  {files.length > 1 ? ` · ${safeIndex + 1} of ${files.length}` : ""}
                </DialogPrimitive.Description>
              )}
            </div>

            {canZoom && (
              <ZoomControls
                className="hidden sm:flex"
                zoom={zoom}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
              />
            )}

            {file?.src && (
              <Button
                nativeButton={false}
                render={<a href={file.src} download={file.name} />}
                variant="outline"
                className="min-h-11 gap-1.5 rounded-xl px-3">
                <Download className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            )}

            <DialogPrimitive.Close
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Close viewer"
                  className="min-h-11 min-w-11 rounded-xl"
                />
              }>
              <X />
            </DialogPrimitive.Close>
          </header>

          <div className="relative min-h-0 flex-1 bg-surface-sunken">
            {canPage && (
              <>
                <NavArrow side="left" onClick={() => go(-1)} />
                <NavArrow side="right" onClick={() => go(1)} />
              </>
            )}

            <div className="flex h-full items-center justify-center overflow-auto p-4 sm:p-8">
              {!file ? (
                <EmptyState
                  size="sm"
                  illustration={EmptySearch}
                  title="No file to show"
                  description="Nothing is selected."
                />
              ) : image && file.src ? (
                <button
                  type="button"
                  onClick={zoom >= ZOOM_MAX ? resetZoom : zoomIn}
                  className="cursor-zoom-in border-0 bg-transparent p-0"
                  aria-label={zoom >= ZOOM_MAX ? "Reset zoom" : "Zoom in"}>
                  <img
                    src={file.src}
                    alt={
                      file.label ? `${file.label} — ${file.name}` : file.name
                    }
                    className="max-h-[min(72dvh,40rem)] max-w-full origin-center rounded-xl object-contain shadow-e2"
                    style={{
                      transform: `scale(${zoom})`,
                      transition: reduceMotion
                        ? undefined
                        : "transform var(--duration-base) var(--ease-out-quart)",
                    }}
                  />
                </button>
              ) : (
                <EmptyState
                  size="sm"
                  illustration={EmptySearch}
                  title="Preview not available"
                  description={
                    file.src
                      ? "This file type cannot be shown here. Download it to open it on your device."
                      : "This file could not be loaded."
                  }
                  action={
                    file.src ? (
                      <Button
                        nativeButton={false}
                        render={<a href={file.src} download={file.name} />}
                        className="min-h-11 rounded-xl">
                        <Download className="size-4" aria-hidden="true" />
                        Download {file.name}
                      </Button>
                    ) : undefined
                  }
                />
              )}
            </div>
          </div>

          {canZoom && (
            <ZoomControls
              className="flex border-t border-border/60 px-3 py-2 sm:hidden"
              zoom={zoom}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
            />
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function ZoomControls({
  className,
  zoom,
  onZoomIn,
  onZoomOut,
}: {
  className?: string;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}) {
  return (
    <div className={cn("items-center justify-center gap-1", className)}>
      <ToolbarIcon
        label="Zoom out"
        disabled={zoom <= ZOOM_MIN}
        onClick={onZoomOut}>
        <Minus />
      </ToolbarIcon>
      <span className="w-10 text-center font-mono text-[11px] tabular-nums text-muted-foreground">
        {Math.round(zoom * 100)}%
      </span>
      <ToolbarIcon
        label="Zoom in"
        disabled={zoom >= ZOOM_MAX}
        onClick={onZoomIn}>
        <Plus />
      </ToolbarIcon>
    </div>
  );
}

function ToolbarIcon({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      className="min-h-11 min-w-11 rounded-xl">
      {children}
    </Button>
  );
}

function NavArrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-lg"
      aria-label={side === "left" ? "Previous file" : "Next file"}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 min-h-11 min-w-11 -translate-y-1/2 rounded-full shadow-e2",
        side === "left" ? "left-3" : "right-3",
      )}>
      <Icon />
    </Button>
  );
}
