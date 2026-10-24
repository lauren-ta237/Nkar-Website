import { Link } from 'react-router-dom';
import { CalendarDays, Check, MapPin } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { formatShortDate } from '@/lib/format';
import SampleBadge from './SampleBadge';

const statusStyles = {
  Ongoing: 'bg-forest-700 text-ivory',
  Planned: 'bg-gold-100 text-gold-700',
  Completed: 'bg-clay-600 text-ivory'
};

export default function ProjectCard({ project }) {
  return (
    <article className="grid overflow-hidden border border-border bg-card md:grid-cols-[0.85fr_1.15fr]">
      {project.image ? (
        <div className="relative min-h-[240px]">
          <Image
            src={project.image}
            alt={project.imageAlt || project.title}
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
              statusStyles[project.status] || statusStyles.Ongoing
            }`}
          >
            {project.status}
          </span>
          {project.sample && <SampleBadge />}
        </div>

        <h3 className="mt-5 font-display text-3xl leading-tight text-forest-700">
          {project.title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        <div className="mt-6">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-forest-600">
            <span>Reported progress</span>
            <span className="text-gold-600">{project.progress}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-cream">
            <div
              className="h-full bg-gold-500"
              style={{ width: `${project.progress}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        <ul className="mt-6 space-y-2 text-sm text-forest-800">
          {project.impact.map((line) => (
            <li key={line} className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>

        {project.updates?.length > 0 && (
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-600">
              Updates
            </p>
            <ul className="mt-3 space-y-3 text-xs leading-relaxed text-muted-foreground">
              {project.updates.map((update) => (
                <li key={update.text}>
                  <span className="text-forest-700">{formatShortDate(update.date)}</span> —{' '}
                  {update.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 text-xs text-forest-600">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
            {project.location} · {project.lead}
          </span>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-forest-600 transition-colors hover:text-gold-600"
          >
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            Ask about this project
          </Link>
        </div>
      </div>
    </article>
  );
}