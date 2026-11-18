// src/lib/api/helpers.ts
//
// Centralized payload sanitizer and helpers for API requests.

const METADATA_FIELDS = new Set([
  'id',
  'created_at',
  'updated_at',
  'created_by_id',
  'author_id',
  'reviewer_id',
  'reviewed_by_id',
  'uploaded_by_id',
  'views',
  'download_count',
  'registered_count',
]);

/**
 * Strips read-only metadata and cleans up payload properties before submitting to API.
 */
export function sanitizePayload<T extends Record<string, any>>(data: T, allowedExtraFields: string[] = []): Partial<T> {
  const allowed = new Set(allowedExtraFields);
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (METADATA_FIELDS.has(key) && !allowed.has(key)) {
      continue;
    }
    // Clean string values
    if (typeof value === 'string') {
      result[key] = value.trim();
    } else {
      result[key] = value;
    }
  }

  return result as Partial<T>;
}
