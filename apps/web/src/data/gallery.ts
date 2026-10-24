// gallery.ts
//
// Photographs of Nkar, its people, its crafts and its cultural activities.

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
  "Landscape",
  "Craft & artifact",
  "Ceremony",
  "Village life",
];

export const galleryItems: GalleryItem[] = [
  {
    id: "drums",
    title: "Drums beside the palace wall",
    category: "Craft & artifact",
    image: "https://media.base44.com/images/public/6ad757078130ab49a87e04d0/62163d17d_generated_2fd849ea.png",
    aspect: "wide",
    caption:
      "Carved drums with hide skins and peg tension — the instruments that call families together for ceremony and communal work.",
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
      "Folded cloth, woven baskets and calabashes on a market table — the colours and crafts that pass through the village market.",
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
      "Glass beads worked in geometric patterns beside coiled raffia fibre — crafts kept by hand and handed on.",
    sample: true,
  },
  {
    id: "granary",
    title: "A granary in the compound",
    category: "Village life",
    image: "https://media.base44.com/images/public/6ad757078130ab49a87e04d0/21f1aaff2_generated_503d9932.png",
    aspect: "wide",
    caption:
      "A raised storehouse with a conical thatched roof, maize and calabashes at its foot — the store of a farming household.",
    sample: true,
  },
  {
    id: "calabash",
    title: "Calabashes, cups and the wine gourd",
    category: "Craft & artifact",
    image: "https://media.base44.com/images/public/6ad757078130ab49a87e04d0/553ec8193_generated_3a7a0318.png",
    aspect: "square",
    caption:
      "Burnished calabash bowls, carved cups and a raffia gourd set out for a visitor — the objects of hospitality.",
    sample: true,
  },
];