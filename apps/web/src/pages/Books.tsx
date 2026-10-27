import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import ContentNotice from '@/components/ContentNotice';
import BookCard from '@/components/BookCard';
import LoadingState from '@/components/LoadingState';
import { booksIntro, booksNote, publicationsPolicy } from '@/data/books';
import { images } from '@/data/images';
import { useBooks } from '@/hooks/useContent';

export default function Books() {
  const booksQuery = useBooks();
  const books = booksQuery.data || [];

  return (
    <>
      <PageHero
        eyebrow="Books & publications"
        title="Written by Nkar, kept for Nkar"
        description="Books and historical resources written by Nkar sons and daughters, gathered into one shelf so that what has been written is not lost."
      />

      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <ContentNotice>{booksNote}</ContentNotice>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h2 className="font-display text-3xl leading-tight text-forest-700 md:text-4xl">
                A shelf for the works of Nkar
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-forest-800/90">
                {booksIntro}
              </p>
            </div>
            <div>
              <div className="relative aspect-[3/2] overflow-hidden border border-border">
                <Image
                  src={images.archive}
                  alt="Illustrative image: archival books and manuscript pages on a wooden table"
                  className="absolute inset-0 h-full w-full"
                  fittingType="fill"
                  quality={80}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-cream/60 py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            eyebrow="The shelf"
            title="Titles in the archive"
            description="Each entry carries the author’s own details, the year, the language and where the work can be found."
          />
          {booksQuery.isLoading ? (
            <LoadingState label="Opening the shelf…" />
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            eyebrow="How it works"
            title="Three promises to authors"
            align="center"
            ornament
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {publicationsPolicy.map((item) => (
              <article key={item.title} className="border border-border bg-card p-7">
                <h3 className="font-display text-2xl text-forest-700">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 border border-gold-500/40 bg-gold-50/70 p-8">
            <p className="font-display text-2xl text-forest-700">
              Have you written about Nkar?
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-forest-800">
              Send the title, your name, the year and where the work can be found. Academic work,
              memoirs, language books and histories are all welcome.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 bg-forest-700 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-gold-600"
            >
              Submit a publication
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}