import { format, isValid, parseISO } from 'date-fns';

const parse = (value) => {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? date : null;
};

const safe = (value, pattern, fallback = 'Date to be confirmed') => {
  const date = parse(value);
  return date ? format(date, pattern) : fallback;
};

export const formatDate = (value) => safe(value, 'd MMMM yyyy');
export const formatShortDate = (value) => safe(value, 'd MMM yyyy');
export const formatWeekday = (value) => safe(value, 'EEEE');
export const formatDay = (value) => safe(value, 'dd', '··');
export const formatMonth = (value) => safe(value, 'MMM', '··');

export const isUpcoming = (value) => {
  const date = parse(value);
  return date ? date >= new Date() : false;
};