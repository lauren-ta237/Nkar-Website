import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  File,
  ImageOff,
} from 'lucide-react';
import { uploadAdminMedia } from '@/lib/api/media.api';

interface FileUploadProps {
  label?: string;
  value?: string; // Current image/video/document URL or empty
  onChange: (url: string, file?: File) => void;
  accept?: string; // e.g. "image/*", "video/*", "image/*,video/*", ".pdf,.docx"
  mediaTypeHint?: 'image' | 'video' | 'document' | 'auto';
  maxSizeMB?: number;
  maxSizeBytes?: number;
  helperText?: string;
  required?: boolean;
  folder?: string; // e.g. "nkar_woo_lan/news"
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  value,
  onChange,
  accept = 'image/*',
  mediaTypeHint = 'auto',
  maxSizeMB = 25,
  maxSizeBytes,
  helperText,
  required = false,
  folder,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine media category
  const isVideo =
    mediaTypeHint === 'video' ||
    (value && (value.startsWith('data:video') || value.endsWith('.mp4') || value.endsWith('.webm')));

  const isDocument =
    mediaTypeHint === 'document' ||
    accept.includes('.pdf') ||
    accept.includes('.docx') ||
    (value && (value.endsWith('.pdf') || value.endsWith('.docx') || value.includes('/raw/upload/')));

  const effectiveMaxBytes = maxSizeBytes || maxSizeMB * 1024 * 1024;

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.size > effectiveMaxBytes) {
      const maxMb = Math.round(effectiveMaxBytes / (1024 * 1024));
      return {
        valid: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of ${maxMb}MB.`,
      };
    }

    if (accept && accept !== '*/*') {
      const allowed = accept.split(',').map((s) => s.trim().toLowerCase());
      const fileType = file.type.toLowerCase();
      const name = file.name.toLowerCase();

      const isMatch = allowed.some((pattern) => {
        if (pattern.endsWith('/*')) {
          const prefix = pattern.replace('/*', '');
          return fileType.startsWith(prefix);
        }
        if (pattern.startsWith('.')) {
          return name.endsWith(pattern);
        }
        return fileType === pattern;
      });

      if (!isMatch) {
        return {
          valid: false,
          error: `Invalid file format. Allowed formats: ${allowed.join(', ')}`,
        };
      }
    }

    return { valid: true };
  };

  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);
    setImageLoadError(false);

    const validation = validateFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid file');
      return;
    }

    setUploadProgress(0);
    setFileName(file.name);

    try {
      const result = await uploadAdminMedia(file, folder, (percent) => {
        setUploadProgress(percent);
      });

      // Pass only authentic remote Cloudinary HTTPS URL - never base64
      const mediaUrl = result.secure_url || result.url;
      if (!mediaUrl) {
        throw new Error('Server did not return a valid asset URL');
      }

      onChange(mediaUrl, file);
      setUploadProgress(null);
    } catch (err: any) {
      const detail = err?.payload?.detail;
      const msg =
        (typeof detail === 'string' ? detail : detail?.message) ||
        err?.message ||
        'Upload to Cloudinary storage failed. Please check network connection and credentials.';
      setErrorMessage(msg);
      setUploadProgress(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
    setErrorMessage(null);
    setImageLoadError(false);
    setUploadProgress(null);
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-stone-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Uploading State with Live Progress Bar */}
      {uploadProgress !== null && (
        <div className="p-4 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-700">
            <span className="font-semibold flex items-center gap-1.5 truncate">
              <Upload className="w-3.5 h-3.5 text-[#153E2E] animate-bounce" />
              Uploading {fileName || 'media file'} to Cloudinary...
            </span>
            <span className="font-mono tabular-nums text-stone-500">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#153E2E] to-[#D4AF37] transition-all duration-200 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="truncate">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-800 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Populated State with Preview and Replace/Remove controls */}
      {value && uploadProgress === null ? (
        <div className="relative rounded-xl border border-[#E8E4DA] bg-[#FAF8F5] p-3 overflow-hidden group">
          {/* Media Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {isVideo ? (
              <div className="w-full sm:w-44 h-28 bg-black rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                <video src={value} controls className="w-full h-full object-contain" />
              </div>
            ) : isDocument ? (
              <div className="w-full sm:w-28 h-20 bg-stone-200/80 rounded-lg flex flex-col items-center justify-center text-stone-600 shrink-0">
                <FileText className="w-8 h-8 text-[#153E2E]" />
                <span className="text-[10px] font-bold uppercase mt-1">Document</span>
              </div>
            ) : (
              <div className="w-full sm:w-36 h-24 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shrink-0 flex items-center justify-center">
                {imageLoadError ? (
                  <div className="text-center p-2 text-stone-400">
                    <ImageOff className="w-6 h-6 mx-auto mb-1 text-stone-400" />
                    <span className="text-[10px] block">Preview Unavailable</span>
                  </div>
                ) : (
                  <img
                    src={value}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setImageLoadError(true)}
                  />
                )}
              </div>
            )}

            {/* Actions & info */}
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <p className="text-xs font-bold text-stone-900 truncate">
                {fileName || (isVideo ? 'Uploaded Video File' : isDocument ? 'Uploaded Document' : 'Uploaded Image')}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5 truncate font-mono text-[10px]">
                {value}
              </p>

              <div className="flex items-center gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={triggerBrowse}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                  <span>Replace File</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-red-600" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Dropzone State */
        uploadProgress === null && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerBrowse}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#153E2E] bg-[#EAF2EE]/60'
                : 'border-[#D9D3C7] bg-[#FAF8F5] hover:bg-[#F4F0E8] hover:border-[#D4AF37]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white border border-[#E8E4DA] flex items-center justify-center mx-auto mb-2 text-[#153E2E] shadow-2xs">
              {isVideo ? (
                <Video className="w-5 h-5 text-[#D4AF37]" />
              ) : isDocument ? (
                <FileText className="w-5 h-5 text-[#153E2E]" />
              ) : (
                <Upload className="w-5 h-5 text-[#153E2E]" />
              )}
            </div>

            <p className="text-xs font-bold text-stone-800">
              <span className="text-[#153E2E] underline underline-offset-2">Click to Browse</span> or drag and drop file here
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              {helperText ||
                (isVideo
                  ? `Uploads to Cloudinary (MP4, WebM up to ${maxSizeMB}MB)`
                  : isDocument
                  ? `Uploads to Cloudinary (PDF, DOCX, EPUB up to ${maxSizeMB}MB)`
                  : `Uploads to Cloudinary (JPG, PNG, WebP up to ${maxSizeMB}MB)`)}
            </p>
          </div>
        )
      )}
    </div>
  );
};
