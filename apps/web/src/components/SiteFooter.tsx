import { Link } from 'react-router-dom';
import { Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { navLinks, site } from '@/data/site';
import Ornament from './Ornament';
import HeritageBorder from './HeritageBorder';

const takePart = [
  { label: 'Share a story', to: '/contact' },
  { label: 'Send photographs', to: '/contact' },
  { label: 'Add a publication', to: '/books' },
  { label: 'Support a project', to: '/projects' },
  { label: 'Meetings & events', to: '/news' }
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-forest-900 text-ivory">
      <div className="absolute inset-0 pattern-toghu-light opacity-25" aria-hidden="true" />
      <HeritageBorder variant="diamond" className="absolute inset-x-0 top-0 z-10" />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          <div>
            <p className="font-display text-3xl text-gold-300">{site.name}</p>
            <p className="mt-3 font-display text-lg italic text-ivory/80">{site.tagline}</p>
            <Ornament className="mt-6 justify-start" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/60">
              {site.promise}
            </p>
          </div>

          <nav aria-label="Explore the site">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-300">
              Explore
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-ivory/70 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Take part">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-300">
              Take part
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {takePart.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-ivory/70 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/search"
                  className="text-ivory/70 transition-colors hover:text-gold-300"
                >
                  Search the archive
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-300">
              Contact
            </p>
            <ul className="mt-5 space-y-5 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span className="text-ivory/70">
                  {site.contact.address}
                  <span className="mt-1 block text-[11px] text-ivory/40">
                    {site.contact.addressNote}
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span className="text-ivory/70">
                  <a href={`mailto:${site.contact.email}`} className="hover:text-gold-300">
                    {site.contact.email}
                  </a>
                  <span className="mt-1 block text-[11px] text-ivory/40">
                    {site.contact.emailNote}
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span className="text-ivory/70">
                  <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="hover:text-gold-300">
                    {site.contact.phone}
                  </a>
                  <span className="mt-1 block text-[11px] text-ivory/40">
                    {site.contact.phoneNote}
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <Facebook className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span className="text-ivory/70">
                  <a
                    href={site.contact.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gold-300"
                  >
                    Nkar Woo Land on Facebook
                  </a>
                  <span className="mt-1 block text-[11px] text-ivory/40">
                    {site.contact.facebookNote}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-ivory/10 pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-ivory/50">
            {site.contentPolicy}
          </p>
          <div className="mt-6 flex flex-col gap-3 text-[10px] uppercase tracking-[0.24em] text-ivory/45 md:flex-row md:items-center md:justify-between">
            <p>© {year} {site.name}</p>
            <p>Built for Nkar sons and daughters, at home and abroad</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
