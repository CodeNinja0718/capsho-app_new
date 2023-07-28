type Word = string | undefined;
export default function upperFirst(word: Word) {
  word = String(word)
  if (typeof word === 'undefined') {
    return ''
  }
  if (word.length === 1) {
    return word.toUpperCase()
  }
  return word.charAt(0).toUpperCase() + word.substring(1)
}
