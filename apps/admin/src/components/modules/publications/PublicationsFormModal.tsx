import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Publication, PublicationFileType, ContentStatus } from '../../../types';
import { FileUpload } from '../../common/FileUpload';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface PublicationsFormModalProps {
  isOpen: boolean;
  initialData?: Publication | null;
  onClose: () => void;
  onSubmit: (data: Omit<Publication, 'id' | 'created_at' | 'updated_at'>) => void;
  isLoading?: boolean;
}

export const PublicationsFormModal: React.FC<PublicationsFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationYear, setPublicationYear] = useState('2026');
  const [documentUrl, setDocumentUrl] = useState('');
  const [fileType, setFileType] = useState<PublicationFileType>('PDF');
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(5242880);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [status, setStatus] = useState<ContentStatus>('PUBLISHED');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setAuthor(initialData.author_name);
      setPublicationYear(initialData.publication_year ? String(initialData.publication_year) : '2026');
      setDocumentUrl(initialData.document_url);
      setFileType(initialData.file_type || 'PDF');
      setFileSizeBytes(initialData.file_size_bytes || 5242880);
      setCoverImageUrl(initialData.cover_image_url || '');
      setStatus(initialData.status);
    } else {
      setTitle('');
      setDescription('');
      setAuthor('');
      setPublicationYear(String(new Date().getFullYear()));
      setDocumentUrl('');
      setFileType('PDF');
      setFileSizeBytes(0);
      setCoverImageUrl('');
      setStatus('PUBLISHED');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !documentUrl.trim()) {
      setError('Title, author, and document URL are required.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      author_name: author.trim(),
      publication_year: parseInt(publicationYear) || new Date().getFullYear(),
      document_url: documentUrl.trim(),
      file_type: fileType,
      file_size_bytes: fileSizeBytes,
      cover_image_url: coverImageUrl.trim() || null,
      status,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white dark:bg-stone-900 border-l border-[#E5E0D5] dark:border-stone-800 text-stone-900 dark:text-stone-100">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 text-left">
          <SheetTitle className="font-bold text-stone-900 dark:text-stone-100 text-sm">
            {initialData ? 'Edit Archival Publication' : 'Preserve / Catalog Publication'}
          </SheetTitle>
          <SheetDescription className="text-xs text-stone-500 dark:text-stone-400">
            Manuscripts, cultural dictionaries, royal monographs, and community research
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Book / Document Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Traditional Institutions & Governance in Nkar Fondom"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-900 dark:text-stone-100 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Author / Custodian *</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Fai Woo / Dr. Shey Banboye"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Publication Year *</label>
              <input
                type="number"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
                placeholder="2026"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Format Type *</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as PublicationFileType)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 font-semibold"
              >
                <option value="PDF">PDF (Portable Document)</option>
                <option value="EPUB">EPUB (Electronic Book)</option>
                <option value="DOCX">DOCX (Word Document)</option>
                <option value="EXTERNAL_LINK">External Library Link</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">File Size (Bytes)</label>
              <input
                type="number"
                value={fileSizeBytes}
                onChange={(e) => setFileSizeBytes(parseInt(e.target.value) || 0)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 font-mono"
              />
            </div>
          </div>

          <FileUpload
            label="Digital Document File (PDF, EPUB, DOCX) *"
            value={documentUrl}
            onChange={(url, file) => {
              setDocumentUrl(url);
              if (file?.size) {
                setFileSizeBytes(file.size);
              }
              if (file?.name) {
                const ext = file.name.split('.').pop()?.toUpperCase();
                if (ext && ['PDF', 'EPUB', 'DOCX'].includes(ext)) {
                  setFileType(ext as PublicationFileType);
                }
              }
            }}
            accept=".pdf,.epub,.docx,application/pdf,application/epub+zip,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            mediaTypeHint="document"
            folder="nkar_woo_lan/publications"
            helperText="Upload official manuscript or monograph file (up to 50MB)"
          />

          <FileUpload
            label="Book Cover Art / Toghu Sleeve"
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            accept="image/*"
            mediaTypeHint="image"
            folder="nkar_woo_lan/publications/covers"
            helperText="Upload publication cover or Toghu artwork (JPEG, PNG, WebP up to 10MB)"
          />

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Synopsis & Abstract</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Abstract, historical provenance, chapter summary..."
              className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
            />
          </div>

          <div className="pt-4 border-t border-[#E8E4DA] dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0D291F] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Catalog Book'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
