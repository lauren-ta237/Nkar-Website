import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, Share2, Copy, Check, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingState from '@/components/LoadingState';
import { Image } from '@/components/ui/image';
import { formatDate } from '@/lib/format';
import { useNewsDetail, useNewsList } from '@/lib/api/news.api';

function formatCategoryLabel(cat?: string): string {
  if (!cat) return 'Announcements';
  const clean = cat.toLowerCase().replace(/_/g, ' ');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading, isError } = useNewsDetail(slug || '');
  const { data: recentNews = [] } = useNewsList({ limit: 4 });
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Article link copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-ivory py-24">
        <LoadingState label="Loading bulletin from the archives…" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-28 text-center bg-ivory">
        <div className="border border-border bg-card p-12">
          <p className="font-display text-3xl text-forest-700">Bulletin Not Found</p>
          <p className="mt-4 text-sm text-muted-foreground">
            The article you are searching for may have been archived or moved.
          </p>
          <div className="mt-8">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 bg-forest-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory hover:bg-gold-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to All Bulletins
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayDate = item.published_at || item.created_at;
  const paragraphs = (item.content || '').split('\n\n').filter(Boolean);
  const otherNews = recentNews.filter((n) => n.id !== item.id).slice(0, 3);

  return (
    <>
      {/* Header Section */}
      <section className="relative overflow-hidden bg-forest-900 text-ivory py-16 md:py-24">
        <div className="absolute inset-0 pattern-toghu-light opacity-30" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-4xl px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-gold-300/80 mb-6">
            <Link to="/" className="hover:text-gold-200 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/news" className="hover:text-gold-200 transition-colors">News</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate max-w-[200px] text-ivory/60">{item.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-gold-300">
            <span className="bg-gold-500/20 px-3 py-1 border border-gold-500/40">
              {formatCategoryLabel(item.category)}
            </span>
            <span className="flex items-center gap-1.5 text-ivory/70">
              <Calendar className="h-3.5 w-3.5 text-gold-400" />
              <time dateTime={displayDate}>{formatDate(displayDate)}</time>
            </span>
            {item.views !== undefined && item.views > 0 && (
              <span className="flex items-center gap-1.5 text-ivory/70">
                <Eye className="h-3.5 w-3.5 text-gold-400" />
                {item.views} views
              </span>
            )}
          </div>

          <h1 className="mt-6 font-display text-3xl leading-tight md:text-5xl text-ivory">
            {item.title}
          </h1>

          {item.summary && (
            <p className="mt-5 text-lg leading-relaxed text-ivory/80 font-serif italic border-l-2 border-gold-500 pl-4">
              {item.summary}
            </p>
          )}
        </div>
      </section>

      {/* Main Content Article */}
      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-4xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_260px]">
            {/* Article Body */}
            <article className="space-y-6">
              {/* Optional Cover Image */}
              {item.cover_image_url && (
                <div className="overflow-hidden border border-border shadow-sm mb-8">
                  <Image
                    src={item.cover_image_url}
                    alt={item.title}
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                </div>
              )}

              <div className="prose max-w-none space-y-5 text-base leading-relaxed text-forest-800">
                {paragraphs.map((paragraph, idx) => (
                  <p key={idx} className="first-letter:font-display first-letter:text-2xl first-letter:text-forest-900">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Share & Actions Toolbar */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                <Link
                  to="/news"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-forest-600 hover:text-gold-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All Bulletins
                </Link>

                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
                    <Share2 className="h-3.5 w-3.5" /> Share:
                  </span>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-1.5 text-xs font-medium text-forest-700 hover:border-gold-500 hover:text-gold-600 transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-gold-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                </div>
              </div>
            </article>

            {/* Sidebar / Recent Articles */}
            <aside className="space-y-8 lg:border-l lg:border-border lg:pl-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-600">
                  Recent Bulletins
                </p>
                <div className="mt-4 space-y-4">
                  {otherNews.map((news) => (
                    <Link
                      key={news.id}
                      to={`/news/${news.slug}`}
                      className="group block border-b border-border pb-3 transition-colors"
                    >
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {formatDate(news.published_at || news.created_at)}
                      </span>
                      <h4 className="mt-1 font-display text-sm leading-snug text-forest-700 group-hover:text-gold-600 transition-colors line-clamp-2">
                        {news.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border border-border bg-cream/70 p-5">
                <p className="text-xs font-semibold text-forest-800 uppercase tracking-[0.2em]">
                  Palace Communication
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Official communiqués and village council updates are archived under the authority of the Nkar Traditional Council.
                </p>
                <Link
                  to="/contact"
                  className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-600 hover:text-gold-600 transition-colors"
                >
                  Contact Secretariat →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
