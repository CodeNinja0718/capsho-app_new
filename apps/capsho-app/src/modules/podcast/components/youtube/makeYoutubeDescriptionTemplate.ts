import assertParam from 'src/helpers/assert-param'
import type {
  IFolderLinks,
  IYoutubeContext,
  IYoutubeNormalContext
} from 'src/modules/podcast/components/template-interfaces'

export default function makeYoutubeDescriptionTemplate(context: IYoutubeContext) {
  const validContext = validate(context)
  const normalContext = normalize(validContext)
  return buildTemplate(normalContext)

  function buildTemplate(context: IYoutubeNormalContext) {
    const {
      isGuest,
      value,
      logLine1,
      cta,
      folderLinks
    } = context
    if (isGuest) {
      return `${logLine1}<br>
        <br>
        <strong>In this video, you will learn:</strong>
        ${value}<br><br>
        <strong>Resources:</strong><br>
        ${cta}
        [Insert links to any other lead magnets or Calls to Action from Guest here]
        <br>
        <strong>Connect with me:</strong><br>
        ${folderLinks}`
    } else {
      return `${logLine1}<br>
        <br>
        <strong>In this video, you will learn:</strong>
        ${value}<br><br>
        <strong>Resources:</strong><br>
        ${cta}
        [Insert any other lead magnets or Calls to Action here]
        <br>
        <strong>Connect with me:</strong><br>
        ${folderLinks}`
    }
  }

  function validate(context: IYoutubeContext) {
    const logLine1 = assertParam(context, 'logLine1')
    const isGuest = assertParam(context, 'isGuest')
    const value = assertParam(context, 'value')
    const folderLinks = context.folderLinks ?? {} as IFolderLinks
    return Object.freeze({
      logLine1,
      value,
      isGuest,
      folderLinks
    })
  }

  function normalize(context: IYoutubeContext) {
    const {
      logLine1,
      value,
      isGuest,
      folderLinks
    } = context
    const logLine = typeof logLine1 === 'string' ? logLine1 : logLine1.value
    const normalLinks = normalizeLinks(folderLinks)
    const normalCTA = normalizeCTA(folderLinks)
    return Object.freeze({
      logLine1: logLine,
      isGuest,
      value,
      cta: normalCTA,
      folderLinks: normalLinks
    })
  }

  function normalizeCTA(folderLinks: IFolderLinks) {
    if (folderLinks.comments) {
      return folderLinks.comments + '<br>'
    } else {
      return ''
    }
  }

  function normalizeLinks(folderLinks: IFolderLinks) {
    if (Object.keys(folderLinks).length <= 0) {
      return ''
    }
    const {
      instagramLink,
      facebookLink,
      youtubeLink,
      twitterLink,
      linkedinLink,
      websiteLink,
      podcastLink
    } = folderLinks
    let links = ''
    if (instagramLink && instagramLink !== '') {
      links += `Instagram: ${instagramLink}<br>`
    }
    if (facebookLink && facebookLink !== '') {
      links += `Facebook: ${facebookLink}<br>`
    }
    if (youtubeLink && youtubeLink !== '') {
      links += `YouTube: ${youtubeLink}<br>`
    }
    if (twitterLink && twitterLink !== '') {
      links += `Twitter: ${twitterLink}<br>`
    }
    if (linkedinLink && linkedinLink !== '') {
      links += `LinkedIn: ${linkedinLink}<br>`
    }
    if (websiteLink && websiteLink !== '') {
      links += `Website: ${websiteLink}<br>`
    }
    if (podcastLink && podcastLink !== '') {
      links += `<br><br>Loved this episode?
        Leave us a review and rating here: ${podcastLink}`
    } else {
      links += '<br><br>Loved this episode?' +
        'Leave us a review and rating here: {LINK}'
    }
    return links
  }
}
