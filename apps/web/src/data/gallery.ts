// gallery.ts
//
// Photographs of Nkar, its people, its crafts and its cultural activities.

import {
  fonSit,
  fonPopeAudience,
  fonPope,
  gallery,
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
  gallery11,
} from './images';

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
  {
    id: "nkar-palace-architecture",
    title: "Traditional Palace Structure",
    category: "Craft & artifact",
    image: gallery,
    aspect: "square",
    caption:
      "Traditional bamboo and timber architecture within the Nkar royal palace grounds.",
    sample: false,
  },
  {
    id: "nkar-palace-courtyard",
    title: "The Royal Palace Courtyard",
    category: "Village life",
    image: gallery1,
    aspect: "square",
    caption:
      "The main open courtyard and brick structures of the Fondom of Nkar.",
    sample: false,
  },
  {
    id: "nkar-palace-compound",
    title: "Inner Palace Walkways",
    category: "Village life",
    image: gallery2,
    aspect: "square",
    caption:
      "Paved inner compound and gathering pavilions at the Nkar palace.",
    sample: false,
  },
  {
    id: "nkar-hills-landscape",
    title: "The Hills of Nkar",
    category: "Landscape",
    image: gallery3,
    aspect: "square",
    caption:
      "Lush green hills and surrounding highlands overlooking the village of Nkar.",
    sample: false,
  },
  {
    id: "nkar-heritage-5",
    title: "Nkar Heritage & Community",
    category: "Village life",
    image: gallery4,
    aspect: "square",
    caption: "Scenes of daily life and cultural heritage in Nkar.",
    sample: false,
  },
  {
    id: "nkar-heritage-6",
    title: "Cultural Gathering in Nkar",
    category: "Ceremony",
    image: gallery5,
    aspect: "square",
    caption: "Community members gathered for traditional ceremonies in Nkar.",
    sample: false,
  },
  {
    id: "nkar-heritage-7",
    title: "Traditional Craftsmanship",
    category: "Craft & artifact",
    image: gallery6,
    aspect: "square",
    caption: "Artisanal work and traditional structures of the Nkar people.",
    sample: false,
  },
  {
    id: "nkar-heritage-8",
    title: "Nkar Village Scenery",
    category: "Landscape",
    image: gallery7,
    aspect: "square",
    caption: "Natural landscapes and pathways across the Nkar Fondom.",
    sample: false,
  },
  {
    id: "nkar-heritage-9",
    title: "Fondom Traditions",
    category: "Ceremony",
    image: gallery8,
    aspect: "square",
    caption: "Preserving the ancestral customs and rites of Nkar.",
    sample: false,
  },
  {
    id: "nkar-heritage-10",
    title: "Life in the Fondom",
    category: "Village life",
    image: gallery11,
    aspect: "square",
    caption: "People and places across the quarters of Nkar.",
    sample: false,
  },
];