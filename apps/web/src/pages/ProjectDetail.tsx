import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Coins,
  Clock,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingState from '@/components/LoadingState';
import { Image } from '@/components/ui/image';
import { formatShortDate } from '@/lib/format';
import { useProjectDetail, useProjectsList } from '@/lib/api/projects.api';

const statusStyles: Record<string, string> = {
  ongoing: 'border-forest-600 bg-forest-700 text-ivory',
  proposed: 'border-gold-500 bg-gold-100 text-gold-700',
  completed: 'border-clay-600 bg-clay-600 text-ivory',
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = useProjectDetail(id || '');
  const { data: allProjects = [] } = useProjectsList();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Project link copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-ivory py-24">
        <LoadingState label="Loading project dossier…" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-28 text-center bg-ivory">
        <div className="border border-border bg-card p-12">
          <p className="font-display text-3xl text-forest-700">Project Not Found</p>
          <p className="mt-4 text-sm text-muted-foreground">
            The community project you are looking for could not be found or has been relocated.
          </p>
          <div className="mt-8">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-forest-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory hover:bg-gold-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to All Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusKey = project.status?.toLowerCase() || 'proposed';
  const statusLabel =
    statusKey === 'ongoing' ? 'Ongoing Initiative' : statusKey === 'completed' ? 'Completed Project' : 'Proposed Initiative';

  const milestones = (project.milestones || []).map((m: any) => ({
    date: m.date || (project.created_at || '').split('T')[0],
    text: m.title || m.text || 'Milestone achieved',
    completed: Boolean(m.completed ?? true),
  }));

  const otherProjects = allProjects.filter((p) => p.id !== project.id).slice(0, 3);

  return (
    <>
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-forest-900 text-ivory py-16 md:py-24">
        <div className="absolute inset-0 pattern-toghu-light opacity-30" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-5xl px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-gold-300/80 mb-6">
            <Link to="/" className="hover:text-gold-200 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/projects" className="hover:text-gold-200 transition-colors">Development Projects</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate max-w-[200px] text-ivory/60">{project.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-gold-300">
            <span className={`px-3 py-1 border ${statusStyles[statusKey] || statusStyles.ongoing}`}>
              {statusLabel}
            </span>
            <span className="flex items-center gap-1.5 text-ivory/70">
              <MapPin className="h-3.5 w-3.5 text-gold-400" />
              {project.location}
            </span>
          </div>

          <h1 className="mt-6 font-display text-3xl leading-tight md:text-5xl text-ivory">
            {project.title}
          </h1>
        </div>
      </section>

      {/* Main Project Details */}
      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            {/* Project Content */}
            <article className="space-y-8">
              {/* Cover Image */}
              {project.cover_image_url ? (
                <div className="overflow-hidden border border-border shadow-sm">
                  <Image
                    src={project.cover_image_url}
                    alt={project.title}
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                </div>
              ) : (
                <div className="flex min-h-[240px] items-center justify-center bg-forest-800 pattern-toghu-light border border-border">
                  <span className="text-xs uppercase tracking-[0.3em] text-ivory/60">
                    Photograph documentation to be archived
                  </span>
                </div>
              )}

              {/* Progress Bar Card */}
              <div className="border border-border bg-card p-6 md:p-8 space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-forest-700">
                  <span>Project Execution Progress</span>
                  <span className="text-gold-600 text-sm">{project.progress_percentage}%</span>
                </div>
                <div className="h-2.5 w-full bg-cream overflow-hidden border border-border/40">
                  <div
                    className="h-full bg-gold-500 transition-all duration-500"
                    style={{ width: `${project.progress_percentage}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-display text-2xl text-forest-700 mb-4">
                  Scope &amp; Community Impact
                </h3>
                <div className="prose max-w-none text-base leading-relaxed text-forest-800 space-y-4">
                  {project.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Milestones Timeline */}
              {milestones.length > 0 && (
                <div className="border-t border-border pt-8">
                  <h3 className="font-display text-2xl text-forest-700 mb-6">
                    Key Milestones &amp; Implementation Phases
                  </h3>
                  <div className="space-y-4">
                    {milestones.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 border border-border bg-card p-5"
                      >
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-gold-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-mono text-muted-foreground">
                            {formatShortDate(item.date)}
                          </p>
                          <p className="mt-1 text-sm font-medium text-forest-800">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions & Sharing */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-forest-600 hover:text-gold-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All Projects
                </Link>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-1.5 text-xs font-medium text-forest-700 hover:border-gold-500 hover:text-gold-600 transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-gold-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Share project'}
                  </button>
                </div>
              </div>
            </article>

            {/* Sidebar Details */}
            <aside className="space-y-8 lg:border-l lg:border-border lg:pl-8">
              <div className="border border-border bg-card p-6 space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-600">
                  Project Dossier
                </p>
                <div className="space-y-4 text-sm divide-y divide-border/60">
                  <div className="pt-2">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Location</span>
                    <span className="font-medium text-forest-800 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-gold-600" />
                      {project.location}
                    </span>
                  </div>

                  {project.budget_cfa && project.budget_cfa > 0 && (
                    <div className="pt-3">
                      <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Estimated Budget</span>
                      <span className="font-semibold text-gold-700 flex items-center gap-1.5 mt-0.5">
                        <Coins className="h-3.5 w-3.5 text-gold-600" />
                        {Number(project.budget_cfa).toLocaleString()} CFA
                      </span>
                    </div>
                  )}

                  {project.start_date && (
                    <div className="pt-3">
                      <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Timeline</span>
                      <span className="text-forest-700 flex items-center gap-1.5 mt-0.5 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-gold-600" />
                        Started: {formatShortDate(project.start_date)}
                        {project.completion_date && ` · Target: ${formatShortDate(project.completion_date)}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <Link
                    to={`/contact?subject=Inquiry%20regarding%20${encodeURIComponent(project.title)}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-forest-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-ivory hover:bg-gold-600 transition-colors"
                  >
                    Support / Inquire
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {otherProjects.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-600">
                    Other Initiatives
                  </p>
                  <div className="mt-4 space-y-4">
                    {otherProjects.map((p) => (
                      <Link
                        key={p.id}
                        to={`/projects/${p.id}`}
                        className="group block border-b border-border pb-3 transition-colors"
                      >
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {p.location}
                        </span>
                        <h4 className="mt-1 font-display text-sm leading-snug text-forest-700 group-hover:text-gold-600 transition-colors line-clamp-2">
                          {p.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
