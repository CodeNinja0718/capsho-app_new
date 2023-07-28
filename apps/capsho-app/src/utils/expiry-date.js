export const expiryInOneMonth = () => {
  // Set expiry time to 1 month
  const now = new Date()
  const expiry = new Date(now.setMonth(now.getMonth() + 1)).toUTCString()
  return Date.parse(expiry)
}

export const expiryInFiveMinutes = () => {
  // Set expiry time to 5 minutes
  const now = new Date()
  const expiry = new Date(now.setTime(now.getTime() + (5 * 60 * 1000))).toUTCString()
  return Date.parse(expiry)
}

export const expiryInMinute = () => {
  // Set expiry time to 5 minutes
  const now = new Date()
  const expiry = new Date(now.setTime(now.getTime() + (60 * 1000))).toUTCString()
  return Date.parse(expiry)
}

export const expiryIn24Hours = () => {
  // Set expiry time to 24 h
  const now = new Date()
  const expiry = new Date(now.setTime(now.getTime() + (24 * 60 * 60 * 1000))).toUTCString()
  return Date.parse(expiry)
}
