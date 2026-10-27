// site.ts
//
// Site-level configuration: name, tagline, nav links, quick facts, pillars,
// contribution ways, and contact topics. All values are static and ship with
// the project. When a CMS or headless backend is added, this file becomes the
// schema and the exports remain the same.

export interface ContactInfo {
  email: string;
  emailNote: string;
  phone: string;
  phoneNote: string;
  address: string;
  addressNote: string;
  facebookUrl: string;
  facebookNote: string;
}

export interface NavLink {
  label: string;
  to: string;
}

export interface QuickFact {
  label: string;
  value: string;
  draft: boolean;
}

export interface Pillar {
  icon: string;
  title: string;
  text: string;
  to: string;
  cta: string;
}

export interface ContributeWay {
  title: string;
  text: string;
  cta: string;
  to: string;
}

export interface ContactTopic {
  title: string;
  text: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  promise: string;
  location: string;
  setting: string;
  contentPolicy: string;
  contact: ContactInfo;
  navLinks: NavLink[];
  quickFacts: QuickFact[];
  pillars: Pillar[];
  contributeWays: ContributeWay[];
  contactTopics: ContactTopic[];
}

export const site: SiteConfig = {
  name: "NKAR WOO LAN",
  tagline: "Our Heritage, Our Identity, Our Future.",
  promise:
    "A digital home for Nkar Clan — its history, its culture, its traditional leadership and its shared development — kept by Nkar sons and daughters at home and abroad.",
  location: "Nkar Clan, Northwest Region, Cameroon",
  setting: "Grassfields highlands, Cameroon",
  contentPolicy:
    "NKAR WOO LAN is the digital home for Nkar sons and daughters at home and across the diaspora. Dedicated to preserving our heritage, celebrating our culture, and supporting community development, this platform connects generations and keeps our traditions alive. Community contributions, family histories, and verified records are welcomed with respect.",
  contact: {
    email: "hello@nkarwooland.org",
    emailNote: "Placeholder address — replace with the official NKAR WOO LAN inbox.",
    phone: "+237 000 000 000",
    phoneNote: "Placeholder number — replace with the official contact line.",
    address: "Nkar Clan, Northwest Region, Cameroon",
    addressNote: "Detailed address (palace and market square) to be confirmed.",
    facebookUrl: "https://www.facebook.com/share/1EmYJ8CtVK/",
    facebookNote:
      "Official NKAR WOO LAN Facebook community page.",
  },
  navLinks: [
    { label: "Home", to: "/" },
    { label: "About Nkar", to: "/about" },
    { label: "Leadership", to: "/leadership" },
    { label: "Projects", to: "/projects" },
    { label: "News", to: "/news" },
    { label: "Publications", to: "/books" },
    { label: "Contact", to: "/contact" },
  ],
  quickFacts: [
    {
      label: "Where",
      value: "Nkar Clan, Northwest Region, Cameroon",
      draft: true,
    },
    { label: "Landscape", value: "Rolling highland hills, farms and raffia groves", draft: true },
    {
      label: "Community",
      value: "Nkar sons and daughters at home and abroad",
      draft: false,
    },
    {
      label: "This archive",
      value: "Heritage, culture, leadership and development",
      draft: false,
    },
  ],
  pillars: [
    {
      icon: "landmark",
      title: "History & origins",
      text: "The founding account, the quarters of the village, and the generations that shaped Nkar — recorded with the elders and the palace.",
      to: "/about",
      cta: "Read the history",
    },
    {
      icon: "drum",
      title: "Culture & traditions",
      text: "Cloth and ceremony, drums and dance, food and hospitality: the customs that mark a Nkar life from birth to title.",
      to: "/about#culture",
      cta: "Explore the culture",
    },
    {
      icon: "crown",
      title: "Traditional leadership",
      text: "The fondom, the Fon, the council of elders and the customs that hold the village together across the generations.",
      to: "/leadership",
      cta: "Visit the fondom",
    },
    {
      icon: "hammer",
      title: "Community development",
      text: "Water, roads, education and the palace: the projects Nkar is building together, at home and with the diaspora.",
      to: "/projects",
      cta: "See the projects",
    },
  ],
  contributeWays: [
    {
      title: "Tell the story",
      text: "Record an elder's account, a place name, a family history or a village event so it is not lost with the generation that holds it.",
      cta: "Share a story",
      to: "/contact",
    },
    {
      title: "Send photographs",
      text: "Old and new photographs of Nkar — the palace, the market, ceremonies, farms and family gatherings.",
      cta: "Send photographs",
      to: "/contact",
    },
    {
      title: "Publish your work",
      text: "Nkar sons and daughters who have written on history, language or culture can have their books listed in the archive.",
      cta: "Add a publication",
      to: "/books",
    },
    {
      title: "Support a project",
      text: "Stand with water, roads, palace conservation and education projects — at home or from abroad.",
      cta: "See the projects",
      to: "/projects",
    },
    {
      title: "Help verify records",
      text: "Check names, reign dates and events so the archive holds only what is accurate and dignified.",
      cta: "Contact the team",
      to: "/contact",
    },
    {
      title: "Gather your chapter",
      text: "Start or reconnect a Nkar association where you live, and join the community meetings.",
      cta: "Join the meetings",
      to: "/news",
    },
  ],
  contactTopics: [
    { title: "Heritage records", text: "Oral accounts, place names, family histories, palace records." },
    { title: "Photographs & film", text: "Images of Nkar past and present, with the date and people named where known." },
    { title: "Books & publications", text: "Works by Nkar sons and daughters for the publications archive." },
    { title: "Development projects", text: "Proposals, progress reports and contributions to village projects." },
    { title: "Diaspora associations", text: "Nkar groups abroad, meetings and community gatherings." },
    { title: "Corrections", text: "Anything published here that needs to be corrected or removed." },
  ],
};

export const navLinks = site.navLinks;
export const quickFacts = site.quickFacts;
export const pillars = site.pillars;
export const contributeWays = site.contributeWays;
export const contactTopics = site.contactTopics;