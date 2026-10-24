import IconTile from '@/components/IconTile';
import SampleBadge from '@/components/SampleBadge';
import Reveal from '@/components/Reveal';
import type { LeadershipRole } from '@/data/culture';

interface RolesGridProps {
  roles: LeadershipRole[];
}

export default function RolesGrid({ roles }: RolesGridProps) {
  return (
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role, index) => (
        <Reveal key={role.title} delay={index * 0.05}>
          <article className="flex h-full flex-col border border-border bg-card p-7">
            <IconTile name={role.icon} />
            <h3 className="mt-5 font-display text-2xl text-forest-700">{role.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{role.text}</p>
            <SampleBadge className="mt-5 self-start" label="To be verified" />
          </article>
        </Reveal>
      ))}
    </div>
  );
}