// lucide-react ships no bundled types. This ambient declaration gives every
// named icon import the shape of an SVG icon component, so the app's lucide
// imports resolve without per-icon declarations.
declare module 'lucide-react' {
  import type { SVGProps } from 'react';

  export type LucideIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

  // Icons used in the app.
  export const AlertTriangle: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const BookOpen: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const Camera: LucideIcon;
  export const Check: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Crown: LucideIcon;
  export const Droplets: LucideIcon;
  export const Drum: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Hammer: LucideIcon;
  export const Heart: LucideIcon;
  export const Info: LucideIcon;
  export const Landmark: LucideIcon;
  export const Loader2: LucideIcon;
  export const Lock: LucideIcon;
  export const LogIn: LucideIcon;
  export const Mail: LucideIcon;
  export const MapPin: LucideIcon;
  export const Menu: LucideIcon;
  export const MinusIcon: LucideIcon;
  export const Phone: LucideIcon;
  export const Search: LucideIcon;
  export const ScrollText: LucideIcon;
  export const Send: LucideIcon;
  export const Shirt: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Sprout: LucideIcon;
  export const Utensils: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Users: LucideIcon;
  export const X: LucideIcon;
}