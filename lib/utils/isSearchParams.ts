export default function isSearchParams(routeParam: string) {
  if (!routeParam.startsWith('_sp_')) return false
  return true
}
