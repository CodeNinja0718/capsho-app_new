import { date } from 'quasar'

export const formattedDateString = (timeStamp) => {
  if (timeStamp.label) {
    return timeStamp.label
  } else if (timeStamp.seconds) {
    timeStamp = timeStamp.seconds ? timeStamp.seconds * 1000 : timeStamp
    return date.formatDate(timeStamp, 'HH:mm, MMMM DD, YYYY')
  } else if (isValidTimestamp(timeStamp)) {
    return date.formatDate(timeStamp, 'HH:mm, MMMM DD, YYYY')
  }
  return ''
}

function isValidTimestamp(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export const formatSubscriptionEndDate = (timestamp, withYear = false) => {
  return withYear ? date.formatDate(timestamp, 'DD MMM, YYYY') : date.formatDate(timestamp, 'DD MMM')
}

export const getDateDiff = (creationTime) => {
  const dateNow = new Date()
  const dateUserCreatedAt = new Date(creationTime)
  const unit = 'days'
  return date.getDateDiff(dateNow, dateUserCreatedAt, unit)
}

export const isLessThanSixWeeks = (creationTime) => {
  return getDateDiff(creationTime) <= 42
}

function padTo2Digits (num) {
  return num.toString().padStart(2, '0')
}
// ✅ Converts milliseconds to hours, minutes and seconds
// Example: 15305000 👉️ 04:15:05 (4 hours, 15 minutes, 5 seconds)
export function convertMsToTime (milliseconds) {
  let seconds = Math.floor(milliseconds / 1000)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)

  seconds = seconds % 60
  minutes = minutes % 60

  // 👇️ If you don't want to roll hours over, e.g. 24 to 00
  // 👇️ comment (or remove) the line below
  // commenting next line gets you `24:00:00` instead of `00:00:00`
  // or `36:15:31` instead of `12:15:31`, etc.
  hours = hours % 24

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds
  )}`
}
