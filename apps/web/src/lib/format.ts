// format.ts
//
// Date formatting helpers shared across the app. All functions are tolerant
// of bad input — they return a fallback string or `false` rather than
// throwing, so components can call them directly from data that may be null.

import { format, isValid, parseISO } from "date-fns";

const parse = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? date : null;
};

const safe = (
  value: string | null | undefined,
  pattern: string,
  fallback = "Date to be confirmed"
): string => {
  const date = parse(value);
  return date ? format(date, pattern) : fallback;
};

export const formatDate = (value: string | null | undefined): string =>
  safe(value, "d MMMM yyyy");
export const formatShortDate = (value: string | null | undefined): string =>
  safe(value, "d MMM yyyy");
export const formatWeekday = (value: string | null | undefined): string =>
  safe(value, "EEEE");
export const formatDay = (value: string | null | undefined): string =>
  safe(value, "dd", "··");
export const formatMonth = (value: string | null | undefined): string =>
  safe(value, "MMM", "··");

export const isUpcoming = (value: string | null | undefined): boolean => {
  const date = parse(value);
  return date ? date >= new Date() : false;
};