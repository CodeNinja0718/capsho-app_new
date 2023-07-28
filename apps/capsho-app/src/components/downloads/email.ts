import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { htmlSanitizer, removeAllHtml } from 'src/utils'
import downloadDocx from 'src/helpers/downloader-docx'
import { HeadingLevel, Paragraph, TextRun } from 'docx'

export function downloadPDFEmailTemplate() {
  const { source } = getEmailSource()
  const normalTemplate = normalizePdfEmail(source.value.subjectLine, source.value.engagementBody, source.value.promotionBody)
  convertHtmlToPdf(normalTemplate, 'email.pdf')
}

export function downloadDocxEmailTemplate() {
  const { source } = getEmailSource()
  const normalData = normalizeDocxEmail(source.value.subjectLine, source.value.engagementBody, source.value.promotionBody)
  downloadDocx({
    data: normalData,
    heading: 'Email Template',
    fileName: 'email.docx',
    title: 'Email Template',
    mainTitleItalics: true
  })
}

export function normalizeDocxEmail(subject: string, engagement: string, promotion: string) {
  const normalData = [
    new Paragraph({
      heading: HeadingLevel.HEADING_5,
      children: [
        new TextRun({
          text: subject
        })
      ]
    })
  ]
  normalize(promotion, 'Promotion')
  normalData.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_5,
      children: [
        new TextRun({
          text: subject
        })
      ],
      pageBreakBefore: true
    })
  )
  normalize(engagement, 'Engagement')
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
      .replace(/<br>/gm, '\n')
      .replace(/<br \/>/gm, '\n')
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

export function normalizePdfEmail(subject: string, engagement: string, promotion: string) {
  const normalEngagement = normalize(engagement)
  const normalPromotion = normalize(promotion)
  const normalBody = `
  <b>Engagement</b><br><br>${normalEngagement}<br><br>
  <b>Promotion</b><br><br>${normalPromotion}<br><br>`
  return `<h4>Email</h4><h5>${subject}</h5>${normalBody}`
  function normalize(body: string) {
    return body
      .replace(/<b>/gm, '<div><b>')
      .replace(/<\/b>/gm, '</b></div>')
  }
}

export function getEmailSource() {
  const store = useUploadPodcastStore()
  const email = computed(() => {
    return {
      subjectLine: htmlSanitizer(store.emailSubjectLine.value) || htmlSanitizer(store.selectedEpisode.email.subjectLine),
      engagementBody: htmlSanitizer(store.emailBodyEngagement) || htmlSanitizer(store.selectedEpisode.email.engagementBody),
      promotionBody: htmlSanitizer(store.emailBodyPromotion) || htmlSanitizer(store.selectedEpisode.email.promotionBody)
    }
  })
  return {
    source: email
  }
}
