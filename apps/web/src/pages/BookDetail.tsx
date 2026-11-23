import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  User,
  FileText,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Mail,
  ArrowRight,
  BookMarked
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingState from '@/components/LoadingState';
import BookCard from '@/components/BookCard';
import { usePublicationDetail, usePublicationsList } from '@/lib/api/publications.api';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading, isError } = usePublicationDetail(id || '');
  const { data: allBooks = [] } = usePublicationsList();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Publication link copied to clipboard');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyCitation = () => {
    if (!book) return;
    const year = book.publication_year || new Date(book.created_at).getFullYear();
    const citation = `${book.author_name} (${year}). ${book.title}. Preserved in the Nkar Woo Làn Cultural & Historical Archive.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    toast.success('Bibliographic citation copied to clipboard');
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-ivory py-24">
        <LoadingState label="Retrieving manuscript from the shelf…" />
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-28 text-center bg-ivory">
        <div className="border border-border bg-card p-12">
          <BookOpen className="h-12 w-12 text-forest-700 mx-auto mb-4 opacity-60" />
          <p className="font-display text-3xl text-forest-700">Publication Not Found</p>
          <p className="mt-4 text-sm text-muted-foreground">
            The book or manuscript you are searching for is not catalogued in the public archives or may have been relocated.
          </p>
          <div className="mt-8">
            <Link
              to="/books"
              className="inline-flex items-center gap-2 bg-forest-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory hover:bg-gold-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Books & Publications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const otherBooks = allBooks.filter((b) => b.id !== book.id).slice(0, 3);
  const contactInquiryUrl = `/contact?topic=${encodeURIComponent('A book or historical publication')}&message=${encodeURIComponent(
    `I would like to get a copy or consultation access for the publication: "${book.title}" by ${book.author_name}.`
  )}`;

  return (
    <article className="bg-ivory min-h-screen">
      {/* Breadcrumb Trail */}
      <nav className="border-b border-border bg-cream/70 py-4" aria-label="Breadcrumb">
        <div className="mx-auto max-w-6xl px-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-forest-700 transition-colors">
            Nkar Woo Làn
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
          <Link to="/books" className="hover:text-forest-700 transition-colors">
            Books & Publications
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
          <span className="text-forest-800 font-semibold truncate max-w-[200px] sm:max-w-md">
            {book.title}
          </span>
        </div>
      </nav>

      {/* Main Publication Dossier */}
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left Column: Cover Frame & Key Specs */}
          <div className="space-y-6">
            {book.cover_image_url ? (
              <div className="relative aspect-[3/4] overflow-hidden border border-border shadow-md bg-forest-900 rounded-xs">
                <img
                  src={book.cover_image_url}
                  alt={`Cover of ${book.title}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-[3/4] flex flex-col justify-end p-8 border border-border shadow-md pattern-toghu-light bg-forest-800 text-ivory rounded-xs">
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">
                  NKAR WOO LÀN ARCHIVE
                </p>
                <h2 className="mt-4 font-display text-3xl leading-snug">{book.title}</h2>
                <p className="mt-2 text-xs font-serif italic text-gold-300">By {book.author_name}</p>
              </div>
            )}

            {/* Quick Specs Panel */}
            <div className="border border-border bg-card p-6 space-y-4">
              <h3 className="font-display text-lg text-forest-700 border-b border-border pb-3 flex items-center gap-2">
                <BookMarked className="h-4 w-4 text-gold-600" />
                Archival Specifications
              </h3>
              <dl className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Author</dt>
                  <dd className="mt-1 font-semibold text-forest-800">{book.author_name}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Publication Year</dt>
                  <dd className="mt-1 font-semibold text-forest-800">
                    {book.publication_year || 'Archival Record'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Preserved Format</dt>
                  <dd className="mt-1 font-semibold text-forest-800 uppercase">
                    {book.file_type || 'PDF'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Document Volume</dt>
                  <dd className="mt-1 font-semibold text-forest-800">
                    {book.file_size_bytes ? `${Math.round(book.file_size_bytes / 1024)} KB` : 'Archived File'}
                  </dd>
                </div>
              </dl>

              <div className="pt-2 border-t border-border flex items-center justify-between gap-3">
                <button
                  onClick={copyLink}
                  className="flex items-center gap-1.5 text-xs text-forest-700 hover:text-gold-600 transition-colors font-medium cursor-pointer"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5 text-forest-600" /> : <Share2 className="h-3.5 w-3.5" />}
                  <span>{copiedLink ? 'Link Copied' : 'Share Publication'}</span>
                </button>
                <button
                  onClick={copyCitation}
                  className="flex items-center gap-1.5 text-xs text-forest-700 hover:text-gold-600 transition-colors font-medium cursor-pointer"
                >
                  {copiedCitation ? <Check className="h-3.5 w-3.5 text-forest-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedCitation ? 'Citation Copied' : 'Copy Citation'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Archival Notice, Synopsis, and Get Book Action */}
          <div className="space-y-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-600">
                Archival Document · Nkar Cultural Heritage
              </p>
              <h1 className="mt-2 font-display text-3xl md:text-4xl text-forest-800 leading-tight">
                {book.title}
              </h1>
              <p className="mt-3 text-base text-forest-700 font-serif italic">
                Authored by {book.author_name}
              </p>
            </div>

            {/* Archival Custody Alert: Explains No Direct Download Policy */}
            <div className="border border-gold-500/40 bg-gold-50/70 p-6 rounded-xs space-y-3">
              <div className="flex items-center gap-2.5 text-forest-800 font-semibold text-sm">
                <ShieldCheck className="h-5 w-5 text-gold-600 shrink-0" />
                <span>Custody & Consultation Notice</span>
              </div>
              <p className="text-xs leading-relaxed text-forest-800/90">
                To protect cultural intellectual property and honor author attributions, direct public file downloads are guarded. Copies and research access permissions are provided by the Nkar Woo Làn Palace and Editorial Custodians upon request.
              </p>
              <div className="pt-2">
                <Link
                  to={contactInquiryUrl}
                  className="inline-flex items-center gap-2 rounded-sm bg-forest-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-ivory hover:bg-gold-600 transition-colors shadow-sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>Get Book</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Synopsis / Description */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-forest-700 border-b border-border pb-2">
                Overview & Summary
              </h2>
              <div className="prose prose-stone max-w-none text-sm md:text-base leading-relaxed text-forest-800/95 space-y-4">
                {book.description ? (
                  book.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p>
                    This valuable literary work is preserved within the physical and digital archives of Nkar Fondom. It serves as a historical repository for scholars, community members, and future generations seeking understanding of the heritage, linguistics, and cultural rites of Nkar Woo Làn.
                  </p>
                )}
              </div>
            </div>

            {/* Bibliographic Citation Box */}
            <div className="border border-border bg-card p-6 rounded-xs space-y-3">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-forest-700">
                How to Cite This Work
              </h3>
              <p className="font-mono text-xs bg-ivory p-3.5 border border-border text-stone-700 rounded-xs select-all">
                {book.author_name} ({book.publication_year || new Date(book.created_at).getFullYear()}).{' '}
                <em>{book.title}</em>. Nkar Woo Làn Cultural & Historical Archive.
              </p>
            </div>

            {/* Back Button */}
            <div className="pt-4 border-t border-border">
              <Link
                to="/books"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-forest-700 hover:text-gold-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Books Shelf</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Titles Shelf */}
      {otherBooks.length > 0 && (
        <section className="border-t border-border bg-cream/60 py-16">
          <div className="mx-auto max-w-6xl px-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-600">
                  Explore More Titles
                </p>
                <h2 className="font-display text-2xl text-forest-700 mt-1">
                  Other Works on the Archive Shelf
                </h2>
              </div>
              <Link
                to="/books"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-forest-700 hover:text-gold-600 transition-colors"
              >
                <span>View Full Shelf</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherBooks.map((item) => (
                <BookCard key={item.id} book={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
