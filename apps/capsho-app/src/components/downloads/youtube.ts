import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { htmlSanitizer, removeAllHtml } from 'src/utils'
import { Paragraph, TextRun } from 'docx'
import downloadDocx from 'src/helpers/downloader-docx'

export function downloadPDFYoutubeTemplate() {
  const data = getYoutubeSource()
  const normalTemplate = normalizeYouTubeTemplateBeforeDownload(data.source.value)
  convertHtmlToPdf(normalTemplate, 'youtube-template.pdf')
}

export function downloadDocxYoutubeTemplate() {
  const data = getYoutubeSource()
  const normalData = normalizeDocxYoutube(data.source.value)
  downloadDocx({
    data: normalData,
    heading: 'YouTube Description',
    fileName: 'youtube-description.docx',
    title: 'YouTube Description',
    mainTitleItalics: true
  })
}

export function normalizeDocxYoutube(template: string) {
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
            bold: item.includes('<b>')
          })
        ]
      })
    })
}

export function getYoutubeSource() {
  const store = useUploadPodcastStore()
  const youtubeTemplate = computed(() => {
    if (store.selectedEpisode.youtubeTemplate) {
      return htmlSanitizer(store.selectedEpisode.youtubeTemplate)
    }
    return htmlSanitizer(store.youtubeTemplate)
  })
  return {
    source: youtubeTemplate
  }
}

export function normalizeYouTubeTemplateBeforeDownload(template: string) {
  const normalTemplate = template
    .replace(/<b>/gm, '<div><b>')
    .replace(/<\/b>/gm, '</b></div><br><br>')
  return `<h4>YouTube Description</h4>${normalTemplate}`
}
