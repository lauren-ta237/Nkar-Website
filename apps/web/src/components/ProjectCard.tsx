import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, MapPin } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { formatShortDate } from '@/lib/format';
import type { DevelopmentProject } from '@/types/api.types';

const statusStyles: Record<string, string> = {
  ongoing: 'bg-forest-700 text-ivory',
  proposed: 'bg-gold-100 text-gold-700',
  completed: 'bg-clay-600 text-ivory'
};

interface ProjectCardProps {
  project: DevelopmentProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusKey = project.status?.toLowerCase() || 'proposed';
  const statusLabel =
    statusKey === 'ongoing' ? 'Ongoing' : statusKey === 'completed' ? 'Completed' : 'Proposed';

  const milestones = (project.milestones || []).map((m: any) => ({
    date: m.date || (project.created_at || '').split('T')[0],
    text: m.title || m.text || 'Milestone achieved',
  }));

  return (
    <article className="grid overflow-hidden border border-border bg-card md:grid-cols-[0.85fr_1.15fr]">
      {project.cover_image_url ? (
        <div className="relative min-h-[240px]">
          <Image
            src={project.cover_image_url}
            alt={project.title}
            className="absolute inset-0 h-full w-full"
            fittingType="fill"
            quality={80}
          />
        </div>
      ) : (
        <div className="relative flex min-h-[200px] items-center justify-center bg-forest-800 pattern-toghu-light">
          <span className="px-8 text-center text-[10px] uppercase tracking-[0.3em] text-ivory/60">
            Photograph to be added
          </span>
        </div>
      )}

      <div className="p-8 md:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
              statusStyles[statusKey] || statusStyles.ongoing
            }`}
          >
            {statusLabel}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-gold-600" />
            {project.location}
          </span>
        </div>

        <h3 className="mt-5 font-display text-3xl leading-tight text-forest-700">
          <Link to={`/projects/${project.id}`} className="hover:text-gold-600 transition-colors">
            {project.title}
          </Link>
        </h3>
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-6">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-forest-600">
            <span>Reported progress</span>
            <span className="text-gold-600">{project.progress_percentage}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-cream">
            <div
              className="h-full bg-gold-500"
              style={{ width: `${project.progress_percentage}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {project.budget_cfa && project.budget_cfa > 0 && (
          <div className="mt-4 text-xs font-semibold text-forest-800">
            Budget:{' '}
            <span className="text-gold-700">
              {Number(project.budget_cfa).toLocaleString()} CFA
            </span>
          </div>
        )}

        {milestones.length > 0 && (
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-600">
              Milestones
            </p>
            <ul className="mt-3 space-y-2 text-xs text-forest-700">
              {milestones.map((item, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="font-mono text-muted-foreground">
                    {formatShortDate(item.date)}:
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 border-t border-border pt-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-600 hover:text-forest-700 transition-colors"
          >
            Full Dossier &amp; Milestones
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to={`/contact?subject=Inquiry%20regarding%20${encodeURIComponent(project.title)}`}
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-forest-600 transition-colors hover:text-gold-600"
          >
            Ask about this project
          </Link>
        </div>
      </div>
    </article>
  );
}
