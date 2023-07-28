import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { htmlSanitizer, removeAllHtml } from 'src/utils'
import { HeadingLevel, Paragraph, TextRun } from 'docx'
import downloadDocx from 'src/helpers/downloader-docx'

export function downloadPDFTitleAndDescription() {
  const { source } = getTitleAndDescriptionSource()
  const normalTemplate = normalizeTitleAndDescriptionBeforeDownload(source.title.value, source.description.value)
  convertHtmlToPdf(normalTemplate, 'title-and-description.pdf')
}

export function downloadDocxTitleAndDescription() {
  const { source } = getTitleAndDescriptionSource()
  const normalDescription = normalizeDocxTitleAndDescription(source.title.value, source.description.value)
  downloadDocx({
    data: normalDescription,
    heading: 'Title And Description',
    fileName: 'title-and-description.docx',
    title: 'Title And Description',
    mainTitleItalics: true
  })
}

export function normalizeDocxTitleAndDescription(title: string, description: string) {
  const normalData = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_5
    })
  ]
  description
    .replace(/<br>/gm, '\n')
    .replace(/<br \/>/gm, '\n')
    .split(/\n/)
    .forEach((item: string) => {
      normalData.push(
        new Paragraph({
          style: 'basic',
          children: [new TextRun(removeAllHtml(item.trim()))]
        })
      )
    })
  return normalData
}

export function getTitleAndDescriptionSource() {
  const store = useUploadPodcastStore()
  const title = computed(() => {
    if (store.selectedEpisode.title) {
      return String(store.selectedEpisode.title)
    }
    return String(store.title.value)
  })
  const description = computed(() => {
    if (store.selectedEpisode.description) {
      return htmlSanitizer(store.selectedEpisode.description)
    }
    return htmlSanitizer(store.description.value)
  })
  const podcastId = computed(() => {
    if (store.selectedEpisode.id) {
      return store.selectedEpisode.id
    }
    return store.podcastId
  })
  return {
    source: {
      title,
      description,
      podcastId
    }
  }
}

export function normalizeTitleAndDescriptionBeforeDownload(title: string, description: string) {
  const normalDescription = description
    .replace(/<b>/gm, '<div><b>')
    .replace(/<\/b>/gm, '</b></div>')
  return `<h4>Title & Description</h4><h5>${title}</h5>${normalDescription}`
}
