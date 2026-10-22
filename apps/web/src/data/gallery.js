import { images } from '@/data/images';

export const galleryCategories = [
  'All',
  'Landscape',
  'Craft & artifact',
  'Ceremony',
  'Village life'
];

export const galleryItems = [
  {
    id: 'drums',
    title: 'Drums beside the palace wall',
    category: 'Craft & artifact',
    image: images.drums,
    aspect: 'wide',
    caption:
      'Carved drums with hide skins and peg tension — the instruments that call families together for ceremony and communal work.',
    sample: true
  },
  {
    id: 'dawn-hills',
    title: 'The highlands at dawn',
    category: 'Landscape',
    image: images.dawnHills,
    aspect: 'wide',
    caption:
      'Mist in the valley and the ridgelines emerging above it: the country Nkar farms and the horizon families look out on.',
    sample: true
  },
  {
    id: 'market-cloth',
    title: 'Cloth and baskets at the market',
    category: 'Village life',
    image: images.marketCloth,
    aspect: 'wide',
    caption:
      'Folded cloth, woven baskets and calabashes on a market table — the colours and crafts that pass through the village market.',
    sample: true
  },
  {
    id: 'dance',
    title: 'Dance and dust at a celebration',
    category: 'Ceremony',
    image: images.dance,
    aspect: 'wide',
    caption:
      'Dancers in patterned wraps moving in a circle at an afternoon celebration, with onlookers at the edge of the ground.',
    sample: true
  },
  {
    id: 'beadwork',
    title: 'Beadwork and raffia craft',
    category: 'Craft & artifact',
    image: images.beadwork,
    aspect: 'square',
    caption:
      'Glass beads worked in geometric patterns beside coiled raffia fibre — crafts kept by hand and handed on.',
    sample: true
  },
  {
    id: 'granary',
    title: 'A granary in the compound',
    category: 'Village life',
    image: images.granary,
    aspect: 'wide',
    caption:
      'A raised storehouse with a conical thatched roof, maize and calabashes at its foot — the store of a farming household.',
    sample: true
  },
  {
    id: 'calabash',
    title: 'Calabashes, cups and the wine gourd',
    category: 'Craft & artifact',
    image: images.calabash,
    aspect: 'square',
    caption:
      'Burnished calabash bowls, carved cups and a raffia gourd set out for a visitor — the objects of hospitality.',
    sample: true
  }
];