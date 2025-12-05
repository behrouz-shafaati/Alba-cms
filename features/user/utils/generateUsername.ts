/**
 * Generate a username string.
 *
 * The function tries to build a readable username from provided name parts
 * (firstName, lastName) and falls back to a random alphanumeric string.
 * It normalizes input (trim, lower-case, remove non-alphanumeric characters),
 * optionally appends a numeric suffix, and enforces a maximum length.
 *
 * @param {Object} [opts] - Options object.
 * @param {string} [opts.firstName] - User's first name (used when present).
 * @param {string} [opts.lastName] - User's last name (used when present).
 * @param {string} [opts.preferred] - Preferred base string (used first if provided).
 * @param {number} [opts.maxLength=20] - Maximum length of the username.
 * @param {string} [opts.separator='.'] - Separator between name parts.
 * @param {boolean} [opts.appendNumber=true] - Whether to append a random number suffix when needed.
 * @param {number} [opts.numberDigits=3] - Digits to use for appended number (if enabled).
 * @param {boolean} [opts.forceLowercase=true] - Lowercase the result (recommended).
 * @returns {string} Generated username.
 *
 * @example
 * generateHumanId({ firstName: 'Behrouz', lastName: 'Shafaati' })
 * // -> "behrouz.shafaati123"
 *
 * @example
 * generateHumanId({ preferred: 'Coder Pro', appendNumber: false, separator: '_' })
 * // -> "coder_pro"
 *
 * @example
 * generateHumanId({ }) // no inputs -> random 6-char base + suffix, e.g. "xk3a9b123"
 */
export default function generateHumanId(opts?: {
  text?: string
  preferred?: string
  maxLength?: number
  separator?: string
  appendNumber?: boolean
  numberDigits?: number
  forceLowercase?: boolean
}): string {
  const {
    text = '',
    preferred,
    maxLength = 20,
    separator = '.',
    appendNumber = true,
    numberDigits = 3,
    forceLowercase = true,
  } = opts || {}

  // Basic sanitizer: trim, replace whitespace with separator, remove non-alphanum (allow separator), collapse separators
  const sanitize = (s: string) =>
    s
      .trim()
      .replace(/\s+/g, separator)
      .normalize('NFKD') // try to decompose diacritics
      .replace(/[\u0300-\u036f]/g, '') // remove diacritic marks
      .replace(new RegExp(`[^A-Za-z0-9${escapeRegExp(separator)}]`, 'g'), '') // keep letters/numbers/separator
      .replace(new RegExp(`${escapeRegExp(separator)}{2,}`, 'g'), separator) // collapse multiple separators
      .replace(
        new RegExp(
          `^${escapeRegExp(separator)}|${escapeRegExp(separator)}$`,
          'g'
        ),
        ''
      ) // trim separators
  // helper to escape separator in regex
  function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // generate a cryptographically-strong random integer in [0, max)
  function randomInt(max: number) {
    // use crypto if available
    try {
      const cryptoObj =
        (globalThis as any).crypto || (globalThis as any).msCrypto
      if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
        const range = max
        // create a Uint32 and reduce
        const u = new Uint32Array(1)
        cryptoObj.getRandomValues(u)
        return u[0] % range
      }
    } catch {
      // fallback to Math.random
    }
    return Math.floor(Math.random() * max)
  }

  // random alphanumeric string generator
  function randomAlnum(length: number) {
    const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let out = ''
    for (let i = 0; i < length; i++) {
      out += ALPHABET[randomInt(ALPHABET.length)]
    }
    return out
  }

  // build base
  let base = ''
  if (preferred && preferred.trim().length > 0) {
    base = sanitize(preferred)
  } else if (text) {
    const a = sanitize(text)
    if (a) {
      base = `${a}${separator}`
    } else {
      base = a
    }
  }

  // fallback to random readable base if nothing provided
  if (!base) {
    // use a short readable pattern: name + numeric or alnum
    base = randomAlnum(6)
  }

  if (forceLowercase) base = base.toLowerCase()

  // enforce maxLength before adding number suffix
  if (base.length > maxLength) base = base.slice(0, maxLength)

  // add numeric suffix if requested and there's room or to reduce collision risk
  if (appendNumber) {
    const digits = Math.max(
      1,
      Math.min(6, Math.floor(Number(numberDigits) || 3))
    )
    const maxNum = Math.pow(10, digits)
    const suffix = String(randomInt(maxNum)).padStart(digits, '0')
    // if adding suffix exceeds maxLength, try to trim base
    const allowedBaseLen = Math.max(1, maxLength - digits)
    if (base.length > allowedBaseLen) base = base.slice(0, allowedBaseLen)
    base = `${base}${suffix}`
  }

  // final safeguard: trim again to maxLength
  if (base.length > maxLength) base = base.slice(0, maxLength)

  // remove leading/trailing separator if somehow present
  base = base.replace(
    new RegExp(`^${escapeRegExp(separator)}|${escapeRegExp(separator)}$`, 'g'),
    ''
  )

  return base
}
