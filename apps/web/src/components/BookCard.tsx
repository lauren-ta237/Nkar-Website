import SampleBadge from './SampleBadge';

const accents = {
  forest: 'bg-forest-800 text-ivory border-forest-700',
  gold: 'bg-gold-500 text-forest-900 border-gold-600',
  clay: 'bg-clay-600 text-ivory border-clay-700'
};

export default function BookCard({ book }) {
  const details = [
    { label: 'Author', value: book.author },
    { label: 'Published', value: book.year },
    { label: 'Format', value: book.format },
    { label: 'Language', value: book.language },
    { label: 'Pages', value: book.pages }
  ];

  return (
    <article className="flex h-full flex-col border border-border bg-card">
      <div
        className={`relative flex min-h-[200px] flex-col justify-end p-6 pattern-toghu-light ${
          accents[book.accent] || accents.forest
        }`}
      >
        {book.sample && <SampleBadge label="Sample title" className="absolute right-4 top-4 bg-ivory" />}
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">
          Nkar Woo Land shelf
        </p>
        <h3 className="mt-3 font-display text-2xl leading-snug">{book.title}</h3>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <dl className="grid grid-cols-2 gap-3 text-xs">
          {details.map((detail) => (
            <div key={detail.label} className="border-t border-border pt-3">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {detail.label}
              </dt>
              <dd className="mt-1 text-forest-700">{detail.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{book.summary}</p>
      </div>
    </article>
  );
}