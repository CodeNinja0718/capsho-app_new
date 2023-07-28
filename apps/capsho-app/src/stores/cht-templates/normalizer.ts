import upperFirst from 'src/helpers/upper-first-char'

export default function normalize(value: string) {
  return '<br>' + value
    .replace(/<br>/gm, '')
    .split(/\d./)
    .filter((item) => !['', '<br>', '<br><br>'].includes(item))
    .reduce((arr, item, idx) => {
      const num = idx + 1
      const val = upperFirst(item)
      arr.push(`${num}. ${val.trim()}`)
      return arr
    }, [] as string[])
    .join('<br>')
}

export function normalizeResult(result: string) {
  return result
    .replace(/<br>/gm, '')
    .split(/\d./)
    .filter((item) => !['', '<br>', '<br><br>'].includes(item))
    .map((item) => {
      const val = item.toLowerCase()
      return val.trim()
    })
    .join(', ')
}
