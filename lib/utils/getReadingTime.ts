import readingTime from 'reading-time'
import msToMinutes from './msToMinutes'

export default function getReadingTime(plainText: string) {
  const stats = readingTime(plainText)
  return msToMinutes(stats.time)
}
