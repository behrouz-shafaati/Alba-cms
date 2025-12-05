const getTranslation = ({
  translations,
  locale = 'fa',
}: {
  translations: any[]
  locale?: string
}) => {
  if (typeof translations === 'undefined' || translations == null) return {}
  const translation =
    translations?.find((t) => t.lang === locale) || translations[0] || {}
  return translation
}

export default getTranslation
