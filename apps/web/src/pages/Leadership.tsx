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
import { images, photoNote } from '@/data/images';
import { leadershipLead } from '@/data/culture';
import { useLeadershipContent } from '@/hooks/useContent';

export default function Leadership() {
  const { data, isLoading } = useLeadershipContent();
  const roles = data?.roles || [];
  const records = data?.records || [];
  const ceremonialYear = data?.ceremonialYear || [];

  return (
    <>
      <PageHero
        eyebrow="Traditional leadership"
        title="The Nkar fondom"
        description="The Fon, the traditional council, the quarter and family heads — and the customs that hold Nkar together across the generations."
        image={images.palacePillars}
        imageAlt="Illustrative image: carved pillars and thatched eaves of a palace courtyard"
        note={photoNote}
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
              eyebrow="Who holds what"
              title="The offices of the fondom"
              description="Each office carries a duty to the village. The wording here describes the role; the names and titles will be published as the palace confirms them."
            />
            {isLoading ? <LoadingState /> : <RolesGrid roles={roles} />}
          </div>

          <div className="mt-16">
            <SectionHeading
              eyebrow="The village year"
              title="The ceremonial year"
              description="The rites and gatherings that mark the year in Nkar, grouped by what they belong to."
            />
            {isLoading ? <LoadingState /> : <CeremonialYear items={ceremonialYear} />}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-cream/60 py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            eyebrow="Register of reigns"
            title="The Fons of Nkar — a register awaiting verification"
            description="This register is opened and left deliberately incomplete. Each reign has its place; the verified name, dates, portrait and account are published only when the palace confirms them."
          />

          {isLoading ? (
            <LoadingState label="Opening the register…" />
          ) : (
            <div className="mt-12 space-y-5">
              {records.map((record, index) => (
                <LeadershipRecord key={record.id} record={record} index={index} />
              ))}
            </div>
          )}

          <div className="mt-12 border border-gold-500/40 bg-gold-50/70 p-8">
            <p className="font-display text-2xl text-forest-700">
              Do you hold palace records or photographs?
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-forest-800">
              Family photographs, documents, regalia and accounts of past reigns help the
              custodians complete this register accurately. They will be handled with respect and
              returned.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 bg-forest-700 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-gold-600"
            >
              Offer a record to the archive
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}