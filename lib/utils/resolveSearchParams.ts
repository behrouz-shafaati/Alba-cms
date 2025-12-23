export default function resolveSearchParams(routeParam: string) {
  // اگر رشته با _sp_ شروع شده بود حذفش می‌کنیم
  if (routeParam.startsWith('_sp_')) {
    routeParam = routeParam.slice(4)
  }

  const obj: Record<string, string> = {}
  const pairs = routeParam.split('&')
  for (const pair of pairs) {
    const [key, value] = pair.split('=')
    if (key && value !== undefined) {
      obj[key] = value
    }
  }
  return obj
}
