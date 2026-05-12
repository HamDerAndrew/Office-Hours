/**
 * Build the URL slug for an office from its API `name`.
 *
 * Lowercased, with runs of whitespace collapsed to a single `-`. Matches the
 * contract documented for `/offices/<slug>` routes: e.g. "Copenhagen Office"
 * → "copenhagen-office". Kept intentionally literal so a slug is stable as
 * long as the office name is stable.
 */
export function officeSlug(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}
