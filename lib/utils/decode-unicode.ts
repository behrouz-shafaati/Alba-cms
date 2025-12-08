// src/lib/utils/decode-unicode.ts

export function decodeUnicodeMessage(encoded: string): string {
  try {
    // اگر JSON است، parse کن
    const parsed = JSON.parse(encoded)
    return parsed.message || encoded
  } catch {
    // اگر JSON نیست، مستقیم decode کن
    return encoded.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
      return String.fromCharCode(parseInt(match.replace('\\u', ''), 16))
    })
  }
}
