// useContent.ts
//
// Every content section of Nkar Woo Land is delivered through TanStack Query.
// The data ships with the project and is delivered with an artificial delay
// so every section has real loading states. When a backend is wired, only
// this file and the data imports need to change.

import { useQuery } from "@tanstack/react-query";
import {
  news,
  eventsUpcoming,
  eventsPast,
  type NewsItem,
  type EventItem,
} from "@/data/news";
import { projects, type Project } from "@/data/projects";
import { books, type Book } from "@/data/books";
import { galleryItems, type GalleryItem } from "@/data/gallery";
import {
  aboutSections,
  traditions,
  timeline,
  leadershipRoles,
  leadershipRecords,
  ceremonialYear,
  type AboutSection,
  type Tradition,
  type TimelineEntry,
  type LeadershipRole,
  type LeadershipRecord,
  type CeremonialYearEntry,
} from "@/data/culture";
import { site, type SiteConfig } from "@/data/site";

// Artificial 240 ms delay so every query has a visible loading state.
const load = <T>(data: T): Promise<T> =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(data), 240);
  });

// ---- News & Events ---------------------------------------------------------

export const useNews = () =>
  useQuery({
    queryKey: ["nkar", "news"],
    queryFn: () => load(news),
  });

export const useEvents = () =>
  useQuery({
    queryKey: ["nkar", "events"],
    queryFn: () =>
      load({ upcoming: eventsUpcoming, past: eventsPast }),
  });

// ---- Projects --------------------------------------------------------------

export const useProjects = () =>
  useQuery({
    queryKey: ["nkar", "projects"],
    queryFn: () => load(projects),
  });

// ---- Books -----------------------------------------------------------------

export const useBooks = () =>
  useQuery({
    queryKey: ["nkar", "books"],
    queryFn: () => load(books),
  });

// ---- Gallery ---------------------------------------------------------------

export const useGallery = () =>
  useQuery({
    queryKey: ["nkar", "gallery"],
    queryFn: () => load(galleryItems),
  });

// ---- About -----------------------------------------------------------------

export const useAboutContent = () =>
  useQuery({
    queryKey: ["nkar", "about"],
    queryFn: () =>
      load({ aboutSections, traditions, timeline }),
  });

// ---- Leadership ------------------------------------------------------------

export const useLeadershipContent = () =>
  useQuery({
    queryKey: ["nkar", "leadership"],
    queryFn: () =>
      load({ roles: leadershipRoles, records: leadershipRecords, ceremonialYear }),
  });

// ---- Search ----------------------------------------------------------------

export const searchTypes = [
  "All",
  "Page",
  "News",
  "Event",
  "Project",
  "Publication",
  "Gallery",
] as const;

const pages = [
  {
    id: "page-home",
    type: "Page" as const,
    title: "Nkar Woo Land — Home",
    summary: site.promise,
    to: "/",
  },
  {
    id: "page-about",
    type: "Page" as const,
    title: "About Nkar",
    summary:
      "History, origins, the people, culture, traditions and village life of Nkar.",
    to: "/about",
  },
  {
    id: "page-leadership",
    type: "Page" as const,
    title: "Traditional Leadership",
    summary:
      "The Nkar fondom, the Fon, the traditional council, the ceremonial year and the register of reigns.",
    to: "/leadership",
  },
  {
    id: "page-news",
    type: "Page" as const,
    title: "News & Events",
    summary: "Community announcements, meetings, cultural celebrations and gatherings.",
    to: "/news",
  },
  {
    id: "page-gallery",
    type: "Page" as const,
    title: "Gallery",
    summary: "Photographs of Nkar, its people, its crafts and its cultural activities.",
    to: "/gallery",
  },
  {
    id: "page-books",
    type: "Page" as const,
    title: "Books & Publications",
    summary: "Books and historical resources written by Nkar sons and daughters.",
    to: "/books",
  },
  {
    id: "page-projects",
    type: "Page" as const,
    title: "Development Projects",
    summary: "Ongoing, planned and completed community initiatives in Nkar.",
    to: "/projects",
  },
  {
    id: "page-contact",
    type: "Page" as const,
    title: "Contact",
    summary: "Contact Nkar Woo Land about records, photographs, publications and projects.",
    to: "/contact",
  },
];

const buildIndex = () => [
  ...pages,
  ...news.map((item: NewsItem) => ({
    id: `news-${item.id}`,
    type: "News" as const,
    title: item.title,
    summary: item.excerpt,
    meta: item.category,
    to: "/news",
    tags: item.body.join(" "),
  })),
  [...eventsUpcoming, ...eventsPast].map((item: EventItem) => ({
    id: `event-${item.id}`,
    type: "Event" as const,
    title: item.title,
    summary: item.description,
    meta: `${item.venue} · ${item.tags.join(", ")}`,
    to: "/news",
    tags: `${item.organiser} ${item.tags.join(" ")}`,
  })),
  ...projects.map((item: Project) => ({
    id: `project-${item.id}`,
    type: "Project" as const,
    title: item.title,
    summary: item.summary,
    meta: `${item.status} · ${item.location}`,
    to: "/projects",
    tags: item.impact.join(" "),
  })),
  ...books.map((item: Book) => ({
    id: `book-${item.id}`,
    type: "Publication" as const,
    title: item.title,
    summary: item.summary,
    meta: item.language,
    to: "/books",
    tags: item.author,
  })),
  ...galleryItems.map((item: GalleryItem) => ({
    id: `photo-${item.id}`,
    type: "Gallery" as const,
    title: item.title,
    summary: item.caption,
    meta: item.category,
    to: "/gallery",
    tags: item.category,
  })),
];

export type SearchIndexItem =
  | (typeof pages)[number]
  | ReturnType<typeof buildIndex>[number];

export const useSearchIndex = () =>
  useQuery({
    queryKey: ["nkar", "search"],
    queryFn: () => load(buildIndex()),
  });

/** Client-side filtering over the local content index (frontend only). */
export const searchContent = (
  index: SearchIndexItem[] = [],
  query = "",
  type = "All"
): SearchIndexItem[] => {
  const term = query.trim().toLowerCase();
  return index.filter((item) => {
    if (type && type !== "All" && item.type !== type) return false;
    if (!term) return true;
    return [
      item.title,
      item.summary,
      item.meta,
      item.tags,
      item.type,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(term);
  });
};