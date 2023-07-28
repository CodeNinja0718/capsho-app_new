/**
 * @param hours
 * @param milliseconds
 * @param minutes
 * @param seconds
 * @return {number}
 */
export default function convertToMilliseconds(
  {
    hours = 0,
    milliseconds = 0,
    minutes,
    seconds
  }: {
    hours?: number;
    milliseconds?: number;
    minutes: number;
    seconds: number;
  }
) {
  let result = 0
  if (hours) {
    result += (Number(hours) * 60 * 60 * 1000)
  }
  if (minutes) {
    result += (Number(minutes) * 60 * 1000)
  }
  if (seconds) {
    result += (Number(seconds) * 1000)
  }
  if (milliseconds) {
    result += Number(milliseconds)
  }
  return result
}
