import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import ContentNotice from '@/components/ContentNotice';
import LoadingState from '@/components/LoadingState';
import LeadershipRecord from '@/components/LeadershipRecord';
import RolesGrid from '@/components/leadership/RolesGrid';
import CeremonialYear from '@/components/leadership/CeremonialYear';
import { images } from '@/data/images';
import { leadershipLead, leadershipRoles, ceremonialYear } from '@/data/culture';
import { useLeadershipList } from '@/lib/api/leadership.api';

export default function Leadership() {
  const { data: leaders = [], isLoading } = useLeadershipList();

  const sortedLeaders = useMemo(
    () => [...leaders].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
    [leaders]
  );

  return (
    <>
      <PageHero
        eyebrow="Traditional leadership"
        title="The Nkar Indigenous Kingdom/Fondom"
        description="The Fon, the traditional council, the Lord of the Land, Nwerong, and the revered institutions that uphold sovereignty and harmony across generations."
        image={images.palacePillars}
        imageAlt="The royal palace throne of the Fon of Nkar"
      />

      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <ContentNotice title="How records are published">
            Names, reign dates, portraits and biographies of the Fons of Nkar are published here
            only after verification with the palace and the traditional council. Nothing is
            published from unconfirmed sources, and any record is corrected or withdrawn at the
            family’s request.
          </ContentNotice>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-5 text-base leading-relaxed text-forest-800/90">
              {leadershipLead.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-border">
              <Image
                src={images.regalia}
                alt="Illustrative image: traditional regalia laid out on a woven mat"
                className="absolute inset-0 h-full w-full"
                fittingType="fill"
                quality={80}
              />
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading
              eyebrow="Traditional Governance"
              title="The Traditional Institutions of Nkar"
              description="The traditional administrative and governing bodies that maintain sovereignty, law, cultural continuity, and community harmony across the Fondom."
            />
            <RolesGrid roles={leadershipRoles} />
          </div>

          <div className="mt-16">
            <SectionHeading
              eyebrow="Sacred Sites & Rites"
              title="Nkar Sites and Traditional Sacrifices"
              description="Hallowed ancestral sites, highland sanctuaries, and customary rites observed by the palace and lineage custodians to preserve peace, fertility, and divine blessing."
            />
            <CeremonialYear items={ceremonialYear} />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-cream/60 py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            eyebrow="Register of reigns"
            title="The Fons of Nkar: Register of Traditional Leadership"
            description="The revered succession of sovereign Fons of the Nkar Fondom, honoring their names, eras of rule, and royal stewardship."
          />

          {isLoading ? (
            <LoadingState label="Consulting the royal register…" />
          ) : sortedLeaders.length === 0 ? (
            <div className="mt-12 p-8 text-center border border-border bg-card">
              <p className="text-sm text-muted-foreground italic">
                No leadership records currently indexed in the public register.
              </p>
            </div>
          ) : (
            <div className="mt-12 space-y-6">
              {sortedLeaders.map((record, index) => (
                <LeadershipRecord key={record.id} record={record} index={index} />
              ))}
            </div>
          )}

          <div className="mt-16 border-t border-border pt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Have confirmed dates, photographs or historical notes to add to this register?
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-forest-700 transition-colors hover:text-gold-700"
            >
              Write to the heritage custodians
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
