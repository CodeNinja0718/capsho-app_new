import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import downloadDocx from '../../helpers/downloader-docx'
import normalizeDocxCaptions from 'components/downloads/captions'
import type { ICaptionData } from 'src/models/caption'
import type { INormalCaption } from 'components/downloads/captions'

export function downloadPDFFacebookCaptions(isPro: boolean, isGuestDrafts = false) {
  const data = isGuestDrafts ? getGuestFacebookCaptionsSource() : getFacebookCaptionsSource()
  const normalCaptions = normalizePdfFacebookCaptions(data.source, isPro)
  convertHtmlToPdf(normalCaptions, 'facebook-instagram-captions.pdf')
}

export function getPDFFacebookCaptions(isPro: boolean, isGuestDrafts = false) {
  const data = isGuestDrafts ? getGuestFacebookCaptionsSource() : getFacebookCaptionsSource()
  const normalCaptions = normalizePdfFacebookCaptions(data.source, isPro)
  return normalCaptions
}

export function downloadDocxFacebookCaptions(isPro: boolean, isGuestDrafts = false) {
  const data = isGuestDrafts ? getGuestFacebookCaptionsSource() : getFacebookCaptionsSource()
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
  const heading = '<div id="captions"><h2 id="facebook_caption">Facebook Captions</h2></div>'
  let captionsBody = `
  <b style="font-size=16px; color: black;">Engagement</b><br><br>${data.engagementPdf}<br><br>
  <b style="font-size=16px; color: black;">Promotion</b><br><br>${data.promotionPdf}<br><br>`
  if (isPro) {
    captionsBody += `<div style="color: black;"
        <b style="font-size=16px; color: black;">Educational</b><br><br>${data.educationalPdf}<br><br>
      </div>
    `
  }
  return heading + '<br><br>' + captionsBody
}

export function getFacebookCaptionsSource() {
  const store = useUploadPodcastStore()
  const facebook = computed(() => {
    if (store.selectedEpisode.allCaptions) {
      if (store.selectedEpisode.allCaptions.facebook) {
        return store.selectedEpisode.allCaptions.facebook
      }
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

export function getGuestFacebookCaptionsSource() {
  const store = useUploadPodcastStore()
  const facebook = computed(() => {
    if (store.selectedEpisode.allCaptionsGuest) {
      return store.selectedEpisode.allCaptionsGuest.facebook
    }
    return store.allCaptionsGuest.facebook
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
