/**
 * Builds a URL path segment from a filters object.
 *
 * Each key in the `filters` object is appended to the URL
 * followed by its values joined by commas.
 *
 * Example:
 * ```ts
 * buildUrlFromFilters({
 *   category: ['books', 'toys'],
 *   color: ['red', 'blue'],
 * })
 * // Returns: "category/books,toys/color/red,blue"
 * ```
 *
 * @param {Record<string, string[]>} filters - An object where each key represents
 * a filter name and its value is an array of selected options.
 *
 * @returns {string} A URL-friendly string combining all filters and their values.
 */
export function buildUrlFromFilters(filters: Record<string, string[]>): string {
  const parts: string[] = []

  for (const key in filters) {
    const value = filters[key]
    if (value?.length > 0) {
      parts.push(`${key}/${value?.join(',')}`)
    }
  }

  return `${parts.join('/')}`
}
