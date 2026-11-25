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
  "The indigenous Kingdom/Fondom of Nkar is located in the Bamenda Grasslands in the present-day North-west Region of Cameroon. It is one among the largest Fondom in Bui division. The indigenous Fondom of Nkar shares its Eastern boundary with the kingdoms of Ndzen at Kfwenjang in river Bui, the southern frontier at Mekwatir in Wainamah at the boundary with Babessi, South East with the fondom of Bangolan at lake Ber and the Bamun ethnic group in the Noun valley, Western borders with the Oku group in the Kilum mountain forest area and to the North with Nso' ethnic group in the north (IFORD 1987). Nkar highlands are found between latitude 6.2617 and longitude 10.686, at an altitude of 1650 to 2086 m, above sea level."
];

export const aboutSections: AboutSection[] = [
  {
    id: 'history',
    eyebrow: 'BRIEF HISTORY OF NKAR',
    title: 'Brief History Of Nkar People',
    image: images.villagePath,
    imageAlt: 'Highland path and traditional setting of the Nkar Fondom',
    paragraphs: [
      'Nkar kingdom was founded by Fon Gwarmbi in 1100. It is not yet very clear if Nkar is aborigines or came after the lost tribes of Israel. If they settled where they had always been, then we can say that Nkar began the Nkar Clan where they are settled now. They would not be the first in Africa. We already know of Lucy in East Africa. But if they are Israelites then we can trace them, since the conquest of Israel between 15th and 6th BCE. The Jews were conquered and they spread to India, Syria, Germania, France, Spain, Greece, Egypt, Portugal, America, Ethiopia, Algeria … either as Israelites, Samaritans or Jews. As such they became Islam, Christians, Jews, with diverse religions, rituals and cultures or practices. The Nkar should have passed through Egypt, Ethiopia, down to Niger, and found themselves in Kov Nkar where they are presently settled. The Miriang dance looks to have come right from Niger. It is left for the DNA to discover it. Whether as settlers or aborigines, Nkar has a unique culture in the North West Region of Cameroon.',
      'Settlement and administration\nNkar has 24 Fons since 1100, starting with Fon Gwarmbi. There are about eight dynasties in the Foem (Burial area for the Fons). The Fons are enthroned by Nwerong Nkar (A regulatory institution of the people). Then he is taken to the Lav wong, to TaaKibuh then to the Fai Kishiyi, before other places.'
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
    eyebrow: 'Location, Climate & Vegetation',
    title: 'Climate, Topography and Highland Vegetation',
    image: images.highlands,
    imageAlt: 'Rolling green highland hills and valleys of Nkar',
    paragraphs: [
      'The indigenous Kingdom/Fondom of Nkar is located in the Bamenda Grassfields of the present-day North-west Region of Cameroon, standing as one of the largest fondoms in Bui Division. The Nkar highlands lie between latitude 6.2617\u00b0N and longitude 10.686\u00b0E, at an altitude of 1,650 to 2,086 meters above sea level (IFORD 1987).',
      'Nkar shares its eastern boundary with the kingdom of Ndzen at Kfwenjang on River Bui; its southern frontier at Mekwatir in Wainamah bordering Babessi; its southeast with Bangolan at Lake Ber and the Bamun ethnic group in the Noun Valley; its western borders with Oku in the Kilum mountain forest area; and its north with the Nso ethnic group.',
      'Vegetation and hydrology\nThe advancing Sahara desert, deforestation, and slash-and-burn farming practices have produced a grass cover vegetation known as the tropical savannah, with patches of relic forests surviving at Vekovi (Ngongbaa), Kov Nkar, and Ndzerem, alongside many river valleys lined with groves of palms, ferns, moss, and creeping plants (Awoni, 2022). These grasslands form a continuous tropical savannah with kikuyu (Sporobolus) grass cover. Alternating dry and wet seasons cause soil wash, especially on steep mountainous slopes, affecting volumes of streams and intermittent springs flowing from hill watersheds that sometimes dry out completely in the heart of the dry season (Yufenyuy Muhamed, 2020).'
    ]
  },
  {
    id: 'economy',
    eyebrow: 'Economic Activities',
    title: 'Agriculture, Enterprise and Craftsmanship',
    image: images.nkarHillFarms,
    imageAlt: 'Terraced agricultural farms and iconic conical hill of Nkar',
    paragraphs: [
      'The population of the Nkar indigenous kingdom is involved in diverse activities including agriculture, hunting, trade, and small livestock rearing. Economic operators are active and community forestry is developing in certain areas (MINFOF 2011), supported by fertile land and rich crops such as maize, cassava, oranges, kola nuts, vegetables of all kinds, and raffia palms for wine.',
      'Craftsmanship and artistic heritage\nThe land of Nkar also supported blacksmithing and decorative arts such as crafting and weaving for which the Nkar people are known. Where migration history suggests broader links, these traditions may be traced to North or West African civilizations sharing similar artistic practices, alongside master raffia bamboo craftsmanship and architectural milestones such as Fon Tumi Ntani II roofing the palace with corrugated metal sheets in Bui Division.'
    ]
  },
  {
    id: 'christianity-education',
    eyebrow: 'Christianity & Early Education',
    title: 'Faith, Schools and Inculturation in Nkar',
    image: images.palaceGathering,
    imageAlt: 'Community gathering and heritage celebrations in Nkar',
    paragraphs: [
      'After Shisong, Nkar was the second locality in the area to establish a Catholic church, a primary school, and a Home Economics Centre (a girls\u2019 vocational training institution). The construction of the Nkar Catholic Church remains legendary across all Bui communities, inspiring local proverbs referencing tasks as deliberate and enduring \u201cas the building of the church of Nkar.\u201d',
      'Building lore and perseverance\nDuring construction, stones had to be transported from considerable distances. Local oral history recounts beliefs that stones carried to the site would mysteriously return to their quarry overnight or that newly laid walls would collapse before dawn, prompting HRH the Fon of Nkar to perform solemn traditional sacrifices to appease the custodians of the land. Because labor was strenuous and organized on a task basis, villagers famously joked that the Reverend Father would leave his eyeglasses perched on a tree so workers believed he was watching them even in his absence. After years of perseverance, the church was completed.',
      'Inculturation and clergy legacy\nThis church also houses a landmark piece of cultural-religious art: the statue of St. Charles Lwanga, whose arrival sparked immense celebration across Bui Division and continues to attract visitors from afar. Following Shisong, Nkar hosted the second priestly ordination in Bui Division, that of Rev. Fr. Bushu\u2014an unprecedented gathering for which the historic stadium grandstand was constructed. Inculturation took root through the integration of local musical instruments into Catholic liturgy, and Nkar boasts one of the highest numbers of men who harmonize traditional Nso duties with devout Christian faith, alongside a rich legacy of producing numerous Catholic clergy and religious sisters across Bui Division and Cameroon.'
    ]
  },
  {
    id: 'socio-cultural-heritage',
    eyebrow: 'Socio-Cultural Heritage',
    title: 'Community Infrastructure, Institutions and Rites',
    image: images.villagePath,
    imageAlt: 'Traditional pathways and community spaces of Nkar',
    paragraphs: [
      'Prior to the administrative creation of Jakiri Subdivision, Nkar served as the undisputed center of socio-cultural life in Dzekwa. Its expansive Catholic school playground hosted major national celebrations on February 11 (Youth Day) and May 20 (National Day). Pupils traveled from across Dzekwa\u2014including Sop, Messiah, Vekovi, Wainamah, Ngomrin, Kisedzam, Matum, Berr, Shiy, Nooyi, Visovmboo, Kiluun, Tan, and Jakiri\u2014to receive First Holy Communion and sit for their Common Entrance and First School Leaving Certificate examinations.',
      'Water, vocational training and sacred rites\nNkar secured its pipe-borne water supply through joint efforts between the Catholic Mission and community labor. Participation was mandatory: absentees were barred from njangi houses and heavily fined, while the Nwerong regulatory society enforced compliance by confiscating hoes from women who bypassed community labor for their farms. Today, the community continues extending the water catchment network so every quarter has clean water.',
      'Purification and ancestral memory\nSimilarly, the Nkar Girls\u2019 Vocational Training Centre trained generations of young women from across Dzekwa in home economics and domestic management. Culturally, Nkar is renowned across Bui fondoms for its princesses and for its distinguished Nwerong society, particularly during annual sacrifices at the top of the Holy Mountain (Kiruminin) when sacred music resonates across Nso and neighboring fondoms. Oral tradition also preserves the memory of a defensive trench around the fondom with hidden crossings known only to Nkar natives, as well as the periodic \u201cbreaking of the Kilun,\u201d a communal purification ritual in which sons and daughters of Nkar return home to shout in unison, break their kilun, and blow wood ash into the air to banish evil spirits and misfortune.'
    ]
  },
  {
    id: 'touristic-sites',
    eyebrow: 'Touristic Sites',
    title: 'Notable Landmarks and Heritage Sites in Nkar',
    image: images.nkarHillFarms,
    imageAlt: 'Scenic hills and landmarks of the Nkar Fondom',
    paragraphs: [
      '1. Nkongchoor\nA renowned local blacksmith specializing in traditional drum craftsmanship in Wainkar.',
      '2. Historic Old Nkar Market & Former Home Economics Centre\nThe historic old Nkar market in Wainkar located beside the Nursery School, alongside the historic former Home Economics Centre.',
      '3. Nkar Catholic Church, Primary School & Health Centre\nThe Nkar Catholic Church (featuring the landmark statue of St. Charles Lwanga), the Nkar Catholic Primary School with its historic playground, the adjacent Catholic Health Centre, and the new Nkar Community Hall.',
      '4. Ancient Baobab Trees, Palace & Sacred Sites\nThe iconic ancient Baobab trees scattered across the fondom, the Fon\u2019s Palace and its resident colony of bats, the Holy Mountain (Kiruminin), and the sacred royal shrine where past Fons are laid to rest.'
    ]
  },
  {
    id: 'sports-hospitality',
    eyebrow: 'Sports & Hospitality',
    title: 'Athletics, Hospitality and Local Livelihoods',
    image: images.palaceGathering,
    imageAlt: 'Community life and sporting heritage of Nkar and Dzekwa',
    paragraphs: [
      'Nkar has long been a premier sporting hub in Bui Division. Before the creation of Jakiri Subdivision, athletic gatherings drew crowds from all four corners of Dzekwa. In the early 1960s, visits by the celebrated traveling football club \u201cHoly Joe\u201d brought immense excitement, particularly their clash against Nkar\u2019s second-division side, BBC. Local football lore also recalls the rivalry match between BBC and SAC, marked by dramatic pitch-side commotion when a spectator attempted to place a charm behind BBC\u2019s goalpost.',
      'Football figures and local hospitality\nCelebrated football figures include Shufai Manfe (popularly known as \u201cNyam Boker\u201d in his playing days) and longtime goalkeeper Mr. Raphael (\u201cTaah Suum\u201d), while the visit of football legend His Excellency Roger Milla on Saturday, March 6, was anticipated as a catalyst to revitalize sporting and civic energy across Nkar and Dzekwa. Despite a lack of commercial hotels, Nkar people are renowned for warm hospitality and never leave a visitor stranded, while abundant raffia palm wine (\u201cmimboo\u201d) and sweet oranges support youth livelihoods across Dzekwa.'
    ]
  },
  {
    id: 'sacred-shrines-rituals',
    eyebrow: 'Sacred Shrines & Rituals',
    title: 'Traditional Deities and Consultation Sites',
    image: images.highlands,
    imageAlt: 'Sacred highland terrain and ritual sites of Nkar',
    paragraphs: [
      'Nyuy wo Nkwoenjang (Gwarkang)\nMale deity: before leaving for Nkwoenjang, the land lords worship the gods of Kirumen hill (male) and Woe at Minsai, and the Fon of Nkar worships Nkwoenjang together with the Fon of Ndzoeen.',
      'Nyuy wo Kibang\nWorshipped by the Fon of Nkar together with the Fon of Ngoran\u2014each standing on his own land while consulting. On the way to Kibang at Ber, the Fon of Nkar and his lords consult and worship Nyuy wo Njah (near Baptist Church Nkar), Nyuy wo Mbishah Nkar, Nyuy wo Ntsulong (near the Gendarmerie Brigade Jakiri), Nyuy wo Abakwa Jakiri, Nyuy wo Fafoem at Mantum, Nyuy wo Ngewir (male), Nyuy wo Kilankenyuy (at Ber), Nyuy wo Kimbvevrin (on the way to Kutupit), and then Nyuy wo Kibang ke Ber.',
      'Nyuy wo Kov Ngongbaa\nMale deity consulted by the Fon of Nkar with the Fon of Oku, each standing on his land while consulting. Before reaching Ngongbaa, the gods consulted along the way include Nyuy wo Vikuvtsen, Nyuy wo Taamboh (Kintsenjam), Nyuy wo Kah Vekovi, Nyuy wo Shulav Mfuh (Vekovi), Nyuy wo Tiy Nkui (Vekovi), and Nyuy wo Shuu Kov Ngonbaa.',
      'Nyuy wo Tonsai & Nyuy wo Kirumen\nBefore reaching Nyuy wo Tonsai Tan, way-station consultations include Nyuy wo Shuu Kishaar (Kifom), Nyuy wo Liv (near Tan), and Nyuy wo Yenih (on the way to Mbokam, near the residence of Ardo Karimo). For Nyuy wo Kirumen, the Fon first consults Nyuy wo Shah Kinying before reaching Kirumen.'
    ]
  },  {
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
    title: 'Drums & Rhythms',
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
    text: 'Fresh palm wine poured from sacred royal calabash, red oil, salt, a sacrificial lamb (sheep or goat). Serve as a universal sign of goodwill, peace, and mutual covenant.',
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
    text: 'Fon Gwarmbi establishes the sovereign Nkar Kingdom at Kov Nkar, protected by a mystical trench sehm (kai fon) for foundational era.'
  },
  {
    period: 'Metallurgical Era (c. 1300)',
    title: 'Introduction of Iron Smelting in Nkar',
    text: 'Nkar metallurgists establish the metallurgy tradition in Nkar, forging copper axes, knives, spears, and royal regalia renowned across the Grassfields.'
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
  "The Fon does not rule alone. He has got the Lords of the land (Ve Wonghi), the Notables, Nwerong and Ngiri. But the administrative acts of the Fondom are vectored by the Fon and Nwerong. Before Nwerong Nkar issues an act of governance, the Fon must have been aware of it, and when the Fon issues such, Nwerong Nkar must have been aware of it. Notables, Queen mothers, Atav Nwerong and the Atarntoh are those who assist the Fon in various spheres of administration. Each of these institutions knows its functions and limits. None of them interferes in the domain of the other. And not even the notables can know all about these spheres. It is only the Fon who can know what is happening in all of their circles. The Fon is therefore the overall commander or chief executive in Nkar Fondom. Once he analyses and judges issues, his verdict stands. The Fon therefore is the Spiritual, Administrative, Political and Religious Leader of the people."
];

export const leadershipRoles: LeadershipRole[] = [

  {
    title: 'The Fon',
    text: 'The Fon does not rule alone. He has got the Lords of the land (Ve Wonghi), the Notables, Nwerong and Ngiri. But the administrative acts of the Fondom are vectored by the Fon and Nwerong. Before Nwerong Nkar issues an act of governance, the Fon must have been aware of it, and when the Fon issues such, Nwerong Nkar must have been aware of it. Notables, Queen mothers, Atav Nwerong and the Atarntoh are those who assist the Fon in various spheres of administration. Each of these institutions knows its functions and limits. None of them interferes in the domain of the other. And not even the notables can know all about these spheres. It is only the Fon who can know what is happening in all of their circles. The Fon is therefore the overall commander or chief executive in Nkar Fondom. Once he analyses and judges issues, his verdict stands. The Fon therefore is the Spiritual, Administrative, Political and Religious Leader of the people.',
    icon: 'crown'
  },
  {
    title: 'The spirit of the fon',
    text: 'He pertains to the spirits. He is from the spirit world. Therefore, he is to and from God and his spirits. He adores Nyuy Nkar wo Shamwun. Some of these spirits include the ancestors, the dealing with sacred places (Like at Nkeonjang, Tonsai Tan, the Lake Ber, the institution of Mame Nkar, the cleansing of the land and people, the Mkwatir at Wainamah, the cave at Nfut, going to Ngongbah at Vekeriv, the Outlet of the cave at Ngomrin, the Ntamir wo wiy at Yer, the going to Kintinen, the going to Shu Kindzev and the consulting of the ancestors at the Foem, amongst others). He equally acts in relation to the intellectual and higher endowments of the land; he is ecclesiastical and supernatural. He cherishes the TRUTH, and stands for Justice.',
    icon: 'flame'
  },
  {
    title: 'Nwerong Nkar',
    text: 'Nwerong Nkar is the custodian of the customary and the traditional values of the Fondom. It ensures the implementation of acts of governance, and so has the power to discipline wrong doers. It is the regulatory institution that can step in any sphere so as to put order. It monitors the birth and life of princes and princesses, and mourns their deaths. It is the only institution that has the legitimate authority to enthrone or even dethrone a Fon. It protects the Fon and the land against any encroachment in any form. Nwerong mourns the \'disappearances\' of Fons of other Fondoms with whom Nkar has diplomatic links. It is in charge of the orientation and initiation into values, of the tribe, of newly enthroned Fons. It ensures the observance of days of atonement. In some tribes there might be one; Nkar has two days of atonement which are Ntseri and Wailun. It is the security agent of the Fondom.',
    icon: 'scroll'
  },
  {
    title: 'Lavwong',
    text: 'Lavwong is in charge of the spiritual and geographic management of the land. Each member of the house or each Wirwong has a given area of the land where he continually appeases the gods of the land, while extending the acts of governance of the Fon. For example, Fai wo Kuintoh Nkar (one of Wir Wong), takes care of Wainamah, Ntseimbang, Ndzerem Nyam and Gwartang. He performs sacrifices in his given area, in the name of the Fondom. There are many other such lords who cover the entire Fondom. Where they are not placed, the Fon and Shu Fai wo Shu Kindzey are the ones who do it. Another group of personalities who enter the Lavwong takes care of the Spiritual defense of the land by and with the use of Ntamir. Some of such lords and Ntamir people are Shufai Kibai, Shufai Shu Kindzev, Shufai Leboi, Shufai Roombi, Shufai Nsam, Shufai Minkun, Shufai Siy, Shufai Rookov Jakiri, Fai wo Ntum, Fai wo Kov, Fai wo Kuintoh, Fai wo Fonsum, Fai wo Nkartsen.',
    icon: 'home'
  },
  {
    title: 'The Ataa ntoh',
    text: 'The Atarntoh (Palace Knights) are carefully chosen persons either by Nwerong Nkar or the Fon, using some criteria, to take care of palace issues. They are however, placed in various categories. Palace issues may include the follow up of the paying of acts of fealty to the Fon by personalities, daily visits to the Fon, the acquiring of spouses of princes and princesses, official emissaries of the Fon, inner court issues of the Fondom, the cultivation of the Fon\'s farms, harvests and food preservations, settling of disputes and misunderstandings in the inner court, amongst others.',
    icon: 'shield'
  },
  {
    title: 'The Nchiylav Fai (Squire)',
    text: 'The Nchiylav Fai (Squire) is the personal attendant of the Fon who accompanies the Fon to many sacred and secret societies. He carries and places the throne where he is indicated. He gets immersed in palace issues for nine years and graduates as a full Nchiylav Fai. He runs intimate errands of the Fon like taking fowls to some notables and storekeeping, tethering of goats, inviting the Atav Nwerong to the inner courts, etc.',
    icon: 'award'
  },
  {
    title: 'Ngiri Nkar',
    text: 'Ngiri Nkar is the society of all male who are of royal descent. It mourns the death of their members and those who have been initiated into it but who are not of the royal descent. Ngiri boosts the image of the royal family in its juju displays. It transmits acts of governance to the whole royal family.',
    icon: 'users'
  },
  {
    title: 'Manjong Nkar',
    text: 'Manjong Nkar is the defense arm of the Fon and the land (Nsai Nkar). It initiates adolescents into adulthood. The physical defense of the Fon and Fondom, the construction of bridges and roads, the protection of the Fon are in the hands of Manjong. Where the Fon officially goes, he does so with Manjong.',
    icon: 'hammer'
  },
  {
    title: 'Queen Mothers – The Yaah Yefon',
    text: 'The yaahship emanates from the enthronement of a Fon. If at the time a Fon is enthroned, his queen mother is alive, she automatically becomes a Yaah. She will be administering all the other queen mothers in the palace. When she shall die (and interned like a Fon) she shall have her successor who shall be given all the due respect. She shall be addressed a Shungai. At her death, she shall receive all the honours of a Fon. Another category is the Yaah instituted at the internment of any Fon. As the new Fon comes up, one of his dynasty members is made a Yaah. Yaah Yefon is the leader of all the female royal family at a given time (that of her reigning Fon). She is a liaison between Tanfen, the female royal family and the Fon.',
    icon: 'heart'
  },
  {
    title: 'Tanfen Nkar',
    text: 'Tanfen Nkar takes care, mostly of the female descent of the royal family. It follows up where they are born, monitors their growth and mourns their deaths. It extends the acts of governance of the Fon to the whole female royal family. It initiates the young, and forms them into adult women. It accompanies princesses to their marital homes. It receives spouses of princes. It mourns the death of members of the royal family. It accompanies Nwerong Nkar to other Fondoms. It monitors the respect of norms and values of the land with regard to the female. It assists the Fon to realise palace projects.',
    icon: 'users-round'
  },
  {
    title: 'The Fon as a Religious Leader',
    text: 'By religion here, I mean belief in a spiritual or metaphysical reality. This may include a deity that is worshiped by a set of practices and rituals. You may call it theism, or faith or simply belief. Others include cosmology, epistemology, philosophy, ontology, Islam, African Religions, Judaism, Spiritualism … The Fon is the head of all religions, even if he is not actively in them. Let us just take the Kikeng and see what it stands for. It is a plant, a peace plant, a symbol of peace, a sanctifier, a land demarcation … Therefore are we believing in cosmology, ontology, African religion, Christianity … ? The Fon does not refuse any religion that the state acknowledges.',
    icon: 'sun'
  }
];

export const sacredSites: SacredSiteEntry[] = [
  {
    title: 'Nkwenjang & River Bui Frontier',
    text: 'The northeastern boundary sanctuary where the Fon of Nkar begins its ritual boundary purification along the River Bui frontier with the Fon of Ndzeen.',
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
    era: '1100 - 1236',
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
