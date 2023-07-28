import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { htmlSanitizer, removeAllHtml } from 'src/utils'
import { Paragraph, TextRun } from 'docx'
import downloadDocx from 'src/helpers/downloader-docx'

export function downloadPDFShowNotes() {
  const data = getShowNotesSource()
  const normalTemplate = normalizePdfShowNotes(data.source.value)
  convertHtmlToPdf(normalTemplate, 'show-notes.pdf')
}

export function downloadDocxShowNotes() {
  const data = getShowNotesSource()
  const normalData = normalizeDocxShowNotes(data.source.value)
  downloadDocx({
    data: normalData,
    heading: 'Show Notes',
    fileName: 'show-notes.docx',
    title: 'Show Notes',
    mainTitleItalics: true
  })
}

export function normalizeDocxShowNotes(template: string) {
  return template
    .replace(/<br>/gm, '\n')
    .replace(/<br \/>/gm, '\n')
    .split(/\n/)
    .filter((val: string) => ![''].includes(val))
    .map((item: string) => {
      return new Paragraph({
        style: 'basic',
        children: [
          new TextRun({
            text: removeAllHtml(item.trim()),
            bold: item.includes('<strong>')
          })
        ]
      })
    })
}

export function normalizePdfShowNotes(template: string) {
  const normalTemplate = template
    .replace(/<b>/gm, '<div><b>')
    .replace(/<\/b>/gm, '</b></div>')
  return `<h4>Show Notes</h4>${normalTemplate}`
}

export function getShowNotesSource() {
  const store = useUploadPodcastStore()
  const showNote = computed(() => {
    if (store.selectedEpisode.showNote) {
      return htmlSanitizer(store.selectedEpisode.showNote)
    }
    return htmlSanitizer(store.showNote)
  })
  return {
    source: showNote
  }
}
