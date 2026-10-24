import {
  BookOpen,
  Camera,
  Crown,
  Droplets,
  Drum,
  GraduationCap,
  Hammer,
  Heart,
  Landmark,
  ScrollText,
  Shirt,
  Sprout,
  Users,
  Utensils
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  landmark: Landmark,
  drum: Drum,
  crown: Crown,
  hammer: Hammer,
  shirt: Shirt,
  utensils: Utensils,
  users: Users,
  scroll: ScrollText,
  book: BookOpen,
  camera: Camera,
  graduation: GraduationCap,
  droplet: Droplets,
  sprout: Sprout,
  heart: Heart
};

interface IconTileProps {
  name: string;
  className?: string;
}

export default function IconTile({ name, className = '' }: IconTileProps) {
  const Icon = icons[name] || Landmark;
  return (
    <span
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-gold-500/40 bg-gold-50 text-forest-700 ${className}`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
    </span>
  );
}