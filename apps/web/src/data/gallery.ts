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
  {
    id: "drums",
    title: "Drums beside the palace wall",
    category: "Craft & artifact",
    image: "https://media.base44.com/images/public/6ad757078130ab49a87e04d0/62163d17d_generated_2fd849ea.png",
    aspect: "wide",
    caption:
      "Carved drums with hide skins and peg tension, the traditional instruments that call families together for ceremonies and communal work.",
    sample: true,
  },
  {
    id: "dawn-hills",
    title: "The highlands at dawn",
    category: "Landscape",
    image: "https://media.base44.com/images/public/6ad757078130ab49a87e04d0/4543445c9_generated_499de304.png",
    aspect: "wide",
    caption:
      "Mist in the valley and the ridgelines emerging above it: the country Nkar farms and the horizon families look out on.",
    sample: true,
  },
  {
    id: "market-cloth",
    title: "Cloth and baskets at the market",
    category: "Village life",
    image: "https://media.base44.com/images/public/6ad757078130ab49a87e04d0/8b1c8afd3_generated_3f665c33.png",
    aspect: "wide",
    caption:
      "Folded cloth, woven baskets, and calabashes on a market table, showcasing the vibrant crafts of the village market.",
    sample: true,
  },
  {
    id: "dance",
    title: "Dance and dust at a celebration",
    category: "Ceremony",
    image: "https://media.base44.com/images/public/6ad757078130ab49a87e04d0/a61cd856f_generated_20d90f12.png",
    aspect: "wide",
    caption:
      "Dancers in patterned wraps moving in a circle at an afternoon celebration, with onlookers at the edge of the ground.",
    sample: true,
  },
  {
    id: "beadwork",
    title: "Beadwork and raffia craft",
    category: "Craft & artifact",
    image: "https://media.base44.com/images/public/6ad757078130ab49a87e04d0/25a028e3b_generated_c8837439.png",
    aspect: "square",
    caption:
      "Glass beads worked in geometric patterns beside coiled raffia fibre, representing craft traditions preserved by hand and passed on across generations.",
    sample: true,
  },
  {
    id: "granary",
    title: "A granary in the compound",
    category: "Village life",
    image: "https://media.base44.com/images/public/6ad757078130ab49a87e04d0/21f1aaff2_generated_503d9932.png",
    aspect: "wide",
    caption:
      "A raised storehouse with a conical thatched roof, with maize and calabashes stored at its foot in the tradition of a highland household.",
    sample: true,
  },
  {
    id: "calabash",
    title: "Calabashes, cups and the wine gourd",
    category: "Craft & artifact",
    image: "https://media.base44.com/images/public/6ad757078130ab49a87e04d0/553ec8193_generated_3a7a0318.png",
    aspect: "square",
    caption:
      "Burnished calabash bowls, carved cups, and a raffia gourd set out for a visitor as traditional symbols of Grassfields hospitality.",
    sample: true,
  },
];
