import { Link } from 'react-router-dom';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import ContentNotice from '@/components/ContentNotice';
import ProjectCard from '@/components/ProjectCard';
import LoadingState from '@/components/LoadingState';
import { projectNote } from '@/data/projects';
import { contributeWays } from '@/data/site';
import { useProjects } from '@/hooks/useContent';

export default function Projects() {
  const projectsQuery = useProjects();
  const projects = projectsQuery.data || [];

  const countBy = (status: string) => projects.filter((project) => project.status === status).length;

  return (
    <>
      <PageHero
        eyebrow="Development projects"
        title="What Nkar is building together"
        description="Ongoing, planned and completed initiatives — water, roads, education and the palace — carried by the village and its sons and daughters abroad."
        note={projectNote}
      />

      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <ContentNotice>{projectNote}</ContentNotice>

          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
            {[
              { label: 'Ongoing', status: 'Ongoing' },
              { label: 'Planned', status: 'Planned' },
              { label: 'Completed', status: 'Completed' }
            ].map((item) => (
              <div key={item.label} className="bg-ivory p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
                  {item.label}
                </p>
                <p className="mt-3 font-display text-4xl text-forest-700">
                  {countBy(item.status)}
                </p>
              </div>
            ))}
          </div>

          {projectsQuery.isLoading ? (
            <LoadingState label="Loading the project register…" />
          ) : (
            <div className="mt-12 space-y-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-cream/60 py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            eyebrow="Take part"
            title="How to stand with a project"
            description="Every project in Nkar belongs to the community. Here is how sons and daughters at home and abroad can carry one forward."
          />

          <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {contributeWays.map((way) => (
              <div key={way.title} className="flex flex-col bg-ivory p-7">
                <h3 className="font-display text-xl text-forest-700">{way.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{way.text}</p>
                <Link
                  to={way.to}
                  className="mt-auto pt-6 text-[10px] font-semibold uppercase tracking-[0.26em] text-forest-600 transition-colors hover:text-gold-600"
                >
                  {way.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}