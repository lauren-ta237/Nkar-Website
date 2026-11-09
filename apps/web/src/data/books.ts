export const booksIntro =
  'Nkar sons and daughters have written about their history, their language and their culture. This shelf gathers those works in one place, so that what has been written is not lost and can be found by the next generation.';

export const booksNote =
  'The titles, years, and descriptions below represent published and oral traditions from Nkar. Authors’ names and details are updated as writers and families confirm their records with the community archive.';

export interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  pages: string;
  language: string;
  format: string;
  accent: string;
  summary: string;
  sample: boolean;
}

export interface PublicationPolicy {
  title: string;
  text: string;
}

export const books: Book[] = [
  {
    id: 'oral-histories',
    title: 'Echoes of Nkar: An Oral History Collection',
    author: 'Author details pending confirmation',
    year: 'To be confirmed',
    pages: 'To be confirmed',
    language: 'English',
    format: 'Print',
    accent: 'forest',
    summary:
      'Interviews with elders of Nkar: the founding account, the quarters, the farms and the ceremonies, recorded in the words of those who lived them.',
    sample: true
  },
  {
    id: 'proverbs',
    title: 'Proverbs for the Young',
    author: 'Author details pending confirmation',
    year: 'To be confirmed',
    pages: 'To be confirmed',
    language: 'Local language and English',
    format: 'Print',
    accent: 'gold',
    summary:
      'Sayings and proverbs collected from Nkar families, with translations and notes on when each one is spoken.',
    sample: true
  },
  {
    id: 'customs',
    title: 'The Nkar Fondom: Customs and Ceremonies',
    author: 'Author details pending confirmation',
    year: 'To be confirmed',
    pages: 'To be confirmed',
    language: 'English',
    format: 'Print',
    accent: 'clay',
    summary:
      'An account of the customs of the fondom, the calendar of ceremonies, and the work of the palace and the traditional council.',
    sample: true
  },
  {
    id: 'farming',
    title: 'Farming the Grassfields: Notes from Nkar',
    author: 'Author details pending confirmation',
    year: 'To be confirmed',
    pages: 'To be confirmed',
    language: 'English',
    format: 'Print',
    accent: 'forest',
    summary:
      'Practical notes on the farming year in the highlands, including maize, beans, huckleberry, and raffia, reflecting the practices Nkar families have kept across generations.',
    sample: true
  },
  {
    id: 'diaspora',
    title: 'Nkar at Home and Abroad: A Diaspora Memoir',
    author: 'Author details pending confirmation',
    year: 'To be confirmed',
    pages: 'To be confirmed',
    language: 'English',
    format: 'Print',
    accent: 'gold',
    summary:
      'A memoir of growing up in Nkar and keeping the village alive from another country: associations, remittances, returns and belonging.',
    sample: true
  },
  {
    id: 'childhood',
    title: 'Growing Up in Nkar: A Childhood Remembered',
    author: 'Author details pending confirmation',
    year: 'To be confirmed',
    pages: 'To be confirmed',
    language: 'English',
    format: 'Print',
    accent: 'clay',
    summary:
      'A personal account of childhood in the village: family, school, farms, play and the ceremonies a child is brought up with.',
    sample: true
  }
];

export const publicationsPolicy = [
  {
    title: 'Submitted by the author',
    text: 'Books are listed here with the author’s own details and permission. Nothing is published on behalf of an author.'
  },
  {
    title: 'Checked, not edited',
    text: 'The custodians verify the title, author and year, but leave the author’s voice and account untouched.'
  },
  {
    title: 'Removed on request',
    text: 'Any entry is removed or corrected at the author’s or family’s request, without argument.'
  }
];