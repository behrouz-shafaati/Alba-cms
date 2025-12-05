'use client'

import { usePathname, useSearchParams } from 'next/navigation'

/**
 * A hook for building updated URLs with custom query parameters.
 *
 * This hook uses Next.js `useSearchParams` and `usePathname` to access
 * the current URL state, and merges them with new parameters to generate
 * a complete URL string.
 *
 * @returns An object containing the `buildUrlWithParams` function.
 */
export function useUpdatedUrl() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  /**
   * Builds a new URL with the given parameters merged with
   * the current URL's query parameters.
   *
   * @param baseUrl - The base URL:
   *   - If `null`, it uses the current path (origin + pathname in the browser).
   *   - If a string, it will be used directly as the base URL.
   *
   * @param params - An object of key-value pairs to add or override in the query string.
   *   - key: string (the query parameter name)
   *   - value: `string | number | boolean` (will be stringified)
   *
   * @returns The complete URL string with the base and merged query string.
   *
   * @example
   * ```ts
   * const { buildUrlWithParams } = useUpdatedUrl()
   *
   * // When baseUrl = null
   * const url1 = buildUrlWithParams(null, { page: 2, search: "test" })
   * // -> "https://example.com/products?page=2&search=test"
   *
   * // When baseUrl is provided
   * const url2 = buildUrlWithParams("/dashboard", { tab: "settings" })
   * // -> "/dashboard?tab=settings"
   * ```
   */
  function buildUrlWithParams(
    baseUrl: string | null,
    params: Record<string, string | number | boolean> = {}
  ): string {
    const currentUrlParams = new URLSearchParams(searchParams.toString())

    // Merge params
    Object.entries(params).forEach(([key, value]) => {
      currentUrlParams.set(key, String(value))
    })

    // Always use relative path (to prevent hydration mismatch)
    const finalBase = baseUrl ?? pathname

    const query = currentUrlParams.toString()
    return query ? `${finalBase}?${query}` : finalBase
  }

  return { buildUrlWithParams }
}
