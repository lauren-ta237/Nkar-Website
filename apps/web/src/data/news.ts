export interface NewsItem {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
  sample: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  organiser: string;
  description: string;
  tags: string[];
  sample: boolean;
}

export const news: NewsItem[] = [
  {
    id: 'heritage-archive-opens',
    category: 'Announcement',
    date: '2026-10-14',
    title: 'Nkar Woo Land opens its digital heritage archive',
    excerpt:
      'The first collections — photographs, oral accounts and village records — are being gathered into one place for Nkar sons and daughters wherever they live.',
    body: [
      'This website is the beginning of a long piece of work: bringing Nkar’s history, culture, traditional leadership and development into one record that anyone from the village can read, and that the next generation will still have.',
      'The first phase collects what already exists — family photographs, palace records, accounts told by elders, and the reports of community meetings and projects. Every entry is reviewed with the palace and the traditional council before it is published.',
      'Nkar sons and daughters at home and abroad are invited to send what they hold: a photograph, a name, a date, a story in their own words.'
    ],
    sample: true
  },
  {
    id: 'general-assembly-date',
    category: 'Meeting',
    date: '2026-10-06',
    title: 'Annual community assembly: date and agenda to be confirmed',
    excerpt:
      'The yearly gathering of Nkar families, village institutions and the diaspora is being planned. The confirmed date will be published on this page.',
    body: [
      'The annual general assembly brings every part of Nkar together: the quarters and families in the village, the traditional council, the development committee and the associations abroad.',
      'The draft agenda covers the progress of the water and road projects, the school support fund, the heritage archive, and the accounts of the past year.',
      'The date, venue and full agenda will be posted here as soon as the palace and the committee confirm them. The date shown on this notice is a sample.'
    ],
    sample: true
  },
  {
    id: 'cultural-festival-preparations',
    category: 'Culture',
    date: '2026-09-28',
    title: 'Preparations begin for the Nkar cultural festival',
    excerpt:
      'Dance groups, craft holders and families are preparing for a celebration of Nkar culture — cloth, drums, food and the crafts of the highlands.',
    body: [
      'The cultural festival is intended as a day when Nkar shows itself: dance and drumming, ceremonial cloth, food from the highlands, carving, beadwork and raffia craft.',
      'Groups wishing to take part are asked to register with the organising committee so that the programme, the space and the sound can be arranged properly.',
      'Entries and programme details published here are samples until the committee confirms them.'
    ],
    sample: true
  },
  {
    id: 'school-support',
    category: 'Education',
    date: '2026-09-15',
    title: 'Back-to-school support for Nkar pupils',
    excerpt:
      'The education fund is preparing exercise books, uniforms and fees support for pupils and students from Nkar for the coming school year.',
    body: [
      'The Nkar education fund supports families who need help with the costs of schooling — books, uniforms, and fees for pupils and students at secondary and tertiary level.',
      'Applications are reviewed by the committee together with the quarter heads, so that support reaches the households that need it most.',
      'Amounts, deadlines and award numbers shown anywhere on this site are samples pending confirmation by the committee.'
    ],
    sample: true
  },
  {
    id: 'health-outreach',
    category: 'Health',
    date: '2026-08-30',
    title: 'Health outreach planned for the village',
    excerpt:
      'A screening and awareness day is being organised with health workers for families in Nkar and the surrounding settlements.',
    body: [
      'The outreach is planned as a day of screening, advice and referral — with attention to mothers and young children, and to conditions that are easier to treat when they are found early.',
      'Health workers from the area and volunteers from the diaspora are being invited to take part.',
      'The programme, the venue and the date published here are samples until they are confirmed.'
    ],
    sample: true
  },
  {
    id: 'water-project-phase-two',
    category: 'Development',
    date: '2026-08-12',
    title: 'Water project moves into its second phase',
    excerpt:
      'The next stretch of the community water supply is under way, extending standpipes closer to the market square and the upper quarter.',
    body: [
      'The first phase of the water supply brought a reliable source closer to several households. The second phase extends the line, adds standpipes and improves the drainage around the water point.',
      'The committee reports progress at every community meeting and keeps the accounts open to inspection by the village.',
      'Progress figures used on this site are illustrations until they are replaced with the committee’s verified reporting.'
    ],
    sample: true
  }
];

export const eventsUpcoming: EventItem[] = [
  {
    id: 'town-hall-water-roads',
    title: 'Development town hall: water and village roads',
    date: '2026-11-14',
    time: '10:00',
    venue: 'Nkar palace square',
    organiser: 'Nkar development committee',
    description:
      'An open meeting on the water supply and the village roads: progress, costs, next steps and how families and the diaspora can take part.',
    tags: ['Development', 'Meeting'],
    sample: true
  },
  {
    id: 'diaspora-dialogue',
    title: 'Nkar diaspora dialogue (online)',
    date: '2026-11-21',
    time: '18:00',
    venue: 'Online — link to be published here',
    organiser: 'Nkar associations abroad',
    description:
      'An online gathering for Nkar sons and daughters living outside the village: heritage archive progress, project reports and how each association can help.',
    tags: ['Diaspora', 'Online'],
    sample: true
  },
  {
    id: 'general-assembly',
    title: 'Nkar annual general assembly',
    date: '2026-12-05',
    time: '09:00',
    venue: 'Nkar palace square',
    organiser: 'Palace and traditional council',
    description:
      'The yearly assembly of the village: reports of the past year, the accounts, the projects ahead, and the decisions of the community.',
    tags: ['Assembly', 'Community'],
    sample: true
  },
  {
    id: 'cultural-festival',
    title: 'Nkar cultural festival',
    date: '2027-01-09',
    time: '11:00',
    venue: 'Nkar Clan',
    organiser: 'Cultural festival committee',
    description:
      'A day of dance and drumming, ceremonial cloth, highland food, carving, beadwork and raffia craft, held for Nkar and its guests.',
    tags: ['Culture', 'Festival'],
    sample: true
  }
];

export const eventsPast: EventItem[] = [
  {
    id: 'palace-thanksgiving',
    title: 'Palace thanksgiving',
    date: '2026-08-16',
    time: '10:00',
    venue: 'Nkar palace',
    organiser: 'Palace and traditional council',
    description:
      'A thanksgiving gathering at the palace with the Fon, the council, the quarters and visiting sons and daughters of Nkar.',
    tags: ['Ceremony'],
    sample: true
  },
  {
    id: 'youth-sports-day',
    title: 'Youth sports and cultural day',
    date: '2026-07-11',
    time: '08:00',
    venue: 'Nkar Clan field',
    organiser: 'Nkar youth association',
    description:
      'Athletics, football and cultural performances by the young people of Nkar and neighbouring villages.',
    tags: ['Youth', 'Culture'],
    sample: true
  },
  {
    id: 'harvest-thanksgiving',
    title: 'Harvest thanksgiving',
    date: '2026-05-10',
    time: '09:00',
    venue: 'Nkar Clan',
    organiser: 'Quarters and family heads',
    description:
      'The community brings the first fruits of the season, with drumming, dance and shared food across the quarters.',
    tags: ['Ceremony', 'Harvest'],
    sample: true
  }
];