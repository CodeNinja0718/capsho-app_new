import type { IPotentQuotables } from 'src/models/episode'
import { getGuestEmailSource, normalizeDocxEmail, normalizePdfEmail } from './email'
import {
  getLinkedInArticleSource,
  normalizeDocxLinkedInArticle,
  normalizeLinkedInArticleBeforeDownload
} from './linkedinarticle'
import {
  getPotentQuotableSource,
  normalizeDocxPotentQuotables,
  normalizePotentQuotablesBeforeDownload
} from './potent-quotables'
import {
  getGuestFacebookCaptionsSource,
  normalizePdfFacebookCaptions
} from './captions-facebook'
import {
  getGuestLinkedInCaptionsSource,
  normalizePdfLinkedInCaptions
} from './captions-linkedin'
import {
  getGuestTikTokCaptionsSource,
  normalizePdfTikTokCaptions
} from './captions-tiktok'
import {
  getGuestTwitterCaptionsSource,
  normalizePdfTwitterCaptions
} from './captions-twitter'
import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import downloadDocx from 'src/helpers/downloader-docx'
import normalizeDocxCaptions from 'components/downloads/captions'
import { HeadingLevel, Paragraph } from 'docx'
import type { INormalCaption } from 'components/downloads/captions'

export interface IDownloadGuestAssets {
  facebookCaptions: INormalCaption;
  linkedinCaptions: INormalCaption;
  tiktokCaptions: INormalCaption;
  twitterCaptions: INormalCaption;
  emailSubject: string;
  engagementBody: string;
  promotionBody: string;
  linkedInArticle: string;
  potentQuotables: IPotentQuotables
}

export function downloadPDFAllAssets() {
  const data = getAllAssetsSource()
  const fileName = 'all-assets.pdf'
  const normalData = normalizePDF(data)
  convertHtmlToPdf(normalData, fileName, true)
}

export function downloadDocxAllAssets() {
  const data = getAllAssetsSource()
  const fileName = 'all-assets.docx'
  const normalData = normalizeDocx(data)
  downloadDocx({
    data: normalData,
    heading: String(data.podcastId),
    fileName,
    title: 'All Assets',
    isAllAssets: true
  })
}

function normalizeDocx(
  data: IDownloadGuestAssets
) {
  const guestData = data
  const normalEmail = normalizeDocxEmail(guestData.emailSubject, guestData.engagementBody, guestData.promotionBody)
  const normalFacebookCaptions = normalizeDocxCaptions(guestData.facebookCaptions, true)
  const normalLinkedInCaptions = normalizeDocxCaptions(guestData.linkedinCaptions, true)
  const normalTiktokCaptions = normalizeDocxCaptions(guestData.tiktokCaptions, true)
  const normalTwitterCaptions = normalizeDocxCaptions(guestData.twitterCaptions, true)
  const normalLinkedInArticle = normalizeDocxLinkedInArticle(guestData.linkedInArticle)
  const normalQuotables = normalizeDocxPotentQuotables(guestData.potentQuotables)
  const result = [
    new Paragraph({
      text: 'Email',
      heading: HeadingLevel.HEADING_2,
      thematicBreak: false,
      spacing: {
        before: 200,
        after: 100
      }
    }),
    ...normalEmail,
    new Paragraph({
      text: 'Facebook/Instagram Captions',
      heading: HeadingLevel.HEADING_2,
      pageBreakBefore: true,
      thematicBreak: false,
      spacing: {
        before: 200,
        after: 100
      }
    }),
    ...normalFacebookCaptions,
    new Paragraph({
      text: 'LinkedIn Captions',
      heading: HeadingLevel.HEADING_2,
      pageBreakBefore: true,
      thematicBreak: false,
      spacing: {
        before: 200,
        after: 100
      }
    }),
    ...normalLinkedInCaptions,
    new Paragraph({
      text: 'TikTok Captions',
      heading: HeadingLevel.HEADING_2,
      pageBreakBefore: true,
      thematicBreak: false,
      spacing: {
        before: 200,
        after: 100
      }
    }),
    ...normalTiktokCaptions,
    new Paragraph({
      text: 'Twitter Captions',
      heading: HeadingLevel.HEADING_2,
      pageBreakBefore: true,
      thematicBreak: false,
      spacing: {
        before: 200,
        after: 100
      }
    }),
    ...normalTwitterCaptions,
    new Paragraph({
      text: 'LinkedIn Article',
      heading: HeadingLevel.HEADING_2,
      pageBreakBefore: true,
      thematicBreak: false,
      spacing: {
        before: 200,
        after: 100
      }
    }),
    ...normalLinkedInArticle,
    new Paragraph({
      text: 'Potent Quotables',
      heading: HeadingLevel.HEADING_2,
      pageBreakBefore: true,
      thematicBreak: false,
      spacing: {
        before: 200,
        after: 100
      }
    }),
    ...normalQuotables
  ]
  return [
    ...result
  ]
}

function normalizePDF(
  data: IDownloadGuestAssets
) {
  let result = [
    '<main style="font-family: Helvetica, Arial, sans-serif">',
    '<h1 style="font-size: 44px;">All assets</h1>'
  ]
  const guestData = data
  const normalEmail = normalizePdfEmail(guestData.emailSubject, guestData.engagementBody, guestData.promotionBody)
  const normalFacebookCaptions = normalizePdfFacebookCaptions(guestData.facebookCaptions, true)
  const normalLinkedInCaptions = normalizePdfLinkedInCaptions(guestData.linkedinCaptions, true)
  const normalTiktokCaptions = normalizePdfTikTokCaptions(guestData.tiktokCaptions, true)
  const normalTwitterCaptions = normalizePdfTwitterCaptions(guestData.twitterCaptions, true)
  const normalLinkedInArticle = normalizeLinkedInArticleBeforeDownload(guestData.linkedInArticle)
  const normalQuotables = normalizePotentQuotablesBeforeDownload(guestData.potentQuotables)
  result = [
    ...result,
    normalFacebookCaptions,
    normalLinkedInCaptions,
    normalTiktokCaptions,
    normalTwitterCaptions,
    normalEmail,
    normalLinkedInArticle,
    normalQuotables
  ]
  return [
    ...result,
    '</main>'
  ].join('\n\n')
}

export function getAllAssetsSource() {
  const facebookCaptions = getGuestFacebookCaptionsSource()
  const linkedInCaptions = getGuestLinkedInCaptionsSource()
  const tiktokCaptions = getGuestTikTokCaptionsSource()
  const twitterCaptions = getGuestTwitterCaptionsSource()
  const email = getGuestEmailSource()
  const result = {
    emailSubject: email.source.value.subjectLine,
    engagementBody: email.source.value.engagementBody,
    promotionBody: email.source.value.promotionBody,
    linkedinCaptions: linkedInCaptions.source,
    facebookCaptions: facebookCaptions.source,
    tiktokCaptions: tiktokCaptions.source,
    twitterCaptions: twitterCaptions.source,
    linkedInArticle: '',
    podcastId: email.podcastId,
    potentQuotables: {} as IPotentQuotables
  }
  const linkedInArticle = getLinkedInArticleSource()
  result.linkedInArticle = linkedInArticle.source.value
  const quotables = getPotentQuotableSource()
  result.potentQuotables = quotables.source.value
  return Object.freeze({
    ...result
  })
}
