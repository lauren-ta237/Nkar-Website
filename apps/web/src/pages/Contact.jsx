import { Facebook, Mail, MapPin, Phone } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import ContactForm from '@/components/ContactForm';
import { contactTopics, site } from '@/data/site';

export default function Contact() {
  const { contact } = site;

  const details = [
    { icon: MapPin, label: 'Where we are', value: contact.address, note: contact.addressNote },
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      note: contact.emailNote,
      href: `mailto:${contact.email}`
    },
    {
      icon: Phone,
      label: 'Telephone',
      value: contact.phone,
      note: contact.phoneNote,
      href: `tel:${contact.phone.replace(/\s/g, '')}`
    }
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Write to Nkar Woo Land"
        description="Records, photographs, publications, projects and corrections — the custodians read everything that reaches them."
        note="Contact details shown are placeholders until the official ones are confirmed."
      />

      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Reach us" title="Where to write" />

            <ul className="mt-8 space-y-7">
              {details.map((item) => (
                <li key={item.label} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-gold-500/40 bg-gold-50 text-forest-700">
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm text-forest-800">
                      {item.href ? (
                        <a href={item.href} className="transition-colors hover:text-gold-600">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {item.note}
                    </p>
                  </div>
                </li>
              ))}

              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-gold-500/40 bg-gold-50 text-forest-700">
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
                    Facebook
                  </p>
                  <a
                    href={contact.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-forest-800 transition-colors hover:text-gold-600"
                  >
                    Nkar Woo Land on Facebook
                  </a>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {contact.facebookNote}
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-12 border border-border bg-cream/60 p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
                What to write about
              </p>
              <ul className="mt-5 space-y-4">
                {contactTopics.map((topic) => (
                  <li key={topic.title}>
                    <p className="text-sm font-medium text-forest-700">{topic.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {topic.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border border-border bg-card p-8 md:p-10">
            <SectionHeading
              eyebrow="Send a message"
              title="Share something with the archive"
              description="Tell us what you hold or what needs correcting. Names, dates and the family or quarter are helpful where you know them."
            />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}