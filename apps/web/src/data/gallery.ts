// gallery.ts
//
// Photographs of Nkar, its people, its crafts and its cultural activities.

import { fonSit, fonPopeAudience, fonPope } from './images';

export type GalleryAspect = "wide" | "square";

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  aspect: GalleryAspect;
  caption: string;
  sample: boolean;
}

export const galleryCategories: string[] = [
  "All",
  "Ceremony",
  "Craft & artifact",
  "Landscape",
  "Village life",
];

export const galleryItems: GalleryItem[] = [
  {
    id: "fon-throne",
    title: "The Royal Throne of the Fon",
    category: "Craft & artifact",
    image: fonSit,
    aspect: "wide",
    caption:
      "The traditional throne and royal seats of the Fon of Nkar at the palace.",
    sample: false,
  },
  {
    id: "fon-pope-audience",
    title: "Audience with Pope Francis",
    category: "Ceremony",
    image: fonPopeAudience,
    aspect: "wide",
    caption:
      "The Fon of Nkar in full traditional Tohgu regalia during a royal audience with Pope Francis at the Vatican.",
    sample: false,
  },
  {
    id: "fon-pope-blessing",
    title: "Palace Homage & Papal Blessing",
    category: "Ceremony",
    image: fonPope,
    aspect: "wide",
    caption:
      "Traditional homage and exchange of blessings during the papal audience.",
    sample: false,
  },
];