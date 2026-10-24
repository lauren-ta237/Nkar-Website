import { images } from '@/data/images';

export interface AboutSection {
  id: string;
  eyebrow: string;
  title: string;
  image: string | null;
  imageAlt?: string;
  paragraphs: string[];
  pending?: string;
}

export interface Tradition {
  title: string;
  text: string;
  icon: string;
}

export interface TimelineEntry {
  period: string;
  title: string;
  text: string;
}

export interface LeadershipRole {
  title: string;
  text: string;
  icon: string;
}

export interface CeremonialYearEntry {
  title: string;
  text: string;
}

export interface LeadershipRecord {
  id: string;
  label: string;
  era: string;
  summary: string;
}

export const aboutLead: string[] = [
  'Nkar is a village community of the Cameroon Grassfields, in the Northwest Region of the country. Its people live on highland hills and farm the land around them; its fondom, its palace and its customs carry a history that belongs to every Nkar son and daughter.',
  'This archive is being assembled by the community itself. Nothing on these pages is invented: where a name, a date or a photograph has not yet been verified with the palace and the traditional council, the record is left open and clearly marked.'
];

export const aboutSections: AboutSection[] = [
  {
    id: 'history',
    eyebrow: 'History & origins',
    title: 'Where Nkar comes from',
    image: images.villagePath,
    imageAlt: 'Illustrative image: a footpath through farmland in the Cameroon highlands',
    paragraphs: [
      'The founding account of Nkar is held in the memory of the elders and in the records of the fondom. It is told in the names of places, in the order of the quarters, and in the ceremonies that repeat the story each year.',
      'This section will carry the verified account: the founding of the village, the first families, the growth of the quarters, and the moment the fondom took its place among its neighbours.',
      'Until the custodians have confirmed it, no names, dates or events are published here. Nkar’s history belongs to Nkar, and it will be told properly.'
    ],
    pending: 'Draft section — the verified history of Nkar will be published here once confirmed by the palace and the traditional council.'
  },
  {
    id: 'people',
    eyebrow: 'The people',
    title: 'A village at home and abroad',
    image: null,
    paragraphs: [
      'Nkar is two communities at once: the families who live and farm in the village, and the sons and daughters spread across Cameroon and the world who keep the village in their lives through meetings, projects and the ceremonies they return for.',
      'This archive is being built for both. It holds village records in one place, so that distance no longer means losing the story.',
      'The language, the naming customs and the family histories of Nkar will be recorded here with the people who speak them.'
    ]
  },
  {
    id: 'culture',
    eyebrow: 'Culture & traditions',
    title: 'Cloth, drums and ceremony',
    image: images.carvedStool,
    imageAlt: 'Illustrative image: a hand-carved ceremonial stool with geometric motifs',
    paragraphs: [
      'In the Grassfields, culture is worn, danced and eaten as much as it is written. Cloth is embroidered by hand for the ceremonies of the palace and the family; drums and dance carry the meaning of the occasion; food and kola nut seal hospitality and agreement.',
      'Wood carving, beading and raffia work are living crafts here, practised by hand and handed on to those who will take them up.',
      'The pages below gather what the community holds, with each item marked until it has been confirmed for Nkar.'
    ]
  },
  {
    id: 'life',
    eyebrow: 'Village life',
    title: 'Farms, market and communal work',
    image: images.granary,
    imageAlt: 'Illustrative image: a traditional grassfields granary beside a compound',
    paragraphs: [
      'Life in Nkar follows the farming year — maize, beans, huckleberry and the raffia groves — and the rhythm of the market, the school, the health post and the communal work that keeps paths, water points and the palace standing.',
      'Community meetings bring families, village institutions and the diaspora together to decide what Nkar builds next.',
      'This section will record the working life of the village: the seasons, the trades, the institutions and the people who serve them.'
    ]
  }
];

export const traditions: Tradition[] = [
  {
    title: 'Ceremonial cloth',
    text: 'Hand-embroidered cloth worn for palace ceremonies and family celebrations, where colour and pattern mark the occasion and the standing of those who wear it.',
    icon: 'shirt'
  },
  {
    title: 'Drums, dance & music',
    text: 'Drums and dance carry meaning, calling people together, marking a death, a succession, a harvest or a welcome.',
    icon: 'drum'
  },
  {
    title: 'Carving, beading & raffia',
    text: 'Hand-worked stools, masks, staffs, beadwork and raffia — objects made to be used, kept and handed on.',
    icon: 'hammer'
  },
  {
    title: 'Palace customs',
    text: 'The practices of the fondom: how the palace is approached and kept, how the traditional council sits, and how custom is upheld across the quarters.',
    icon: 'crown'
  },
  {
    title: 'Food & hospitality',
    text: 'Kola nut, palm wine and the food of the highlands — served to a visitor before anything is discussed, as a sign of welcome and good faith.',
    icon: 'utensils'
  },
  {
    title: 'Rites of the family',
    text: 'Naming, marriage, mourning and title-taking: the ceremonies that mark the passages of a Nkar life and bind the family to the village.',
    icon: 'users'
  }
];

export const timeline: TimelineEntry[] = [
  {
    period: 'To be verified',
    title: 'The founding of Nkar',
    text: 'The founding account — the first family, the founding site and the origin of the name — to be recorded with the elders.'
  },
  {
    period: 'To be verified',
    title: 'The growth of the quarters',
    text: 'How the quarters and surrounding settlements took shape, and the families that hold them.'
  },
  {
    period: 'To be verified',
    title: 'The fondom established',
    text: 'The founding of the fondom and the line of succession of Nkar’s Fons, published only once the palace and the council confirm it.'
  },
  {
    period: 'To be verified',
    title: 'Palace, market and communal institutions',
    text: 'The building of the palace and the market, the founding of the schools, the church, the health post and the village institutions.'
  },
  {
    period: 'Today',
    title: 'Nkar at home and abroad',
    text: 'A community spread across Cameroon and the world, building water, roads, education and heritage projects together.'
  }
];

export const leadershipLead: string[] = [
  'The fondom is the heart of Nkar. The Fon holds the land, the palace and the customs of the village; the traditional council advises and upholds them; the quarter and family heads carry custom into every household.',
  'Nkar Woo Land records the institution with the dignity it deserves. Names, reign dates, portraits and biographies of the Fons are published here only after verification with the palace and the traditional council — never from unconfirmed sources.'
];

export const leadershipRoles: LeadershipRole[] = [
  {
    title: 'The Fon',
    text: 'The traditional ruler of Nkar and custodian of the land, the palace and the customs of the fondom. The Fon receives the village, confers titles, and represents Nkar in tradition.',
    icon: 'crown'
  },
  {
    title: 'The traditional council',
    text: 'Elders and title holders who advise the Fon, uphold custom, settle matters and keep the calendar of ceremonies.',
    icon: 'users'
  },
  {
    title: 'Quarter & family heads',
    text: 'Those who speak for each quarter and family, mobilise communal work, and carry decisions between the palace and the households.',
    icon: 'landmark'
  },
  {
    title: 'The palace',
    text: 'Those who keep the palace, the regalia, the drums and the ceremonies — a trust passed from one generation to the next.',
    icon: 'scroll'
  },
  {
    title: 'The development committee',
    text: 'The community organisation that plans and reports on village projects, bringing together Nkar at home and abroad.',
    icon: 'hammer'
  }
];

export const ceremonialYear: CeremonialYearEntry[] = [
  {
    title: 'Ceremonies of the farming year',
    text: 'The rites that open and close the seasons — planting, first fruits and harvest — held with the Fon and the quarter heads.'
  },
  {
    title: 'Ceremonies of the palace',
    text: 'Occasions of the fondom: thanksgivings, receptions, and the observances that belong to the palace calendar.'
  },
  {
    title: 'Ceremonies of a life',
    text: 'Naming, marriage, title-taking and mourning, each marked with the customs of the family and the quarter.'
  },
  {
    title: 'Community gatherings',
    text: 'General assemblies, communal work and meetings with the diaspora — not rites, but the working life of the village.'
  }
];

export const leadershipRecords: LeadershipRecord[] = [
  {
    id: 'record-1',
    label: 'Earliest recorded reign',
    era: 'To be verified',
    summary:
      'The first record in the sequence of Nkar’s fondom. Once the palace and the council confirm the name and the reign dates, the entry will be published here with a portrait and a short biography.'
  },
  {
    id: 'record-2',
    label: 'Second recorded reign',
    era: 'To be verified',
    summary:
      'A place is held in the register for this reign. Nothing is published until the record has been verified, out of respect for the person and the office.'
  },
  {
    id: 'record-3',
    label: 'Third recorded reign',
    era: 'To be verified',
    summary:
      'The custodians will add the verified name, reign years, mother’s line, notable works and photograph for this reign.'
  },
  {
    id: 'record-4',
    label: 'Fourth recorded reign',
    era: 'To be verified',
    summary:
      'Placeholder entry pending verification with the palace and the traditional council.'
  },
  {
    id: 'record-5',
    label: 'The present reign',
    era: 'To be verified',
    summary:
      'Details of the current Fon of Nkar will be published here once the palace confirms the wording, the title and the portrait.'
  }
];