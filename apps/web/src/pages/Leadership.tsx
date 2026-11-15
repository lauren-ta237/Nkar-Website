import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import LoadingState from '@/components/LoadingState';
import LeadershipRecord from '@/components/LeadershipRecord';
import RolesGrid from '@/components/leadership/RolesGrid';
import CeremonialYear from '@/components/leadership/CeremonialYear';
import { images, fonInKirmt } from '@/data/images';
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
        description="The Fon, the traditional council, the quarter and family heads, and the customs that unite Nkar across generations."
        image={images.palacePillars}
        imageAlt="The royal palace throne of the Fon of Nkar"
      />

      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mt-4 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-4 text-base leading-relaxed text-forest-800/90">
              <h3 className="font-display text-2xl text-forest-700">
                The Fon on Church and Culture
              </h3>
              <blockquote className="space-y-4 border-l-2 border-gold-500 pl-4 italic text-forest-800/90">
                <p>
                  &ldquo;As for the Mass that is said in Nkar palace every Sunday, it is an indication that the church has to culture African values. I see and think that the church and the Nkar values have to cohabit.&rdquo;
                </p>
                <p>
                  &ldquo;Before Christianity came to Nkar there already existed Nkar. We learn from scriptures that Christ did not cancel the laws of Moses, but rather strengthened them. The church in my mind too has not come to wipe off our customs and traditions. The church rather comes along with some light, that makes us to differentiate between good and evil, between the positive and negative values.&rdquo;
                </p>
                <p>
                  &ldquo;I want my people to know that the church and our customs and traditions are one. Institutions like Nwerong, Ngiri, Manjong and others are the cultural identity of Nkar people. If you get to any tribe or Fondom worth it and do not see such institutions then you cannot know their identity. The church cannot therefore suppress such institutions. No, I as the Fon will not accept it.&rdquo;
                </p>
              </blockquote>
              <p className="text-sm font-semibold tracking-wide text-gold-600 uppercase pt-2">
                — HRM Fon Moolo II of Nkar
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden border border-border">
              <Image
                src={fonInKirmt}
                alt="The Fon of Nkar in traditional regalia"
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
              description="Nkar has had 24 Fons since 1100, starting with Fon Gwarmbi. There are about eight dynasties in the Foem (Burial area for the Fons). The Fons are enthroned by Nwerong Nkar (a regulatory institution of the people), then taken to the Lavwong, to TaaKibuh, and then to the Fai Kishiyi, before other places."
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
            title="The Fons of Nkar: Register of Traditional Leadership"
            description="The complete chronological succession of the Fons who have ruled the Fondom of Nkar from its founding by Fon Gwarmbi the 1st in 1100 to the present reign of HRM Fon Mohlo II."
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