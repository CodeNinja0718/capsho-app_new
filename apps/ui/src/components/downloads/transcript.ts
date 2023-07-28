import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { htmlSanitizer, removeAllHtml } from 'src/utils'
import { Paragraph, TextRun } from 'docx'
import downloadDocx from 'src/helpers/downloader-docx'

export function downloadPDFTranscript() {
  const data = getTranscriptSource()
  const normalTemplate = normalizeTranscriptBeforeDownload(data.source.value)
  convertHtmlToPdf(normalTemplate, 'transcript.pdf')
}

export function getPDFTranscript() {
  const data = getTranscriptSource()
  const normalTemplate = normalizeTranscriptBeforeDownload(data.source.value)
  return normalTemplate
}

export function downloadDocxTranscript() {
  const data = getTranscriptSource()
  const normalData = normalizeDocxTranscript(data.source.value)
  downloadDocx({
    data: normalData,
    heading: 'Transcription',
    fileName: 'transcription.docx',
    title: 'Transcription',
    mainTitleItalics: true
  })
}

export function normalizeDocxTranscript(transcript: string) {
  return transcript
    .replace(/<br>/gm, '\n')
    .replace(/<br \/>/gm, '\n')
    .replace(/<span hidden><\/span>/g, '\n')
    .split(/\n/)
    .filter((val: string) => ![''].includes(val))
    .map((item: string) => {
      return new Paragraph({
        style: 'basic',
        children: [
          new TextRun({
            text: removeAllHtml(item.trim()),
            break: 1
          })
        ]
      })
    })
}

export function getTranscriptSource() {
  const store = useUploadPodcastStore()
  const transcript = computed(() => {
    let text = ''
    if (Object.keys(store.transcript).length) {
      if (store.transcript.editedTranscript?.length) {
        text = store.transcript.editedTranscript
      } else if (store.transcript.labeledText?.length) {
        text = store.transcript.labeledText
      } else {
        text = store.transcript.text
      }
    }
    text = text.trim()
    return htmlSanitizer(text)
  })
  return {
    source: transcript
  }
}

export function normalizeTranscriptBeforeDownload(transcript: string) {
  const normalTranscript = transcript
    .replace(/<span class="labeled-text">/gm, '<span style="display: inline-block; padding-bottom: 13px;">')
    .replace(/<\/span>/gm, '</span>')
  return `<div id="transcript" style="color: black;"><h4>Transcription</h4>${normalTranscript}</div>`
}
