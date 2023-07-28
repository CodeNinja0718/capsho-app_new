import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import downloadDocx from 'src/helpers/downloader-docx'
import { ICaptionData } from 'src/models/caption'
import normalizeDocxCaptions, { INormalCaption } from 'components/downloads/captions'

export function downloadPDFTikTokCaptions(isPro: boolean) {
  const data = getTikTokCaptionsSource()
  const normalCaptions = normalizePdfTikTokCaptions(data.source, isPro)
  convertHtmlToPdf(normalCaptions, 'tiktok-captions.pdf')
}

export function downloadDocxTikTokCaptions(isPro: boolean) {
  const data = getTikTokCaptionsSource()
  const normalData = normalizeDocxCaptions(data.source, isPro)
  downloadDocx({
    data: normalData,
    heading: 'TikTok Captions',
    fileName: 'tiktok-captions.docx',
    title: 'TikTok Captions',
    mainTitleItalics: true
  })
}

export function normalizePdfTikTokCaptions(data: INormalCaption, isPro = false) {
  const heading = '<h4>TikTok Captions</h4>'
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

export function getTikTokCaptionsSource() {
  const store = useUploadPodcastStore()
  const tiktok = computed(() => {
    if (store.selectedEpisode.allCaptions) {
      if (store.selectedEpisode.allCaptions.tiktok) {
        return store.selectedEpisode.allCaptions.tiktok
      }
    }
    return store.allCaptions.tiktok
  })
  const normalData = normalizeCaptions(tiktok.value)
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
