import Ornament from './Ornament';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  ornament = false,
  as: Heading = 'h2'
}) {
  const centered = align === 'center';

  return (
    <header className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-600">
          {eyebrow}
        </p>
      )}
      <Heading className="mt-4 font-display text-3xl leading-tight text-forest-700 md:text-4xl">
        {title}
      </Heading>
      {ornament && (
        <Ornament className={`mt-5 ${centered ? 'justify-center' : 'justify-start'}`} />
      )}
      {description && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </header>
  );
}