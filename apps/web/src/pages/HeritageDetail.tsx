import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingState from '@/components/LoadingState';
import { Image } from '@/components/ui/image';
import { useHeritageDetail, useHeritageList } from '@/lib/api/heritage.api';

function formatCategoryLabel(cat?: string): string {
  if (!cat) return 'Oral Tradition';
  const clean = cat.toLowerCase().replace(/_/g, ' ');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export default function HeritageDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading, isError } = useHeritageDetail(slug || '');
  const { data: allHeritage = [] } = useHeritageList();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-ivory py-24">
        <LoadingState label="Consulting the cultural heritage archives…" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-28 text-center bg-ivory">
        <div className="border border-border bg-card p-12">
          <p className="font-display text-3xl text-forest-700">Heritage Record Not Found</p>
          <p className="mt-4 text-sm text-muted-foreground">
            The historical record you requested could not be retrieved from the archives.
          </p>
          <div className="mt-8">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-forest-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory hover:bg-gold-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to About &amp; Heritage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const paragraphs = (item.content || '').split('\n\n').filter(Boolean);
  const otherItems = allHeritage.filter((h) => h.id !== item.id).slice(0, 4);

  return (
    <>
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-forest-900 text-ivory py-16 md:py-24">
        <div className="absolute inset-0 pattern-toghu-light opacity-30" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-4xl px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-gold-300/80 mb-6">
            <Link to="/" className="hover:text-gold-200 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/about" className="hover:text-gold-200 transition-colors">About &amp; Heritage</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate max-w-[200px] text-ivory/60">{item.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-gold-300">
            <span className="bg-gold-500/20 px-3 py-1 border border-gold-500/40">
              {formatCategoryLabel(item.category)}
            </span>
          </div>

          <h1 className="mt-6 font-display text-3xl leading-tight md:text-5xl text-ivory">
            {item.title}
          </h1>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-4xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_260px]">
            {/* Story Content */}
            <article className="space-y-6">
              {/* Optional Heritage Image Gallery */}
              {item.images && item.images.length > 0 && (
                <figure className="mb-8 rounded-sm border border-gold-500/25 bg-cream/60 p-2.5 shadow-sm">
                  <div className="overflow-hidden rounded-sm bg-forest-950/5">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-auto max-h-[500px] object-cover object-top"
                      fittingType="fill"
                      quality={85}
                    />
                  </div>
                  <figcaption className="mt-2.5 px-1 text-[11px] tracking-wide text-muted-foreground">
                    {item.title}
                  </figcaption>
                </figure>
              )}

              <div className="prose max-w-none space-y-5 text-base leading-relaxed text-forest-800">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="first-letter:font-display first-letter:text-2xl first-letter:text-forest-900">
                    {p}
                  </p>
                ))}
              </div>

              {/* Secondary Images if multiple */}
              {item.images && item.images.length > 1 && (
                <div className="mt-10 border-t border-border pt-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-600 mb-4">
                    Photographic Records
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {item.images.slice(1).map((img, idx) => (
                      <div key={idx} className="overflow-hidden rounded-sm border border-gold-500/25 bg-cream/60 p-1.5 shadow-sm">
                        <div className="overflow-hidden rounded-sm bg-card">
                          <Image
                            src={img}
                            alt={`${item.title} - photo ${idx + 2}`}
                            className="h-48 w-full object-cover object-top"
                            fittingType="fill"
                            quality={85}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions & Sharing */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-forest-600 hover:text-gold-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All Heritage Records
                </Link>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-1.5 text-xs font-medium text-forest-700 hover:border-gold-500 hover:text-gold-600 transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-gold-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Share record'}
                  </button>
                </div>
              </div>
            </article>

            {/* Sidebar with other heritage sections */}
            <aside className="space-y-8 lg:border-l lg:border-border lg:pl-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-600">
                  Heritage Archives
                </p>
                <div className="mt-4 space-y-4">
                  {otherItems.map((h) => (
                    <Link
                      key={h.id}
                      to={`/heritage/${h.slug}`}
                      className="group block border-b border-border pb-3 transition-colors"
                    >
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {formatCategoryLabel(h.category)}
                      </span>
                      <h4 className="mt-1 font-display text-sm leading-snug text-forest-700 group-hover:text-gold-600 transition-colors line-clamp-2">
                        {h.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border border-border bg-cream/70 p-5">
                <p className="text-xs font-semibold text-forest-800 uppercase tracking-[0.2em]">
                  Preserving Our Heritage
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Do you possess oral histories, historic photographs, or ancestral records from Nkar? Help us enrich our collective archive.
                </p>
                <Link
                  to="/contact"
                  className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-600 hover:text-gold-600 transition-colors"
                >
                  Contribute Archives →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}