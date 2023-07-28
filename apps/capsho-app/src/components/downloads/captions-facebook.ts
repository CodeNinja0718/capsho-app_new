import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import downloadDocx from '../../helpers/downloader-docx'
import normalizeDocxCaptions from 'components/downloads/captions'
import type { ICaptionData } from 'src/models/caption'
import type { INormalCaption } from 'components/downloads/captions'

export function downloadPDFFacebookCaptions(isPro: boolean) {
  const data = getFacebookCaptionsSource()
  const normalCaptions = normalizePdfFacebookCaptions(data.source, isPro)
  convertHtmlToPdf(normalCaptions, 'facebook-instagram-captions.pdf')
}

export function downloadDocxFacebookCaptions(isPro: boolean) {
  const data = getFacebookCaptionsSource()
  const normalCaptions = normalizeDocxCaptions(data.source, isPro)
  downloadDocx({
    data: normalCaptions,
    heading: 'Facebook/Instagram Captions',
    fileName: 'facebook-captions.docx',
    title: 'Facebook/Instagram Captions',
    mainTitleItalics: true
  })
}

export function normalizePdfFacebookCaptions(data: INormalCaption, isPro = false) {
  const heading = '<h4>Facebook Captions</h4>'
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

export function getFacebookCaptionsSource() {
  const store = useUploadPodcastStore()
  const facebook = computed(() => {
    if (store.selectedEpisode.allCaptions) {
      return store.selectedEpisode.allCaptions.facebook
    }
    return store.allCaptions.facebook
  })
  const normalData = normalizeCaptions(facebook.value)
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
