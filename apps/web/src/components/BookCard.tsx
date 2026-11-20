import { Download, FileText } from 'lucide-react';
import type { Publication } from '@/types/api.types';

interface BookCardProps {
  book: Publication;
}

export default function BookCard({ book }: BookCardProps) {
  const details = [
    { label: 'Author', value: book.author_name },
    { label: 'Published', value: book.publication_year ? String(book.publication_year) : 'Archived Record' },
    { label: 'Format', value: book.file_type ? book.file_type.toUpperCase() : 'PDF' },
    { label: 'File Size', value: book.file_size_bytes ? `${Math.round(book.file_size_bytes / 1024)} KB` : 'Archive' }
  ];

  return (
    <article className="flex h-full flex-col border border-border bg-card">
      {book.cover_image_url ? (
        <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-forest-900">
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="relative flex min-h-[180px] flex-col justify-end p-6 pattern-toghu-light bg-forest-800 text-ivory">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">
            NKAR WOO LÀN Archive
          </p>
          <h3 className="mt-3 font-display text-2xl leading-snug">{book.title}</h3>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl text-forest-700">{book.title}</h3>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
          {details.map((detail) => (
            <div key={detail.label} className="border-t border-border pt-3">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {detail.label}
              </dt>
              <dd className="mt-1 text-forest-700">{detail.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {book.description || 'Community document kept for preservation in the Nkar archives.'}
        </p>

        {book.document_url && (
          <div className="mt-auto pt-6">
            <a
              href={book.document_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-forest-700 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold-600"
            >
              <Download className="h-3.5 w-3.5" />
              Download Document
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
