import { images } from '@/data/images';

export interface ProjectUpdate {
  date: string;
  text: string;
}

export interface Project {
  id: string;
  title: string;
  status: string;
  progress: number;
  location: string;
  lead: string;
  image: string | null;
  imageAlt?: string;
  summary: string;
  impact: string[];
  updates: ProjectUpdate[];
  sample: boolean;
}

export const projectNote =
  'Sample entry — status, percentage and figures are illustrations, to be replaced with verified project reporting from the committee.';

export const projects: Project[] = [
  {
    id: 'water-supply',
    title: 'Nkar community water supply',
    status: 'Ongoing',
    progress: 62,
    location: 'Nkar Clan',
    lead: 'Nkar development committee',
    image: images.waterPoint,
    imageAlt: 'Illustrative image: a rural water point with a hand pump and containers',
    summary:
      'A reliable water supply for households, the market square and the upper quarter — standpipes, storage and drainage, built in phases.',
    impact: [
      'Clean water closer to families, less time carried by women and children',
      'Water for the market square and for communal buildings',
      'Fewer interruptions in the dry season'
    ],
    updates: [
      { date: '2026-09-20', text: 'Second phase trenching completed towards the upper quarter.' },
      { date: '2026-07-02', text: 'Storage tank installed and first standpipes tested with the community.' }
    ],
    sample: true
  },
  {
    id: 'palace-conservation',
    title: 'Palace heritage conservation',
    status: 'Ongoing',
    progress: 40,
    location: 'Nkar palace',
    lead: 'Palace and traditional council',
    image: images.palacePillars,
    imageAlt: 'Illustrative image: carved pillars and thatched eaves of a grassfields palace',
    summary:
      'Protecting the palace and its regalia: roofing and walls, the carved work, and proper storage and display of the objects held by the fondom.',
    impact: [
      'The palace kept sound for ceremonies and for the community',
      'Carved work, regalia and drums protected from decay',
      'A place where Nkar’s heritage can be seen with respect'
    ],
    updates: [
      { date: '2026-08-30', text: 'Inventory of regalia started with the palace keepers.' },
      { date: '2026-06-14', text: 'Survey of roofing and carved work completed with local craftsmen.' }
    ],
    sample: true
  },
  {
    id: 'education-fund',
    title: 'Nkar education and school support fund',
    status: 'Ongoing',
    progress: 55,
    location: 'Nkar and beyond',
    lead: 'Nkar education committee',
    image: null,
    summary:
      'Support for pupils and students from Nkar: books, uniforms, fees and encouragement for those who stay in school.',
    impact: [
      'Pupils kept in school through the school year',
      'Support for girls to continue into secondary school',
      'Help for students in higher education and training'
    ],
    updates: [
      { date: '2026-09-15', text: 'Applications opened for the coming school year.' },
      { date: '2026-04-18', text: 'Awards reported at the community meeting.' }
    ],
    sample: true
  },
  {
    id: 'village-roads',
    title: 'Village road rehabilitation',
    status: 'Planned',
    progress: 15,
    location: 'Nkar access roads',
    lead: 'Nkar development committee',
    image: null,
    summary:
      'Repairing the market road and the tracks between the quarters so that farms, the market and vehicles can reach the village through the rains.',
    impact: [
      'Farm produce reaching the market in better condition',
      'Vehicle access for health and school services',
      'Easier movement between the quarters'
    ],
    updates: [
      { date: '2026-08-01', text: 'Survey of the worst stretches and cost estimate prepared.' }
    ],
    sample: true
  },
  {
    id: 'heritage-centre',
    title: 'Nkar heritage and community centre',
    status: 'Planned',
    progress: 8,
    location: 'Nkar Clan',
    lead: 'NKAR WOO LAN custodians',
    image: images.communityHall,
    imageAlt: 'Illustrative image: a community hall under construction with timber trusses',
    summary:
      'A place for the archive, the crafts and the community: an exhibition and reading room, a hall for meetings and a workshop for carving, beading and raffia work.',
    impact: [
      'One home for the records, photographs and publications of Nkar',
      'A hall for assemblies, festivals and training',
      'Craft skills taught on site to the next generation'
    ],
    updates: [
      { date: '2026-07-20', text: 'Site and design options discussed at the community meeting.' }
    ],
    sample: true
  }
];