import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import ProjectCard from '@/components/ProjectCard';
import LoadingState from '@/components/LoadingState';
import { useProjects } from '@/hooks/useContent';

export default function ProjectsPreview() {
  const projectsQuery = useProjects();
  const featured = (projectsQuery.data || []).slice(0, 2);

  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Development"
            title="What Nkar is building"
            description="Water, roads, education and the palace: the projects the village is carrying together, at home and with the diaspora."
          />
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-forest-600 transition-colors hover:text-gold-600"
          >
            All projects
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {projectsQuery.isLoading ? (
          <LoadingState />
        ) : (
          <div className="mt-12 space-y-8">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}