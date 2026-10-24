import { useEffect, useId, useRef, useState } from "react";
import { Trash2, UploadCloud } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SecureUpload } from "@/components/illustrations";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
  required?: boolean;
  accept?: string;
  id?: string;
  className?: string;
};

/**
 * Dropzone with an illustrated empty state and an image preview.
 * See DESIGN.md section 8.
 */
export default function FileField({
  label,
  file,
  onChange,
  icon: Icon = UploadCloud,
  error,
  hint,
  required,
  accept = "image/jpeg,image/png,image/webp",
  id: idProp,
  className,
}: Props) {
  const { t } = useTranslation("dashboard");
  const effectiveHint = hint ?? t("kyc.fileDefaultHint");
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const updateFile = (nextFile: File | null) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextUrl = nextFile ? URL.createObjectURL(nextFile) : null;
    previewUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
    onChange(nextFile);
  };

  const removeFile = () => {
    updateFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="ms-0.5 text-danger-text" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${hintId} ${errorId}` : hintId}
        onChange={(event) => updateFile(event.target.files?.[0] ?? null)}
      />

      {file && previewUrl ? (
        <figure className="overflow-hidden rounded-xl border border-border/60 bg-surface-sunken shadow-e1">
          <div className="flex aspect-4/3 max-h-64 items-center justify-center bg-surface-sunken">
            <img
              src={previewUrl}
              alt={`Preview of the selected ${label.toLowerCase()}`}
              className="h-full w-full object-contain"
            />
          </div>
          <figcaption className="flex items-center justify-between gap-3 border-t border-border/60 bg-surface-raised px-3 py-2">
            <span className="min-w-0 truncate text-xs text-muted-foreground">
              {file.name}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => inputRef.current?.click()}
                className="text-xs">
                {t("kyc.replace")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-xs text-danger-text hover:text-danger-text">
                <Trash2 className="size-3.5" aria-hidden="true" />
                {t("kyc.remove")}
              </Button>
            </div>
          </figcaption>
        </figure>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            const dropped = event.dataTransfer.files?.[0];
            if (dropped) updateFile(dropped);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/8"
              : "border-border bg-surface-sunken hover:border-primary/50 hover:bg-primary/5",
            error && "border-destructive/60",
          )}>
          <SecureUpload className="w-28 text-primary" />
          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Icon className="size-4 text-primary" aria-hidden="true" />
            {t("kyc.chooseOrDragFile")}
          </span>
          <span className="text-xs text-muted-foreground">
            {t("kyc.filePhotoGuidelines")}
          </span>
        </button>
      )}

      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger-text">
          {error}
        </p>
      ) : (
        <p id={hintId} className="text-xs text-muted-foreground">
          {effectiveHint}
        </p>
      )}
    </div>
  );
}
