import { useQuery } from '@tanstack/react-query';
import { news, eventsUpcoming, eventsPast } from '@/data/news';
import { projects } from '@/data/projects';
import { books } from '@/data/books';
import { galleryItems } from '@/data/gallery';
import {
  aboutSections,
  traditions,
  timeline,
  leadershipRoles,
  leadershipRecords,
  ceremonialYear
} from '@/data/culture';
import { site } from '@/data/site';

// Nkar Woo Land is a frontend-only experience: the content ships with the
// project and is delivered through TanStack Query, so every section has real
// loading states and the source can be swapped later without touching a page.
const load = (data) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(data), 240);
  });

export const useNews = () =>
  useQuery({ queryKey: ['nkar', 'news'], queryFn: () => load(news) });

export const useEvents = () =>
  useQuery({
    queryKey: ['nkar', 'events'],
    queryFn: () => load({ upcoming: eventsUpcoming, past: eventsPast })
  });

export const useProjects = () =>
  useQuery({ queryKey: ['nkar', 'projects'], queryFn: () => load(projects) });

export const useBooks = () =>
  useQuery({ queryKey: ['nkar', 'books'], queryFn: () => load(books) });

export const useGallery = () =>
  useQuery({ queryKey: ['nkar', 'gallery'], queryFn: () => load(galleryItems) });

export const useAboutContent = () =>
  useQuery({
    queryKey: ['nkar', 'about'],
    queryFn: () => load({ aboutSections, traditions, timeline })
  });

export const useLeadershipContent = () =>
  useQuery({
    queryKey: ['nkar', 'leadership'],
    queryFn: () =>
      load({ roles: leadershipRoles, records: leadershipRecords, ceremonialYear })
  });

export const searchTypes = [
  'All',
  'Page',
  'News',
  'Event',
  'Project',
  'Publication',
  'Gallery'
];

const pages = [
  {
    id: 'page-home',
    type: 'Page',
    title: 'Nkar Woo Land — Home',
    summary: site.promise,
    to: '/'
  },
  {
    id: 'page-about',
    type: 'Page',
    title: 'About Nkar',
    summary:
      'History, origins, the people, culture, traditions and village life of Nkar.',
    to: '/about'
  },
  {
    id: 'page-leadership',
    type: 'Page',
    title: 'Traditional Leadership',
    summary:
      'The Nkar fondom, the Fon, the traditional council, the ceremonial year and the register of reigns.',
    to: '/leadership'
  },
  {
    id: 'page-news',
    type: 'Page',
    title: 'News & Events',
    summary: 'Community announcements, meetings, cultural celebrations and gatherings.',
    to: '/news'
  },
  {
    id: 'page-gallery',
    type: 'Page',
    title: 'Gallery',
    summary: 'Photographs of Nkar, its people, its crafts and its cultural activities.',
    to: '/gallery'
  },
  {
    id: 'page-books',
    type: 'Page',
    title: 'Books & Publications',
    summary:
      'Books and historical resources written by Nkar sons and daughters.',
    to: '/books'
  },
  {
    id: 'page-projects',
    type: 'Page',
    title: 'Development Projects',
    summary: 'Ongoing, planned and completed community initiatives in Nkar.',
    to: '/projects'
  },
  {
    id: 'page-contact',
    type: 'Page',
    title: 'Contact',
    summary: 'Contact Nkar Woo Land about records, photographs, publications and projects.',
    to: '/contact'
  }
];

const buildIndex = () => [
  ...pages,
  ...news.map((item) => ({
    id: `news-${item.id}`,
    type: 'News',
    title: item.title,
    summary: item.excerpt,
    meta: item.category,
    to: '/news',
    tags: item.body.join(' ')
  })),
  ...[...eventsUpcoming, ...eventsPast].map((item) => ({
    id: `event-${item.id}`,
    type: 'Event',
    title: item.title,
    summary: item.description,
    meta: `${item.venue} · ${item.tags.join(', ')}`,
    to: '/news',
    tags: `${item.organiser} ${item.tags.join(' ')}`
  })),
  ...projects.map((item) => ({
    id: `project-${item.id}`,
    type: 'Project',
    title: item.title,
    summary: item.summary,
    meta: `${item.status} · ${item.location}`,
    to: '/projects',
    tags: item.impact.join(' ')
  })),
  ...books.map((item) => ({
    id: `book-${item.id}`,
    type: 'Publication',
    title: item.title,
    summary: item.summary,
    meta: item.language,
    to: '/books',
    tags: item.author
  })),
  ...galleryItems.map((item) => ({
    id: `photo-${item.id}`,
    type: 'Gallery',
    title: item.title,
    summary: item.caption,
    meta: item.category,
    to: '/gallery',
    tags: item.category
  }))
];

export const useSearchIndex = () =>
  useQuery({ queryKey: ['nkar', 'search'], queryFn: () => load(buildIndex()) });

/** Client-side filtering over the local content index (frontend only). */
export const searchContent = (index = [], query = '', type = 'All') => {
  const term = query.trim().toLowerCase();
  return index.filter((item) => {
    if (type && type !== 'All' && item.type !== type) return false;
    if (!term) return true;
    return [item.title, item.summary, item.meta, item.tags, item.type]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(term);
  });
};