import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import { formatDate } from '@/common/constants/date'
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export const fTime = (time: unknown, format: keyof typeof formatDate) => {
  if (!time) return ''
  const parsedTime = typeof time === 'string' || typeof time === 'number' || time instanceof Date ? time : null
  return dayjs(parsedTime).format(formatDate[format])
}

export const fTimeStamp = (time: unknown, format: keyof typeof formatDate): string => {
  if (!time) return ''

  const isValidTime = typeof time === 'string' || typeof time === 'number' || time instanceof Date

  if (!isValidTime) return ''

  const parsed = dayjs(time)

  if (!parsed.isValid()) return ''

  return parsed.format(formatDate[format])
}

export const fCtime = (time: number) => {
  if (!time) {
    return { date: '--', time: '--' }
  }
  const date = dayjs.unix(time)

  return { date: date.format('DD MMM YYYY'), time: date.format('h:mm a') }
}
