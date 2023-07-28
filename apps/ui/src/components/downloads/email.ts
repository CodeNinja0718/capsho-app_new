import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { htmlSanitizer, removeAllHtml } from 'src/utils'
import downloadDocx from 'src/helpers/downloader-docx'
import { HeadingLevel, Paragraph, TextRun } from 'docx'

export function downloadPDFEmailTemplate(isGuestDrafts = false) {
  const { source } = isGuestDrafts ? getGuestEmailSource() : getEmailSource()
  const normalTemplate = normalizePdfEmail(source.value.subjectLine)
  convertHtmlToPdf(normalTemplate, 'email.pdf')
}

export function getPDFEmailTemplate(isGuestDrafts = false) {
  const { source } = isGuestDrafts ? getGuestEmailSource() : getEmailSource()
  const normalTemplate = normalizePdfEmail(source.value)
  return normalTemplate
}

export function downloadDocxEmailTemplate(isGuestDrafts = false) {
  const { source } = isGuestDrafts ? getGuestEmailSource() : getEmailSource()
  const normalData = normalizeDocxEmail(source.value)
  downloadDocx({
    data: normalData,
    heading: 'Email Template',
    fileName: 'email.docx',
    mainTitleItalics: true
  })
}

export function normalizeDocxEmail(subject: string) {
  const normalData = []
  normalize(subject, 'Content')
  // const normalData = [
  //   new Paragraph({
  //     heading: HeadingLevel.HEADING_5,
  //     children: [
  //       new TextRun({
  //         text: subject
  //       })
  //     ]
  //   })
  // ]
  function normalize(body: string, heading: string, pageBreakBefore = false) {
    normalData.push(
      new Paragraph({
        children: [
          new TextRun({
            text: heading,
            color: '808080'
          })
        ],
        pageBreakBefore,
        heading: HeadingLevel.HEADING_5
      })
    )
    body
      .replace(/<\/p>/gm, '</p>\n')
      .replace(/<\/div>/gm, '</div>\n')
      .split(/\n/)
      .forEach((item: string) => {
        const normalItem = item.trim()
        normalData.push(
          new Paragraph({
            style: 'basic',
            children: [
              new TextRun({
                text: removeAllHtml(normalItem),
                bold: item.includes('<b>')
              })
            ]
          })
        )
      })
  }
  return normalData
}

export function normalizePdfEmail(content: string) {
  const normalContent = normalize(content)
  const normalBody = `
  <div id="email" style="color: black">
  <h2>Email</h2>
  ${normalContent}</div>`
  return `${normalBody}`
  function normalize(body: string) {
    return body
      .replace(/<b>/gm, '<div><b>')
      .replace(/<\/b>/gm, '</b></div>')
  }
}

export function getEmailSource() {
  const store = useUploadPodcastStore()
  const email = computed(() => {
    return htmlSanitizer(store.selectedEpisode.email.content)
  })
  return {
    source: email
  }
}

export function getGuestEmailSource() {
  const store = useUploadPodcastStore()
  const email = computed(() => {
    return {
      subjectLine: htmlSanitizer(store.emailGuest.subjectLine) || '',
      engagementBody: htmlSanitizer(store.emailBodyEngagement) || htmlSanitizer(store.selectedEpisode.emailGuest.engagementBody),
      promotionBody: htmlSanitizer(store.emailBodyPromotion) || htmlSanitizer(store.selectedEpisode.emailGuest.promotionBody)
    }
  })
  return {
    source: email,
    podcastId: store.podcastId
  }
}
