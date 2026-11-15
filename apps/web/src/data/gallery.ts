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
    id: "nkar-gallery-0",
    title: "Nkar Palace & Community Grounds",
    category: "Village life",
    image: gallery,
    aspect: "wide",
    caption:
      "Life and architectural heritage within the Nkar Fondom community.",
    sample: false,
  },
  {
    id: "nkar-gallery-1",
    title: "Royal Compound & Cultural Heritage",
    category: "Ceremony",
    image: gallery1,
    aspect: "wide",
    caption:
      "Traditional gathering spaces and royal heritage within Nkar.",
    sample: false,
  },
  {
    id: "nkar-gallery-2",
    title: "Traditional Palace Architecture",
    category: "Craft & artifact",
    image: gallery2,
    aspect: "wide",
    caption:
      "Distinctive Grassfields structural design and craftsmanship in Nkar.",
    sample: false,
  },
  {
    id: "nkar-gallery-3",
    title: "Community Buildings & Courtyard",
    category: "Village life",
    image: gallery3,
    aspect: "wide",
    caption:
      "Buildings and open grounds serving the Nkar community.",
    sample: false,
  },
  {
    id: "nkar-gallery-4",
    title: "Traditional Thatched & Raffia Shrine House",
    category: "Craft & artifact",
    image: gallery4,
    aspect: "wide",
    caption:
      "Ancestral Grassfields architecture constructed with woven raffia, bamboo poles, and thick thatched roofing.",
    sample: false,
  },
  {
    id: "nkar-gallery-5",
    title: "Heritage Raffia & Bamboo Lodge",
    category: "Craft & artifact",
    image: gallery5,
    aspect: "wide",
    caption:
      "Preserved traditional building methods using natural raffia palm, earth, and thatch in Nkar.",
    sample: false,
  },
  {
    id: "nkar-gallery-6",
    title: "Village Compound & Stone Foundation",
    category: "Village life",
    image: gallery6,
    aspect: "wide",
    caption:
      "Local masonry and courtyard life across the quarters of Nkar.",
    sample: false,
  },
  {
    id: "nkar-gallery-7",
    title: "Nkar Community School & Assembly Ground",
    category: "Village life",
    image: gallery7,
    aspect: "wide",
    caption:
      "Open assembly grounds and educational facilities supporting youth in Nkar.",
    sample: false,
  },
  {
    id: "nkar-gallery-8",
    title: "The Nkar Palace Courtyard",
    category: "Ceremony",
    image: gallery8,
    aspect: "wide",
    caption:
      "The paved central courtyard of the Nkar Royal Palace framed by traditional yellow and terracotta halls.",
    sample: false,
  },
  {
    id: "nkar-gallery-11",
    title: "Sacred Hill & Highland Road of Nkar",
    category: "Landscape",
    image: gallery11,
    aspect: "wide",
    caption:
      "The iconic green conical hill rising above the red earth road and highland farms of Nkar at dusk.",
    sample: false,
  },
];