import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { htmlSanitizer, removeAllHtml } from 'src/utils'
import { Paragraph, TextRun } from 'docx'
import downloadDocx from 'src/helpers/downloader-docx'

export function downloadPDFLinkedInArticleTemplate() {
  const data = getLinkedInArticleSource()
  const normalTemplate = normalizeLinkedInArticleBeforeDownload(data.source.value)
  convertHtmlToPdf(normalTemplate, 'linkedin-article.pdf')
}

export function getPDFLinkedInArticleTemplate() {
  const data = getLinkedInArticleSource()
  const normalTemplate = normalizeLinkedInArticleBeforeDownload(data.source.value)
  return normalTemplate
}

export function downloadDocxLinkedInArticleTemplate() {
  const data = getLinkedInArticleSource()
  const normalData = normalizeDocxLinkedInArticle(data.source.value)
  downloadDocx({
    data: normalData,
    heading: 'LinkedIn Article',
    fileName: 'linkedin-article.docx',
    title: 'LinkedIn Article',
    mainTitleItalics: true
  })
}

export function normalizeDocxLinkedInArticle(template: string) {
  return template
    .replace(/<\/div>/gm, '</div>\n')
    .replace(/<\/p>/gm, '</p>\n')
    .split(/\n/)
    .filter((val: string) => ![''].includes(val))
    .map((item: string) => {
      return new Paragraph({
        style: 'basic',
        children: [
          new TextRun(
            {
              text: removeAllHtml(item.trim()),
              bold: item.includes('<b>')
            }
          )
        ]
      })
    })
}

export function getLinkedInArticleSource() {
  const store = useUploadPodcastStore()
  const linkedInArticle = computed(() => {
    if (store.selectedEpisode.linkedinTemplate) {
      return htmlSanitizer(store.selectedEpisode.linkedinTemplate)
    }
    return htmlSanitizer(store.linkedinTemplate)
  })
  return {
    source: linkedInArticle
  }
}

export function normalizeLinkedInArticleBeforeDownload(template: string) {
  const normalTemplate = template
    .replace(/<b>/gm, '<div><b>')
    .replace(/<\/b>/gm, '</b></div><br><br>')
  return `<div id="linkedin" style="color: black;">${normalTemplate}</div>`
}
