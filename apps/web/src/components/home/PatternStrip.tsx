import { Image } from '@/components/ui/image';
import { images } from '@/data/images';

export default function PatternStrip() {
  return (
    <section className="relative h-40 overflow-hidden bg-forest-900 md:h-52">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={images.patternBand}
          alt="Illustrative image: a geometric grassfields embroidery pattern"
          className="h-full w-full"
          fittingType="fill"
          quality={80}
        />
      </div>
      <div className="absolute inset-0 bg-forest-900/45" aria-hidden="true" />
      <div className="relative flex h-full items-center justify-center px-6 text-center">
        <p className="font-display text-2xl italic text-ivory md:text-3xl">
          Heritage kept by hand, passed on by hand.
        </p>
      </div>
    </section>
  );
}