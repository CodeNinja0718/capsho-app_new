import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import downloadDocx from 'src/helpers/downloader-docx'
import normalizeDocxCaptions, { INormalCaption } from 'components/downloads/captions'
import { ICaptionData } from 'src/models/caption'

export function downloadPDFTwitterCaptions(isPro: boolean, isGuestDrafts = false) {
  const data = isGuestDrafts ? getGuestTwitterCaptionsSource() : getTwitterCaptionsSource()
  const normalCaptions = normalizePdfTwitterCaptions(data.source, isPro)
  convertHtmlToPdf(normalCaptions, 'twitter-captions.pdf')
}

export function getPDFTwitterCaptions(isPro: boolean, isGuestDrafts = false) {
  const data = isGuestDrafts ? getGuestTwitterCaptionsSource() : getTwitterCaptionsSource()
  const normalCaptions = normalizePdfTwitterCaptions(data.source, isPro)
  return normalCaptions
}

export function downloadDocxTwitterCaptions(isPro: boolean, isGuestDrafts = false) {
  const data = isGuestDrafts ? getGuestTwitterCaptionsSource() : getTwitterCaptionsSource()
  const normalData = normalizeDocxCaptions(data.source, isPro)
  downloadDocx({
    data: normalData,
    heading: 'Twitter Captions',
    fileName: 'twitter-captions.docx',
    title: 'Twitter Captions',
    mainTitleItalics: true
  })
}

export function normalizePdfTwitterCaptions(data: INormalCaption, isPro = false) {
  const heading = '<h4 id="twitter_caption">Twitter Captions</h4>'
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

export function getTwitterCaptionsSource() {
  const store = useUploadPodcastStore()
  const twitter = computed(() => {
    if (store.selectedEpisode.allCaptions) {
      if (store.selectedEpisode.allCaptions.twitter) {
        return store.selectedEpisode.allCaptions.twitter
      }
    }
    return store.allCaptions.twitter
  })
  const normalData = normalizeCaptions(twitter.value)
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

export function getGuestTwitterCaptionsSource() {
  const store = useUploadPodcastStore()
  const twitter = computed(() => {
    if (store.selectedEpisode.allCaptionsGuest) {
      if (store.selectedEpisode.allCaptionsGuest.twitter) {
        return store.selectedEpisode.allCaptionsGuest.twitter
      }
    }
    return store.allCaptionsGuest.twitter
  })
  const normalData = normalizeCaptions(twitter.value)
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
