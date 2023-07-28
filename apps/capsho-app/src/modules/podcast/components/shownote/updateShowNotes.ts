export function updateShowNotes(
  {
    description,
    showNote
  }: {
    description: string;
    showNote: string;
  }
) {
  const descriptionPattern = /<span id=\\"description\\">.*?<\/span>|<span id="description">.*?<\/span>/
  const [beginning, closing] = showNote.split(descriptionPattern)
  const normalDescription = normalizeDescription(description)
  let result = ''
  if (beginning) {
    result += beginning
  }
  if (normalDescription) {
    result += ' ' + `<span id="description">${normalDescription}</span>`
  }
  if (closing) {
    result += ' ' + closing
  }
  return result.replace(/undefined/gm, '')

  function normalizeDescription(template: string) {
    if (!template) {
      return ''
    }
    const searchString = '<span class="desc-value">'
    const result = template.includes(searchString)
      ? template.slice(0, getEndIndex(template, searchString))
      : template

    return result
      .replace(/<br>/gm, ' ')
      .replace(/<br \/>/gm, ' ')

    function getEndIndex(template: string, searchString: string) {
      return template.indexOf(searchString)
    }
  }
}
