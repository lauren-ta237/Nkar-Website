import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { Publication } from '@/types/api.types';

interface BookCardProps {
  book: Publication;
}

export default function BookCard({ book }: BookCardProps) {
  const bookUrl = `/books/${book.id}`;
  const publicationYear = book.publication_year ? String(book.publication_year) : null;

  return (
    <article className="flex h-full flex-col border border-border bg-card group hover:border-gold-500/70 transition-all duration-300">
      <Link to={bookUrl} className="block overflow-hidden">
        {book.cover_image_url ? (
          <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-forest-900">
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="relative flex min-h-[170px] flex-col justify-end p-6 pattern-toghu-light bg-forest-800 text-ivory group-hover:bg-forest-900 transition-colors">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">
              NKAR WOO LÀN ARCHIVE
            </p>
            <h3 className="mt-3 font-display text-2xl leading-snug line-clamp-2">{book.title}</h3>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between text-[11px] text-gold-600 font-semibold tracking-wider uppercase mb-1">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Archive Record
          </span>
          {publicationYear && (
            <span className="text-muted-foreground font-medium">{publicationYear}</span>
          )}
        </div>

        <Link to={bookUrl} className="hover:text-gold-600 transition-colors">
          <h3 className="font-display text-xl text-forest-700 line-clamp-2 leading-snug">
            {book.title}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-forest-700/80 font-serif italic">
          By {book.author_name}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {book.description || 'Historical publication and community document preserved in the official Nkar archives.'}
        </p>

        <div className="mt-auto pt-5 border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground font-mono uppercase">
            {book.file_type || 'PDF'}
          </span>

          <Link
            to={bookUrl}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-forest-700 hover:text-gold-600 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
