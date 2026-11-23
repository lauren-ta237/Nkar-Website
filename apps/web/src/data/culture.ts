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

export interface SacredSiteEntry {
  title: string;
  text: string;
  icon?: string;
}

export type CeremonialYearEntry = SacredSiteEntry;

export interface LeadershipRecord {
  id: string;
  name: string;
  era: string;
  label?: string;
  summary?: string;
  image: string;
  imageAlt?: string;
}

export const aboutLead: string[] = [
  "The Nkar Kingdom/Fondom is a community of the Cameroon Grassfields, in the Northwest Region of the country. Its people live on highland hills and farm the land around them; its fondom, its palace, and its customs carry a history that belongs to every Nkar son and daughter.",
  "The Nkar Kingdom is a traditional administrative and cultural institution comprising several villages, sub-villages, and multiple family lineages. It is governed by a traditional ruler known as the Fon, who oversees the affairs and leadership of the land alongside the Lord of the Land and Nwerong, the supreme traditional institution at the helm of governance. Together, these institutions uphold the kingdom's traditional values, customs, authority, and heritage."
];

export const aboutSections: AboutSection[] = [
  {
    id: 'history',
    eyebrow: 'Brief History of Nkar',
    title: 'Foundations and Origins of the Kingdom',
    image: images.villagePath,
    imageAlt: 'Highland path and traditional setting of the Nkar Fondom',
    paragraphs: [
      'Nkar Kingdom was founded by Fon Gwarmbi in 1100. Oral tradition and palace chronicles trace the ancient path of the Nkar people through Egypt, Ethiopia, and down through the Niger basin before their permanent settlement in Kov Nkar, where the kingdom remains anchored today. Whether through ancient migrations or primordial settlement, Nkar has cultivated a distinct sovereign culture and civilization in the Northwest Region of Cameroon.',
      'From its sacred capital at Kov Nkar, the kingdom flourished under the protection of a mystical trench where only those deemed ritually clean were permitted to reside. Across centuries, the Fondom has been governed by 25 Fons spanning eight royal dynasties interred in the sacred royal burial grounds of the Foem.',
      'Nkar is also historically celebrated for its ancient metallurgical civilization. Research validated in academic defenses (Dr. Atle Dzeawuni, 2024) established that Nkar master metallurgists instituted iron smelting in Babungo around 1400. From sacred forges, copper axes, knives, spears, and royal ceremonial ornaments were produced, establishing an enduring legacy of craftsmanship and technology across the Grassfields.'
    ]
  },
  {
    id: 'migration',
    eyebrow: 'Major Migration Routes',
    title: 'Ancestral Trajectories and Diaspora Royal Lineages',
    image: images.highlands,
    imageAlt: 'Highland ridges and migration corridors of the Grassfields',
    paragraphs: [
      'Nkar was historically one of the most expansive and influential fondoms in the Cameroon Grassfields. Over the centuries, succession disputes, regional wars, and territorial realignments led to the migration of more than 40 Nkar royal lineages across the Northwest Region and beyond, including settlements in Wimbum, Ndop Plain, Oku, Kom, Bafanji, and Boyo.',
      'A notable departure occurred around 1835 following conflict with Nso, when 10 royal families of Nkar moved to Wimbum in Donga-Mantung Division, where they are known to this day as the Mbinkar. Ancestral kola nut groves stretching continuously from Shisong right to Meluf stand as living territorial testaments to their original settlements. Eight of these royal lineages hold paramount Fai and Shufai titles today: Shuufai Ndzèngwarnyam of Tamba (Nshi-O-Doh), Fai Ndzengaala of Serbuh, Fai Ndzembulaa of Ngarbu (descendants of Fònsum Nkar), Fai Ngahkonfor of Komnkang Ndu (linked to Taadùi Nkar), Fai Ngalahnshuh of Sehn, Fai Ngahbyehmu of Tukop, Fai Ngahkfusee of Taaku, Fai Ngahkonsee of Njimnkang, as well as the royal families of Ngarum II and Nkot.',
      'In Oku, significant Nkar populations established the Nkas royal family in Eba and Simon Kov, with genealogical lineages tracing back to palace dignitaries Kibai, Leboi, and Shufai Ndzegalah. In Kom, oral history records that during their migration from Babessi to Laikom, ancestral migrants were guided safely through a dense, impassable Nkar forest by a gifted Nkar woman named Titichia. Her lineage was escorted to Kom where it gave rise to the revered royal sub-clans Ndô Titichia and Ndô Ijnasung. Despite these wide migrations, the capital of Kov Nkar remained sovereign, sacred, and unbroken.'
    ]
  },
  {
    id: 'royal-address',
    eyebrow: 'Royal Address',
    title: 'HRM The Fon of Nkar Speaks',
    image: images.fonSit,
    imageAlt: 'His Royal Majesty the Fon of Nkar on the Royal Palace Throne',
    paragraphs: [
      '"As for the Mass that is said in Nkar palace every Sunday, it is an indication that the church has to culture African values. I see and think that the church and the Nkar values have to cohabit. Before Christianity came to Nkar there already existed Nkar. We learn from scriptures that Christ did not cancel the laws of Moses, but rather strengthened them."',
      '"The church in my mind too has not come to wipe off our customs and traditions. The church rather comes along with some light, that makes us to differentiate between good and evil, between the positive and negative values. In the dark days, some people did not make any difference between the positive and the negative values. It is these negative values which Nkar people should bury, while setting a church in the palace."',
      '"I want my people to know that the church and our customs and traditions are one. Institutions like Nwerong, Ngiri, Manjong and others are the cultural identity of Nkar people. If you get to any tribe or Fondom worth it and do not see such institutions then you cannot know their identity. The church cannot therefore suppress such institutions. No, I as the Fon will not accept it."',
      '— HRM Fon Mohlo II of Nkar'
    ]
  },
  {
    id: 'geography',
    eyebrow: 'Location & Climate',
    title: 'Climate, Topography and Vegetation',
    image: images.highlands,
    imageAlt: 'Rolling green highland hills and valleys of Nkar',
    paragraphs: [
      'The indigenous Fondom of Nkar is located in the Bamenda Grassfields of the Northwest Region of Cameroon, standing as one of the largest fondoms in Bui Division. The Nkar highlands lie between latitude 6.2617°N and longitude 10.686°E, with elevations ranging from 1,650 to 2,086 meters above sea level.',
      'The kingdom shares historic boundaries on the East with the kingdom of Ndzen at Kfwenjang on River Bui; on the South at Mekwatir in Wainamah bordering Babessi; on the Southeast with Bangolan at Lake Ber and the Bamoum in the Noun Valley; on the West with Oku across the Kilum Mountain forest; and on the North with Nso.',
      'Nkar experiences a temperate highland tropical climate, with temperatures ranging between 15°C and 30°C and an average annual rainfall of 2,525 mm influenced by the Intertropical Convergence Zone (ITCZ). The landscape features a continuous tropical savannah with rich Sporobolus (kikuyu) grass cover, punctuated by ancient relic forest groves preserved at Vekovi (Ngongbaa), Kov Nkar, and Ndzerem, alongside fertile river valleys lined with ferns, mosses, and raffia palms.'
    ]
  },
  {
    id: 'economy',
    eyebrow: 'Economic Activities',
    title: 'Farming, Agriculture and Enterprise',
    image: images.nkarHillFarms,
    imageAlt: 'Terraced agricultural farms and iconic conical hill of Nkar',
    paragraphs: [
      'The people of Nkar have sustained a rich agricultural tradition grounded in the extraordinary fertility of their volcanic soils. Staple crops include maize, climbing beans, cassava, groundnuts, yams, cow peas, plantains, bananas, pumpkins, and highland huckleberry (njama-njama). Major agricultural cash crops include arabica coffee, sweet oranges, and extensive raffia palm bushes.',
      'Livestock husbandry is practiced alongside crop cultivation, with families rearing oxen, goats, sheep, and local poultry across the highland pastures.',
      'Nkar is also renowned for master raffia bamboo architecture and craftsmanship. With local bamboo, artisans design durable cupboards, beds, chairs, ceilings, stools, mats, and fences, as well as entire traditional structures. Fon Tumi Ntani II pioneered modern architecture in Bui Division by becoming the first traditional ruler to roof his palace with corrugated metal sheets.'
    ]
  },
  {
    id: 'dances',
    eyebrow: 'Social Life & Culture',
    title: 'Traditional Dances, Music and Community Life',
    image: images.palaceGathering,
    imageAlt: 'Vibrant cultural gathering and traditional dance celebration at the Nkar palace',
    paragraphs: [
      'Social life in Nkar revolves around sacred music, traditional dances, communal hunting, and royal festivals. Celebrated traditional dance societies include the Ngang, the Kikum, the Minang, and the melodious xylophone rhythms of Njang, performed during palace festivals and lineage celebrations.',
      'Communal hunting expeditions known as Yawoam were traditionally organized after controlled dry-season burns, with all captured game presented directly to the Fon at the palace before customary distribution.',
      'The kingdom observes deep spiritual reverence for mountains, ascending annually to Krumen (Taa Nkiy Nkar) to offer thanksgiving to Nyuy Nkar wo Shamwun and pray for peace and prosperity. When a Fon transitions, the kingdom observes a sacred mourning and remembrance cycle structured around twelve days, twelve weeks, twelve months, and twelve years, uniting solemn ancestral rites with celebratory feasts of communal solidarity.'
    ]
  }
];

export const traditions: Tradition[] = [
  {
    title: 'Ceremonial Toghu Regalia',
    text: 'Hand-embroidered heavy velvet cloth worn for palace ceremonies and state occasions, where royal motifs, colours, and symbolic embroidery communicate prestige and nobility.',
    icon: 'shirt'
  },
  {
    title: 'Sacred Drums & Rhythms',
    text: 'Carved wooden drums with hide tension skins that articulate royal messages, sound the alarm, assemble warriors, and lead traditional dances.',
    icon: 'drum'
  },
  {
    title: 'Carving, Beading & Raffia Craft',
    text: 'Artisanal mastery expressed in carved royal thrones, ancestor masks, beaded ceremonial calabashes, and intricate raffia architecture handed down across generations.',
    icon: 'hammer'
  },
  {
    title: 'Palace Protocol & Court Customs',
    text: 'Revered court etiquette governing access to the royal court, homage to the Fon, traditional seating orders, and proceedings of the traditional councils.',
    icon: 'crown'
  },
  {
    title: 'Hospitality & Traditional Libations',
    text: 'Fresh palm wine poured from carved gourds and breaking of the sacred kola nut, served as universal signs of goodwill, peace, and mutual covenant.',
    icon: 'utensils'
  },
  {
    title: 'Lineage Rites & Celebrations',
    text: 'Rites of naming, coronation, matrimonial covenant, funeral honours, and ancestral remembrance that unite families and ground every Nkar citizen in ancestral virtue.',
    icon: 'users'
  }
];

export const timeline: TimelineEntry[] = [
  {
    period: 'Foundational Era (c. 1100–1170)',
    title: 'Founding of the Kingdom by Fon Gwarmbi',
    text: 'Fon Gwarmbi establishes the sovereign Nkar Kingdom at Kov Nkar, protected by a mystical trench and establishing the royal Foem and dynastic governance.'
  },
  {
    period: 'Metallurgical Era (c. 1400)',
    title: 'Introduction of Iron Smelting in Babungo',
    text: 'Nkar metallurgists establish the metallurgy tradition in Babungo, forging copper axes, knives, spears, and royal regalia renowned across the Grassfields.'
  },
  {
    period: 'Regional Pacts & Diplomacy (1760–1849)',
    title: 'Reigns of Fon Kilai & Fon Somndjom II',
    text: 'Establishment of the historic friendship treaty at Tiy Minkan with Nso, affirming Nkar sacred sites and ancestral kola nut groves in Kimbo and Shisong.'
  },
  {
    period: 'Resistance & Modern Era (1855–Present)',
    title: 'Reigns of Fon Ntani I, Fon Mohlo I, Fon Tumi Ntani II & Fon Mohlo II',
    text: 'Longest peaceful reigns, defense of sovereignty during the 1906 Bamoum war, introduction of modern architecture, and royal diplomatic missions worldwide.'
  }
];

export const leadershipLead: string[] = [
  "Nkar has been governed by 24 successive sovereign Fons since its founding in 1100 by Fon Gwarmbi, with approximately eight dynasties interred in the sacred royal Foem. The Fon is enthroned by Nwerong Nkar and escorted through Lavwong, TaaKibuh, and Fai Kishiyi before assuming traditional governance.",
  "The Fon does not rule alone. Administrative authority is vectored by the Fon alongside Nwerong Nkar, the Lords of the Land (Ve Wonghi), Notables, the Queen Mother (Yah Yefon), Atav Nwerong, and the Atarntoh, ensuring harmonious governance across all institutions."
];

export const leadershipRoles: LeadershipRole[] = [
  {
    title: 'Settlement & Administration',
    text: 'Coordinates the governance of central quarters, sub-villages, and constituent lineages. The Fon is enthroned by Nwerong Nkar and led through Lavwong, TaaKibuh, and Fai Kishiyi, binding the administrative framework of the Fondom.',
    icon: 'landmark'
  },
  {
    title: 'The Fon',
    text: 'The supreme chief executive, administrative, political, and spiritual leader of Nkar Fondom. He governs in concert with the Lords of the Land (Ve Wonghi), Notables, and Nwerong Nkar, cherishing truth and justice.',
    icon: 'crown'
  },
  {
    title: 'The Spirit Fon',
    text: 'The metaphysical ruler who pertains to the spirit world, communion with ancestors, and reverence for Nyuy Nkar wo Shamwun. He oversees sacred sanctuaries, caves at Nfut and Ngomrin, and consultations at the Foem.',
    icon: 'flame'
  },
  {
    title: 'Palace Administration & Nwerong Nkar',
    text: 'The supreme regulatory institution and custodian of customary values. Nwerong enforces governance acts, holds sole legitimate authority to enthrone a Fon, and oversees the two days of atonement: Ntseri and Wailun.',
    icon: 'scroll'
  },
  {
    title: 'Lavwong & Spiritual Defense',
    text: 'Territorial and spiritual guardians of the land using Ntamir. Comprises titled lords including Shufai Kibai, Shufai Shu Kindzev, Shufai Leboi, Shufai Roombi, Shufai Nsam, Shufai Minkun, Shufai Siy, and Fai wo Kuintoh.',
    icon: 'home'
  },
  {
    title: 'The Atarntoh (Palace Knights)',
    text: 'Distinguished dignitaries chosen by the Fon and Nwerong to manage inner court affairs, receive acts of fealty, oversee royal farms and harvests, and serve as royal emissaries.',
    icon: 'shield'
  },
  {
    title: 'The Nchiylav Fai (Squire)',
    text: 'Personal attendants of the Fon who undergo nine years of immersion in palace traditions. They carry the royal throne, accompany the Fon to sacred societies, and manage intimate palace errands.',
    icon: 'award'
  },
  {
    title: 'Ngiri Nkar',
    text: 'The esteemed fraternal society of male royal descent. Ngiri safeguards royal culture, mourns members, and boosts royal dignity through sacred masked juju displays.',
    icon: 'users'
  },
  {
    title: 'Manjong Nkar',
    text: 'The defense arm of Nwerong and the land (Nsai Nkar). Manjong initiates youth into adulthood, constructs bridges and community roads, and provides physical protection and royal escort for the Fon.',
    icon: 'hammer'
  },
  {
    title: 'Queen Mothers (Yah Yefon)',
    text: 'Paramount female royal authority instituted at the enthronement of a Fon. Yah Yefon leads all female royals, holds the dignity of a Shungar, and receives royal funeral honors equal to a Fon.',
    icon: 'heart'
  },
  {
    title: 'Female Governance (Tanfen Nkar)',
    text: 'Oversees the welfare, initiation, and moral formation of female royal descendants. Tanfen accompanies princesses to marital homes, mourns royal deaths, and partners with the Fon on palace development.',
    icon: 'users-round'
  },
  {
    title: 'The Fon as a Religious Leader',
    text: 'The high priest and spiritual leader embracing belief in Nyuy Nkar wo Shamwun. The Fon embodies peace symbolized by the sacred Kikeng plant, fostering mutual harmony between indigenous values and Christian faith.',
    icon: 'sun'
  }
];

export const sacredSites: SacredSiteEntry[] = [
  {
    title: 'Nkwenjang & River Bui Frontier',
    text: 'The northeastern boundary sanctuary where Nwerong Nkar begins its ritual boundary purification along the River Bui frontier with Ndzen.',
    icon: 'mountain'
  },
  {
    title: 'Yuenih at Mbokam & Lake Ber',
    text: 'Sacred boundary sanctuaries along the southeastern frontier bordering Bangolan and the Bamoum territory of the Noun Valley.',
    icon: 'landmark'
  },
  {
    title: 'Mekwatir at Wainamah',
    text: 'Historic southern boundary sanctuary marking the sovereign border with Babessi, where traditional sacrifices for peace are solemnized.',
    icon: 'shield-check'
  },
  {
    title: 'Ngonbaa at Vekovi (Oku Frontier)',
    text: 'Hallowed mountain sanctuary above Vekovi bordering Oku in the Kilum forest, protecting the western highlands of Nkar.',
    icon: 'mountain'
  },
  {
    title: 'Kibweh Oracle Altars',
    text: 'Down the River Bui at the boundary of Noun Division, where the Fon as Chief Priest worships at sacred oracles and offers traditional sacrifices.',
    icon: 'flame'
  },
  {
    title: 'Mountain Sanctuary of Krumen (Taa Nkiy Nkar)',
    text: 'Revered mountain summit where the Nkar people make an annual pilgrimage to thank God (Nyuy Nkar wo Shamwun) for harvests and invoke divine blessings.',
    icon: 'sprout'
  },
  {
    title: 'Sacred Days of Atonement: Ntseri & Wailun',
    text: 'Two solemn traditional days of atonement observed across the entire Fondom, during which customary activities pause for communal purification and ancestral reconciliation.',
    icon: 'calendar'
  }
];

export const leadershipRecords: LeadershipRecord[] = [
  {
    id: 'fon-gwarmbi-1',
    name: 'Fon Gwarmbi I',
    era: '1170 - 1236',
    label: 'Founding Monarch',
    summary: 'Founding monarch who established the sovereign Nkar Kingdom at Kov Nkar, protected by a mystical trench.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Gwarmbi I'
  },
  {
    id: 'fon-gambo-1',
    name: 'Fon Gambo I',
    era: '1236 - 1295',
    label: 'Dynastic Succession',
    summary: 'Second ruler of Nkar, consolidating territorial boundaries and early palace institutions.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Gambo I'
  },
  {
    id: 'fon-beh',
    name: 'Fon Beh',
    era: '1295 - 1351',
    label: 'Dynastic Succession',
    summary: 'Revered ancestral monarch who strengthened agricultural settlements and lineage councils.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Beh'
  },
  {
    id: 'fon-gwarmbi-2',
    name: 'Fon Gwarmbi II',
    era: '1351 - 1410',
    label: 'Mystical Defender',
    summary: 'Celebrated for legendary mystical power and defense of the kingdom during early regional conflicts.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Gwarmbi II'
  },
  {
    id: 'fon-gambo-2',
    name: 'Fon Gambo II',
    era: '1410 - 1480',
    label: 'Dynastic Succession',
    summary: 'Reigned during the golden era of Grassfields metallurgy, expanding palace diplomatic alliances.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Gambo II'
  },
  {
    id: 'fon-mbihnkar',
    name: 'Fon Mbih Nkar',
    era: '1480 - 1547',
    label: 'Dynastic Succession',
    summary: 'Consolidated royal authority across highland quarters and fostered customary crafts.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Mbih Nkar'
  },
  {
    id: 'fon-bambo',
    name: 'Fon Bambo',
    era: '1547 - 1575',
    label: 'Dynastic Succession',
    summary: 'Preserved dynastic stability and upheld sacred rites at the ancestral Foem.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Bambo'
  },
  {
    id: 'fon-nunu-1',
    name: 'Fon Nunu I',
    era: '1575 - 1605',
    label: 'Dynastic Succession',
    summary: 'Guided the kingdom through late sixteenth-century highland trade and cultural growth.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Nunu I'
  },
  {
    id: 'fon-forchuh-1',
    name: 'Fon Forchuh I',
    era: '1605 - 1615',
    label: 'Dynastic Succession',
    summary: 'Maintained sovereign peace and customary laws across all constituent sub-villages.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Forchuh I'
  },
  {
    id: 'fon-mapiri',
    name: 'Fon Mapiri',
    era: '1615 - 1630',
    label: 'Dynastic Succession',
    summary: 'Distinguished for royal court administration and reinforcement of traditional warrior societies.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Mapiri'
  },
  {
    id: 'fon-mbunmbu',
    name: 'Fon Mbunmbu',
    era: '1630 - 1650',
    label: 'Dynastic Succession',
    summary: 'Preserved civic harmony and traditional farming land allocations across the fondom.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Mbunmbu'
  },
  {
    id: 'fon-forchuh-2',
    name: 'Fon Forchuh II',
    era: '1650 - 1670',
    label: 'Dynastic Succession',
    summary: 'Upheld ancestral traditions, palace rituals, and diplomatic covenants with neighboring territories.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Forchuh II'
  },
  {
    id: 'fon-nunu-2',
    name: 'Fon Nunu II',
    era: '1670',
    label: 'Dynastic Succession',
    summary: 'Sovereign ruler whose transition was commemorated in accordance with sacred Foem traditions.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Nunu II'
  },
  {
    id: 'fon-sembe',
    name: 'Fon Sembe',
    era: '1670 - 1681',
    label: 'Dynastic Succession',
    summary: 'Guided Nkar during late seventeenth-century community reorganization and lineage alliances.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Sembe'
  },
  {
    id: 'fon-fungung',
    name: 'Fon Fungung',
    era: '1681 - 1704',
    label: 'Dynastic Succession',
    summary: 'Strengthened the authority of Nwerong Nkar and traditional regulatory councils.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Fungung'
  },
  {
    id: 'fon-tumantir',
    name: 'Fon Tumantir',
    era: '1704 - 1725',
    label: 'Dynastic Succession',
    summary: 'Oversaw early eighteenth-century territorial protection and cultural celebrations.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Tumantir'
  },
  {
    id: 'fon-ngungmbi',
    name: 'Fon Ngungmbi',
    era: '1725',
    label: 'Dynastic Succession',
    summary: 'Revered monarch honored in the oral registry of traditional rulers of Nkar.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Ngungmbi'
  },
  {
    id: 'fon-tayouh',
    name: 'Fon Tayouh',
    era: '1725',
    label: 'Dynastic Succession',
    summary: 'Sovereign ruler recorded in the dynastic succession of the Nkar Fondom.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Tayouh'
  },
  {
    id: 'fon-kilai',
    name: 'Fon Kilai',
    era: '1725 - 1759',
    label: 'Dynastic Leader',
    summary: 'Reigned for thirty-five years, guiding diplomatic relations and establishing early boundary accords in Kimbo.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Kilai'
  },
  {
    id: 'fon-somndjom-2',
    name: 'Fon Somndjom II',
    era: '1760 - 1849',
    label: 'Historic 90-Year Reign',
    summary: 'Reigned for nearly ninety years; established the historic accord of friendship at Tiy Minkan affirming Nkar sacred sites and kola nut groves.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Somndjom II'
  },
  {
    id: 'fon-shiynteng',
    name: 'Fon Shiynteng',
    era: '1849',
    label: 'Sacred Transition',
    summary: 'Honored monarch whose sacred residence at Taanto’ (Wonnto’o Ndzên) remains an integral part of royal history and the Foem.',
    image: images.fonSit,
    imageAlt: 'Royal Throne of Nkar representing Fon Shiynteng'
  },
  {
    id: 'fon-ntani-1',
    name: 'Fon Ntani I',
    era: '1855 to 1941',
    label: '86-Year Monarch & Resistance Leader',
    summary: 'One of the longest-reigning Fons in Grassfields history. Defended sovereign integrity against the Bamoum in 1906 and guided Nkar through two World Wars.',
    image: images.fonNtani1,
    imageAlt: 'Archival portrait of Fon Ntani I of Nkar'
  },
  {
    id: 'fon-molo-1',
    name: 'Fon Mohlo I',
    era: '1942 - 1953',
    label: 'Scholar & Statesman',
    summary: 'Educated monarch literate in German (Kimforkir); represented Nkar with intellectual distinction across regional administrative forums.',
    image: images.fonMolo1,
    imageAlt: 'Historical photograph of Fon Mohlo I of Nkar'
  },
  {
    id: 'fon-tume-ntani-2',
    name: 'Fon Tumi Ntani II',
    era: '1954 - 2008',
    label: '54-Year Peacemaker & Modernizer',
    summary: 'Beloved father and peacekeeper who reigned for 54 years; pioneered modern architecture as the first ruler in Bui to roof his palace with corrugated sheets.',
    image: images.fonTumeNtani2,
    imageAlt: 'Portrait of Fon Tumi Ntani II seated in ceremonial dress'
  },
  {
    id: 'fon-molo-2',
    name: 'HRM Fon Mohlo II',
    era: '2008 - now',
    label: 'Reigning Sovereign',
    summary: 'Paramount traditional ruler of the Nkar Kingdom/Fondom, championing cultural renaissance, community development, and international diplomatic engagements.',
    image: images.fonMolo2,
    imageAlt: 'Portrait of HRM Fon Mohlo II of Nkar'
  }
];

export const ceremonialYear = sacredSites;
