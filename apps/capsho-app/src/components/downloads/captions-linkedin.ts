import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import normalizeDocxCaptions from 'components/downloads/captions'
import downloadDocx from 'src/helpers/downloader-docx'
import type { ICaptionData } from 'src/models/caption'
import type { INormalCaption } from 'components/downloads/captions'

export function downloadPDFLinkedInCaptions(isPro: boolean) {
  const data = getLinkedInCaptionsSource()
  const normalCaptions = normalizePdfLinkedInCaptions(data.source, isPro)
  convertHtmlToPdf(normalCaptions, 'linkedin-captions.pdf')
}

export function downloadDocxLinkedInCaptions(isPro: boolean) {
  const data = getLinkedInCaptionsSource()
  const normalData = normalizeDocxCaptions(data.source, isPro)
  downloadDocx({
    data: normalData,
    heading: 'LinkedIn Captions',
    fileName: 'linkedin-captions.docx',
    title: 'LinkedIn Captions',
    mainTitleItalics: true
  })
}

export function normalizePdfLinkedInCaptions(data: INormalCaption, isPro = false) {
  const heading = '<h4>LinkedIn Captions</h4>'
  let captionsBody = `
  <b>Engagement</b><br><br>${data.engagementPdf}<br><br>
  <b>Promotion</b><br><br>${data.promotionPdf}<br><br>`
  if (isPro) {
    captionsBody += `
        <b>Educational</b><br><br>${data.educationalPdf}<br><br>
    `
  }
  return heading + '<br><br>' + captionsBody
}

export function getLinkedInCaptionsSource() {
  const store = useUploadPodcastStore()
  const linkedInCaption = computed(() => {
    if (store.selectedEpisode.allCaptions) {
      if (store.selectedEpisode.allCaptions.linkedin) {
        return store.selectedEpisode.allCaptions.linkedin
      }
    }
    return store.allCaptions.linkedin
  })
  const normalData = normalizeCaptions(linkedInCaption.value)
  return {
    source: normalData
  }

  function normalizeCaptions(data: ICaptionData) {
    const normalResult: INormalCaption = {
      educationalDocx: data.educational,
      educationalPdf: data.educational,
      engagementDocx: data.engagement,
      engagementPdf: data.engagement,
      promotionDocx: data.promotion,
      promotionPdf: data.promotion
    }
    return normalResult
  }
}
