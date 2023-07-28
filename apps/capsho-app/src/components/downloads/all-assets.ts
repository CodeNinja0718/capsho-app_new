import type { IPotentQuotables } from 'src/models/episode'
import { getBlogPostSource, normalizeBlogPostBeforeDownload, normalizeDocxBlogPost } from './blog-post'
import { getEmailSource, normalizeDocxEmail, normalizePdfEmail } from './email'
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
import { getShowNotesSource, normalizeDocxShowNotes, normalizePdfShowNotes } from './show-notes'
import {
  getTitleAndDescriptionSource,
  normalizeDocxTitleAndDescription,
  normalizeTitleAndDescriptionBeforeDownload
} from './title-and-description'
import { getTranscriptSource, normalizeDocxTranscript, normalizeTranscriptBeforeDownload } from './transcript'
import { getYoutubeSource, normalizeDocxYoutube, normalizeYouTubeTemplateBeforeDownload } from './youtube'
import {
  getFacebookCaptionsSource,
  normalizePdfFacebookCaptions
} from './captions-facebook'
import {
  getLinkedInCaptionsSource,
  normalizePdfLinkedInCaptions
} from './captions-linkedin'
import {
  getTikTokCaptionsSource,
  normalizePdfTikTokCaptions
} from './captions-tiktok'
import {
  getTwitterCaptionsSource,
  normalizePdfTwitterCaptions
} from './captions-twitter'
import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import downloadDocx from 'src/helpers/downloader-docx'
import normalizeDocxCaptions from 'components/downloads/captions'
import { HeadingLevel, Paragraph } from 'docx'
import type { INormalCaption } from 'components/downloads/captions'

export interface IDownloadAllContext {
  title: string;
  description: string;
  showNotes: string;
  transcript: string;
}

export interface IDownloadGrowth extends IDownloadAllContext {
  facebookCaptions: INormalCaption;
  linkedinCaptions: INormalCaption;
  tiktokCaptions: INormalCaption;
  twitterCaptions: INormalCaption;
  emailSubject: string;
  engagementBody: string;
  promotionBody: string;
}

export interface IDownloadPro extends IDownloadGrowth {
  blogData: {
    title: string | null;
    blogBody: string;
  }
  linkedinArticle: string;
  youtube: string;
  potentQuotables: IPotentQuotables
}

export function downloadPDFAllAssets(
  allowPromotionalEmail: boolean,
  allowBlogPost: boolean
) {
  const data = getAllAssetsSource(allowPromotionalEmail, allowBlogPost)
  const fileName = String(data.podcastId) + '-all-assets.pdf'
  const normalData = normalizePDF(data, allowPromotionalEmail, allowBlogPost)
  convertHtmlToPdf(normalData, fileName, true)
}

export function downloadDocxAllAssets(
  allowPromotionalEmail: boolean,
  allowBlogPost: boolean
) {
  const data = getAllAssetsSource(allowPromotionalEmail, allowBlogPost)
  const fileName = String(data.podcastId) + '-all-assets.docx'
  const normalData = normalizeDocx(data, allowPromotionalEmail, allowBlogPost)
  downloadDocx({
    data: normalData,
    heading: String(data.podcastId),
    fileName,
    title: 'All Assets',
    isAllAssets: true
  })
}

function normalizeDocx(
  data: IDownloadAllContext,
  allowPromotionalEmail: boolean,
  allowBlogPost: boolean
) {
  // starter
  const normalTitleAndDescription = normalizeDocxTitleAndDescription(data.title, data.description)
  const normalShowNotes = normalizeDocxShowNotes(data.showNotes)
  const normalTranscript = normalizeDocxTranscript(data.transcript)
  let result = [
    new Paragraph({
      text: 'Title And Description',
      heading: HeadingLevel.HEADING_2,
      thematicBreak: false,
      spacing: {
        before: 300,
        after: 100
      }
    }),
    ...normalTitleAndDescription,
    new Paragraph({
      text: 'Show Notes',
      heading: HeadingLevel.HEADING_2,
      pageBreakBefore: true,
      thematicBreak: false,
      spacing: {
        before: 200,
        after: 100
      }
    }),
    ...normalShowNotes
  ]
  // growth
  if (allowPromotionalEmail) {
    const growthData = data as IDownloadGrowth
    const normalEmail = normalizeDocxEmail(growthData.emailSubject, growthData.engagementBody, growthData.promotionBody)
    const normalFacebookCaptions = normalizeDocxCaptions(growthData.facebookCaptions, allowBlogPost)
    const normalLinkedInCaptions = normalizeDocxCaptions(growthData.linkedinCaptions, allowBlogPost)
    const normalTiktokCaptions = normalizeDocxCaptions(growthData.tiktokCaptions, allowBlogPost)
    const normalTwitterCaptions = normalizeDocxCaptions(growthData.twitterCaptions, allowBlogPost)
    result = [
      ...result,
      new Paragraph({
        text: 'Email',
        heading: HeadingLevel.HEADING_2,
        pageBreakBefore: true,
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
      ...normalTwitterCaptions
    ]
  }
  // pro
  if (allowBlogPost) {
    const proData = data as IDownloadPro
    const normalBlogPost = normalizeDocxBlogPost(proData.blogData.title, proData.blogData.blogBody)
    const normalLinkedInArticle = normalizeDocxLinkedInArticle(proData.linkedinArticle)
    const normalQuotables = normalizeDocxPotentQuotables(proData.potentQuotables)
    const normalYouTube = normalizeDocxYoutube(proData.youtube)
    result = [
      ...result,
      new Paragraph({
        text: 'Blog Post',
        heading: HeadingLevel.HEADING_2,
        pageBreakBefore: true,
        thematicBreak: false,
        spacing: {
          before: 200,
          after: 100
        }
      }),
      ...normalBlogPost,
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
        text: 'YouTube Description',
        heading: HeadingLevel.HEADING_2,
        pageBreakBefore: true,
        thematicBreak: false,
        spacing: {
          before: 200,
          after: 100
        }
      }),
      ...normalYouTube,
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
  }
  return [
    ...result,
    new Paragraph({
      text: 'Transcription',
      heading: HeadingLevel.HEADING_2,
      pageBreakBefore: true,
      thematicBreak: false,
      spacing: {
        before: 200,
        after: 100
      }
    }),
    ...normalTranscript
  ]
}

function normalizePDF(
  data: IDownloadAllContext,
  allowPromotionalEmail: boolean,
  allowBlogPost: boolean
) {
  // starter
  const normalTitleAndDescription = normalizeTitleAndDescriptionBeforeDownload(data.title, data.description)
  const normalShowNotes = normalizePdfShowNotes(data.showNotes)
  const normalTranscript = normalizeTranscriptBeforeDownload(data.transcript)
  let result = [
    '<main style="font-family: Helvetica, Arial, sans-serif">',
    '<h1 style="font-size: 44px;">All assets</h1>',
    normalTitleAndDescription,
    normalShowNotes
  ]
  // growth
  if (allowPromotionalEmail) {
    const growthData = data as IDownloadGrowth
    const normalEmail = normalizePdfEmail(growthData.emailSubject, growthData.engagementBody, growthData.promotionBody)
    const normalFacebookCaptions = normalizePdfFacebookCaptions(growthData.facebookCaptions, allowBlogPost)
    const normalLinkedInCaptions = normalizePdfLinkedInCaptions(growthData.linkedinCaptions, allowBlogPost)
    const normalTiktokCaptions = normalizePdfTikTokCaptions(growthData.tiktokCaptions, allowBlogPost)
    const normalTwitterCaptions = normalizePdfTwitterCaptions(growthData.twitterCaptions, allowBlogPost)
    result = [
      ...result,
      normalFacebookCaptions,
      normalLinkedInCaptions,
      normalTiktokCaptions,
      normalTwitterCaptions,
      normalEmail
    ]
  }
  // pro
  if (allowBlogPost) {
    const proData = data as IDownloadPro
    const normalBlogPost = normalizeBlogPostBeforeDownload(proData.blogData.title, proData.blogData.blogBody)
    const normalLinkedInArticle = normalizeLinkedInArticleBeforeDownload(proData.linkedinArticle)
    const normalYouTube = normalizeYouTubeTemplateBeforeDownload(proData.youtube)
    const normalQuotables = normalizePotentQuotablesBeforeDownload(proData.potentQuotables)
    result = [
      ...result,
      normalBlogPost,
      normalLinkedInArticle,
      normalYouTube,
      normalQuotables
    ]
  }
  return [
    ...result,
    normalTranscript,
    '</main>'
  ].join('\n\n')
}

export function getAllAssetsSource(
  allowPromotionalEmail: boolean,
  allowBlogPost: boolean
) {
  // starter
  const titleAndDescription = getTitleAndDescriptionSource()
  const showNotes = getShowNotesSource()
  const transcript = getTranscriptSource()
  let result = {
    title: titleAndDescription.source.title.value,
    description: titleAndDescription.source.description.value,
    showNotes: showNotes.source.value,
    transcript: transcript.source.value,
    podcastId: titleAndDescription.source.podcastId.value,
    emailSubject: null,
    engagementBody: null,
    promotionBody: null,
    linkedinCaptions: {} as INormalCaption,
    facebookCaptions: {} as INormalCaption,
    tiktokCaptions: {} as INormalCaption,
    twitterCaptions: {} as INormalCaption,
    blogData: {},
    linkedinArticle: null,
    youtube: null,
    potentQuotables: {}
  }
  // growth
  let facebookCaptions,
    linkedInCaptions,
    tiktokCaptions,
    twitterCaptions,
    email
  if (allowPromotionalEmail) {
    facebookCaptions = getFacebookCaptionsSource()
    linkedInCaptions = getLinkedInCaptionsSource()
    tiktokCaptions = getTikTokCaptionsSource()
    twitterCaptions = getTwitterCaptionsSource()
    email = getEmailSource()
    result = {
      ...result,
      emailSubject: email.source.value.subjectLine,
      engagementBody: email.source.value.engagementBody,
      promotionBody: email.source.value.promotionBody,
      linkedinCaptions: linkedInCaptions.source,
      facebookCaptions: facebookCaptions.source,
      tiktokCaptions: tiktokCaptions.source,
      twitterCaptions: twitterCaptions.source
    }
  }
  // pro, collective, agency
  let blogPost,
    linkedInArticle,
    youtube,
    quotables
  if (allowBlogPost) {
    blogPost = getBlogPostSource()
    linkedInArticle = getLinkedInArticleSource()
    youtube = getYoutubeSource()
    quotables = getPotentQuotableSource()
    result = {
      ...result,
      blogData: {
        title: blogPost.source.blogTitle.value,
        blogBody: blogPost.source.blogPost.value
      },
      linkedinArticle: linkedInArticle.source.value,
      youtube: youtube.source.value,
      potentQuotables: quotables.source.value
    }
  }
  return Object.freeze({
    ...result
  })
}
