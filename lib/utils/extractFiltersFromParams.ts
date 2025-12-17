type Filters = Record<string, string[]>

/**
 * @param filtersArray از params.catchAll یا params.filters میاد
 * @returns فیلترها به صورت آبجکت
 */
export default function extractFiltersFromParams(
  filtersArray: string[] = []
): Filters {
  const filters: Filters = {}

  for (let i = 0; i < filtersArray.length; i += 2) {
    const key = filtersArray[i]
    const rawValue = filtersArray[i + 1]

    if (key && rawValue) {
      const decoded = decodeURIComponent(rawValue)
      filters[key] = decoded.split(',').filter(Boolean)
    }
  }

  return filters
}
