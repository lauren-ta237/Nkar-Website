import {
  images,
  plplInPalc,
  kirument,
  ntoh,
  fonMolo2,
  fonTumiNtani2,
  molo1,
  ntani1,
  fonSit,
} from '@/data/images';

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
  image?: string;
}

export const aboutLead: string[] = [
  "Location: The indigenous Fondom of Nkar is located in the Bamenda Grasslands in the present-day North-west Region of Cameroon. It is one among the largest Fondoms in Bui division. The indigenous Fondom of Nkar shares its Eastern boundary with the kingdoms of Ndzen at Kfwenjang in river Bui, the southern frontier at Mekwatir in Wainamah at the boundary with Babessi, South East with the fondom of Bangolan at lake Ber and the Bamun ethnic group in the Noun valley, Western borders with the Oku group in the Kilum mountain forest area and to the North with Nso’ ethnic group (IFORD 1987). Nkar highlands are found between latitude 6.2617 and longitude 10.686, at an altitude of 1650 to 2086 m above sea level."
];

export const aboutSections: AboutSection[] = [
  {
    id: 'history',
    eyebrow: 'History & origins',
    title: 'Where Nkar comes from',
    image: images.villagePath,
    imageAlt: 'Illustrative image: a footpath through farmland in the Cameroon highlands',
    paragraphs: [
      'Nkar kingdom was founded by Fon Gwarmbi in 1100. It is not yet very clear if Nkar is aborigines or came after the lost tribes of Israel. If they settled where they had always been, then we can say that Nkar began the Nkar Clan where they are settled now. They would not be the first in Africa. We already know of Lucy in East Africa.',
      'But if they are Israelites then we can trace them, since the conquest of Israel between 15th and 6th BCE. The Jews were conquered and they spread to India, Syria, Germania, France, Spain, Greece, Egypt, Portugal, America, Ethiopia, Algeria … either as Israelites, Samaritans or Jews. As such they became Islam, Christians, Jews, with diverse religions, rituals and cultures or practices.',
      'The Nkar should have passed through Egypt, Ethiopia, down to Niger, and found themselves in Kov Nkar where they are presently settled. The Miriang dance looks to have come right from Niger. It is left for the DNA to discover it. Whether as settlers or aborigines, Nkar has a unique culture in the North West Region of Cameroon.'
    ]
  },
  {
    id: 'people',
    eyebrow: 'Economic Activities',
    title: 'A village at home and abroad',
    image: plplInPalc,
    imageAlt: 'People of Nkar gathered at the palace grounds',
    paragraphs: [
      'The population of the Nkar ethnic group is involved in diverse activities some of which include: agriculture, hunting, trade and small livestock rearing. Economic operators are present and community forestry is developing in certain areas (MINFOF 2011), the fertility of their land, and the rich crops they cultivate, such as Maize, cassava, oranges, kolanuts, vegetables of all kinds, and raffia palms for wine.',
      'Their land likely also supported blacksmithing and decorative arts such as crafting and weaving, which the Nkar are known for. If their migration history suggests otherwise, it could be traced to North or West African civilizations with similar artistic traditions.'
    ]
  },
  {
    id: 'culture',
    eyebrow: 'Vegetation',
    title: 'Landscape, plant cover and water systems',
    image: kirument,
    imageAlt: 'Illustrative image: vegetation and landscape in Nkar',
    paragraphs: [
      'The advancing Sahara desert, deforestation and the farming practice of slash and burn, have produced a grass cover vegetation, called the tropical savannah, with patches of relic forests which have survived at Vekovi (Ngonghaa), Kov Nkar, Ndzerem, and in many river valleys which have grooves of palms, ferns, moss and creeping plants (Awoni, 2022).',
      'These grass lands form a continuous tropical savannah, having kikuyu (sporubus) grass cover. The alternating dry and wet seasons, causes soil wash, especially in its mountainous steep slopes. This affects the volumes of the streams, and intermittent springs, which flow from the watersheds in the hills, and sometimes completely dry out in the heart of the dry season (Yufenyuy Muhamed, 2020).'
    ]
  },
  {
    id: 'life',
    eyebrow: 'Climate',
    title: 'Temperature, rainfall and seasonal patterns',
    image: ntoh,
    imageAlt: 'Illustrative image: climate and atmosphere in Nkar',
    paragraphs: [
      'The Nkar highlands experience a tropical climate with average temperatures ranging between 15 degrees to 30 degrees with an average rainfall distribution of 2525 mm per annum (Awoni, 2022).',
      'The area experiences dry and rainy seasons, which are subjected to influences from the Sahara hot pressure belt, and its northeast trade winds, that are hot and dry. The south-west winds bring moisture from the Atlantic Ocean, accompanied by high humidity and an unstable rainy season.',
      'Rains are very often accompanied by hailstones, mist, and a constantly foggy atmosphere. The Intertropical Convergence Zone (I.T.C.Z.) moves across Nkar (Gwanfogbe & Melingui, 1993).'
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
    text: 'Hand-worked stools, masks, staffs, beadwork, and raffia: objects made to be used, preserved, and handed on to future generations.',
    icon: 'hammer'
  },
  {
    title: 'Palace customs',
    text: 'The practices of the fondom: how the palace is approached and kept, how the traditional council sits, and how custom is upheld across the quarters.',
    icon: 'crown'
  },
  {
    title: 'Food & hospitality',
    text: 'Kola nut, palm wine, and the food of the highlands, served to a visitor before anything is discussed as an enduring sign of welcome and good faith.',
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
    period: 'c. 1170',
    title: 'The Founding of Nkar',
    text: 'Nkar kingdom was founded by Fon Gwarmbi the 1st (1170 - 1236), marking the establishment of Kov Nkar and the beginning of the Nkar Clan in the Bamenda Grasslands.'
  },
  {
    period: 'c. 1400',
    title: 'Metallurgy and Early Craft',
    text: 'Nkar instituted metallurgy in the region around 1400, crafting specialized copper axes, knives, and spears with unique sacred and secret traditions.'
  },
  {
    period: '1788 - 1825',
    title: 'The Reign of Fon Kilai',
    text: 'Fon Kilai ruled for 37 years and received the Nso people at Kimbo, establishing sacred sites and traditional boundaries.'
  },
  {
    period: '1855 - 1941',
    title: 'The Reign of Fon Ntani I',
    text: 'Fon Ntani I reigned for decades, fought the Bamoum people in 1906, monitored both World Wars, and signed historic agreements.'
  },
  {
    period: '2008 - Present',
    title: 'The Reign of Fon Mohlo II',
    text: 'Fon Mohlo II ascended to the throne in 2008, guiding the Nkar Clan into modern times while preserving its rich cultural and traditional heritage.'
  }
];

export const leadershipLead: string[] = [
  'The fondom is the heart of Nkar. The Fon holds the land, the palace and the customs of the village; the traditional council advises and upholds them; the quarter and family heads carry custom into every household.',
  'NKAR WOO LÀN records the institution with the dignity it deserves. Names, reign dates, portraits, and biographies of the Fons are published here only after formal verification with the palace and the traditional council, avoiding unconfirmed sources.'
];

export const leadershipRoles: LeadershipRole[] = [
  {
    title: 'The Fon',
    text: 'The overall chief executive and spiritual, administrative, political, and religious leader of Nkar. He rules alongside the Ve Wonghi (Lords of the land), Notables, Nwerong, and Ngiri, acting as the ultimate commander whose analyzed verdicts stand.',
    icon: 'crown'
  },
  {
    title: 'Nwerong Nkar',
    text: 'The regulatory institution and custodian of customary and traditional values. It ensures the implementation of governance acts, disciplines wrongdoers, observes days of atonement (Ntseri and Wailun), and holds the sole legitimate authority to enthrone or dethrone a Fon.',
    icon: 'shield'
  },
  {
    title: 'Lavwong & Spiritual Lords',
    text: 'In charge of the spiritual and geographic management of the land. Members (Wirwong) and Ntamir defenders continually appease the gods, perform sacrifices across sacred boundaries, and manage the spiritual defense of the Fondom.',
    icon: 'landmark'
  },
  {
    title: 'Ngiri Nkar',
    text: 'The society of all males of royal descent. It mourns member deaths, boosts the image of the royal family through juju displays, and transmits acts of governance across royal lineages.',
    icon: 'users'
  },
  {
    title: 'Manjong Nkar',
    text: 'The defense arm of Nwerong and the land (Nsai Nkar). It initiates adolescents into adulthood, handles physical defense, and constructs bridges, roads, and infrastructure alongside the Fon.',
    icon: 'hammer'
  },
  {
    title: 'Queen Mothers (Yah Yefon & Shungar)',
    text: 'Leaders of the female royal family at any given time. The reigning Fon\'s mother automatically becomes Yah to administer queen mothers, liaise with Tanfen, and maintain palace prestige.',
    icon: 'star'
  },
  {
    title: 'Tanfen Nkar',
    text: 'The female institution of governance that cares for female royal descendants, initiates the young into adulthood, accompanies princesses to their marital homes, and assists with palace projects.',
    icon: 'scroll'
  },
  {
    title: 'Atarntoh & Nchiylav Fai',
    text: 'Palace knights and squires chosen to manage inner court issues, handle daily visits, oversee fealty payments, carry the sacred throne, and run intimate administrative errands for the Fon.',
    icon: 'award'
  }
];

export const ceremonialYear: CeremonialYearEntry[] = [
  {
    title: 'Days of Atonement (Ntseri and Wailun)',
    text: 'The sacred days observed by Nwerong Nkar for the spiritual cleansing and atonement of the land and its people.'
  },
  {
    title: 'Sacred Site Pilgrimages',
    text: 'Annual and periodic rites led by the Fon and Nwerong to sacred sites such as Krumen (Taa Nkiy Nkar) to thank God (Nyuy Nkar wo Shamwun) for blessings, along with sacrifices at Lake Ber, Nkwenjang, and Kibweh.'
  },
  {
    title: 'Funerary Feasts & Rites',
    text: 'The structured 12-day, 12-week, 12-month, and 12-year traditional funerary customs and celebratory feasts marking the transition of a Fon.'
  },
  {
    title: 'Palace & Communal Gatherings',
    text: 'Seasonal observances including Manjong-led community works, agricultural first fruits, and palace court assemblies uniting Nkar at home and abroad.'
  }
];

export const leadershipRecords: LeadershipRecord[] = [
  {
    id: 'record-25',
    label: 'Mohlo 2nd',
    era: '2008 - present',
    summary: 'The current reigning Fon of Nkar, championing the cohabitation of Christian faith and traditional Nkar identity.',
    image: fonMolo2
  },
  {
    id: 'record-24',
    label: 'Tumi Ntani the 2nd',
    era: '1954 - 2008',
    summary: 'A peaceful and loving father to all, remembered as a great peacekeeper with unforgettable stories and traditional legacies, and the first to roof his palace with corrugated metal sheets.',
    image: fonTumiNtani2
  },
  {
    id: 'record-23',
    label: 'Mohlo 1st',
    era: '1942 - 1953',
    summary: 'Reigned for eleven years (the shortest ever for an Nkar Fon); could read and write German, locally referred to as Kimforkir.',
    image: molo1
  },
  {
    id: 'record-22',
    label: 'Ntani the 1st',
    era: '1855 - 1941',
    summary: 'One of the longest reigning Fons. Received Nso, signed a pact of friendship, fought the Bamoum people in 1906, and monitored WWI and WWII.',
    image: ntani1
  },
  {
    id: 'record-21',
    label: 'Shiynteng',
    era: '1849',
    summary: 'Faced a mystical illness where his head increased in size; transferred to Taanto’ (Wonnto’o Ndzên) per tradition where a Fon remains a Fon until death.',
    image: fonSit
  },
  {
    id: 'record-20',
    label: 'Somndjom the 2nd',
    era: '1760 - 1849',
    summary: 'Said to have ruled for ninety years; made a landmark agreement at Tiy Minkan with Nso regarding boundaries, peace, and cultural ties.',
    image: fonSit
  },
  {
    id: 'record-19',
    label: 'Kilai',
    era: '1725 - 1759',
    summary: 'Ruled for thirty-five years, maintaining the historical leadership line.',
    image: fonSit
  },
  {
    id: 'record-18',
    label: 'Tayouh',
    era: '1725',
    summary: 'Eighteenth recorded reign in the historical sequence.',
    image: fonSit
  },
  {
    id: 'record-17',
    label: 'Ngungmbi',
    era: '1725',
    summary: 'Seventeenth recorded traditional leader of Nkar.',
    image: fonSit
  },
  {
    id: 'record-16',
    label: 'Tumantir',
    era: '1704 - 1725',
    summary: 'Sixteenth recorded reign in the traditional register.',
    image: fonSit
  },
  {
    id: 'record-15',
    label: 'Fungung',
    era: '1681 - 1704',
    summary: 'Fifteenth recorded traditional ruler in Nkar history.',
    image: fonSit
  },
  {
    id: 'record-14',
    label: 'Sembe',
    era: '1670 - 1681',
    summary: 'Fourteenth recorded reign in the sequence of Nkar Fons.',
    image: fonSit
  },
  {
    id: 'record-13',
    label: 'Nunu the 2nd',
    era: '1670',
    summary: 'Thirteenth recorded traditional leader of Nkar.',
    image: fonSit
  },
  {
    id: 'record-12',
    label: 'Forchuh the 2nd',
    era: '1650 - 1670',
    summary: 'Twelfth recorded reign in the historical register.',
    image: fonSit
  },
  {
    id: 'record-11',
    label: 'Mbunmbu',
    era: '1630 - 1650',
    summary: 'Eleventh recorded traditional ruler of Nkar.',
    image: fonSit
  },
  {
    id: 'record-10',
    label: 'Mapiri',
    era: '1615 - 1630',
    summary: 'Tenth recorded reign in the sequence of traditional leadership.',
    image: fonSit
  },
  {
    id: 'record-9',
    label: 'Forchuh the 1st',
    era: '1605 - 1615',
    summary: 'Ninth recorded reign in the register of Nkar Fons.',
    image: fonSit
  },
  {
    id: 'record-8',
    label: 'Nunu the 1st',
    era: '1575 - 1605',
    summary: 'Eighth recorded traditional ruler of Nkar.',
    image: fonSit
  },
  {
    id: 'record-7',
    label: 'Bambo',
    era: '1547 - 1575',
    summary: 'Seventh recorded reign in the history of the Nkar fondom.',
    image: fonSit
  },
  {
    id: 'record-6',
    label: 'MbihNkar',
    era: '1480 - 1547',
    summary: 'Sixth recorded reign in the chronological sequence of traditional leaders.',
    image: fonSit
  },
  {
    id: 'record-5',
    label: 'Gambo the 2nd',
    era: '1410 - 1480',
    summary: 'Fifth recorded reign in the historical lineage of Nkar.',
    image: fonSit
  },
  {
    id: 'record-4',
    label: 'Gwarmbi the 2nd',
    era: '1351 - 1410',
    summary: 'Said to have been mystically very powerful, capable of causing lions to appear by throwing stones and conjuring clouds used in warfare.',
    image: fonSit
  },
  {
    id: 'record-3',
    label: 'Beh',
    era: '1295 - 1351',
    summary: 'Third recorded reign in the chronological register of Nkar Fons.',
    image: fonSit
  },
  {
    id: 'record-2',
    label: 'Gambo the 1st',
    era: '1236 - 1295',
    summary: 'Second recorded reign in the historical sequence of Nkar traditional leadership.',
    image: fonSit
  },
  {
    id: 'record-1',
    label: 'Gwarmbi the 1st',
    era: '1170 - 1236',
    summary: 'The first recorded Fon in the sequence of Nkar’s fondom, founding the kingdom in 1100.',
    image: fonSit
  }
];