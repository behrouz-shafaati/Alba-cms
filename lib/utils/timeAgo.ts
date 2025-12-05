export default function timeAgo(createdAt: string): string {
  const now = new Date()
  const past = new Date(createdAt)
  const diffMs = now.getTime() - past.getTime()

  if (diffMs < 0) return 'در آینده است!'

  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)
  const months = Math.floor(diffMs / (30 * 86400000))
  const years = Math.floor(diffMs / (365 * 86400000))
  if (minutes == 0) return 'همین الان'
  if (minutes < 60) {
    return `${minutes} دقیقه قبل`
  } else if (hours < 24) {
    return `${hours} ساعت قبل`
  } else if (days < 30) {
    return `${days} روز قبل`
  } else if (months < 12) {
    return `${months} ماه قبل`
  } else {
    // اگر چند سال و چند ماه گذشته باشد
    const remainingMonths = months % 12
    if (remainingMonths === 0) {
      return `${years} سال قبل`
    } else {
      return `${years} سال و ${remainingMonths} ماه قبل`
    }
  }
}
