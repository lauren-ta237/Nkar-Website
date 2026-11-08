import React, { useState, useEffect } from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';
import { Publication, PublicationFileType, ContentStatus } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
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
  onSubmit: (data: Omit<Publication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

export const PublicationsFormModal: React.FC<PublicationsFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { currentUser } = useAdminStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [fileType, setFileType] = useState<PublicationFileType>('PDF');
  const [fileSize, setFileSize] = useState('4.5 MB');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<ContentStatus>('PUBLISHED');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setAuthor(initialData.author);
      setPublicationDate(initialData.publicationDate);
      setDocumentUrl(initialData.documentUrl);
      setFileType(initialData.fileType);
      setFileSize(initialData.fileSize || '3.2 MB');
      setCoverImage(initialData.coverImage || '');
      setStatus(initialData.status);
    } else {
      setTitle('');
      setDescription('');
      setAuthor('Nkar History & Cultural Heritage Society');
      setPublicationDate('2026-05-10');
      setDocumentUrl('https://example.com/publications/monograph.pdf');
      setFileType('PDF');
      setFileSize('5.2 MB');
      setCoverImage('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80');
      setStatus(currentUser.role === 'CONTENT_EDITOR' ? 'SUBMITTED' : 'PUBLISHED');
    }
    setError('');
  }, [initialData, isOpen, currentUser.role]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !author.trim() || !documentUrl.trim()) {
      setError('Title, description, author, and document URL are required.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      author: author.trim(),
      publicationDate,
      documentUrl: documentUrl.trim(),
      fileType,
      fileSize: fileSize.trim(),
      coverImage: coverImage.trim() || undefined,
      status,
      uploadedBy: currentUser.name,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white border-l border-[#E5E0D5]">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] bg-[#FAF8F5] text-left">
          <SheetTitle className="font-bold text-stone-900 text-sm">
            {initialData ? 'Edit Publication Record' : 'Catalog Book or Publication'}
          </SheetTitle>
          <SheetDescription className="text-xs text-stone-500">
            Monographs, anthropological papers, bilingual dictionaries, and annual reports
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Publication Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Living Chronicles of Nkar (1750–2020)"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-900 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Author / Scholar *</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Prof. Emmanuel N. Tardzenyuy"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Publication Date *</label>
              <input
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Format Type</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as PublicationFileType)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              >
                <option value="PDF">PDF Document</option>
                <option value="EPUB">EPUB E-Book</option>
                <option value="DOCX">DOCX Manuscript</option>
                <option value="EXTERNAL_LINK">External Web Repository</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">File Size</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g. 8.4 MB"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              >
                <option value="PUBLISHED">Published (Available)</option>
                <option value="APPROVED">Approved</option>
                <option value="SUBMITTED">Under Review</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          <FileUpload
            label="Publication Document File (PDF, DOCX, EPUB) *"
            value={documentUrl}
            onChange={(url: string, file?: File) => {
              setDocumentUrl(url);
              if (file) {
                const mb = (file.size / (1024 * 1024)).toFixed(1);
                setFileSize(`${mb} MB`);
                if (file.name.endsWith('.pdf')) setFileType('PDF');
                else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) setFileType('DOCX');
                else if (file.name.endsWith('.epub')) setFileType('EPUB');
              }
            }}
            accept=".pdf,.docx,.doc,.epub,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            mediaTypeHint="document"
            maxSizeBytes={50 * 1024 * 1024}
            helperText="Upload official manuscript or electronic publication (PDF, DOCX, EPUB up to 50MB)"
          />

          <FileUpload
            label="Book Cover / Frontispiece (Optional)"
            value={coverImage}
            onChange={setCoverImage}
            accept="image/*"
            mediaTypeHint="image"
            helperText="Upload publication cover or title page illustration (JPEG, PNG, WebP up to 15MB)"
          />

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description & Abstract *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Synopsis of research findings, chapters, and relevance to Nkar community..."
              rows={4}
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              required
            />
          </div>

          <div className="pt-4 border-t border-[#E8E4DA] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0D291F] rounded-xl shadow-xs transition-colors"
            >
              {isLoading ? 'Saving...' : initialData ? 'Update Record' : 'Save Publication'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
