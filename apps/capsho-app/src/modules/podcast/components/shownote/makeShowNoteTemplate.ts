import assertParam from 'src/helpers/assert-param'
import normalizeValue from 'src/stores/cht-templates/normalizer'

export type ShowNoteOption = 'summary' | 'story'

interface IFolderLinks {
  comments?: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  podcastLink?: string;
  twitterLink?: string;
  websiteLink?: string;
  youtubeLink?: string;
}

export interface IShowNotesContext {
  description: string;
  folderLinks: IFolderLinks;
  guestBio: string;
  guestName?: string;
  isGuest: boolean;
  quoteB: string;
  showNoteOption?: ShowNoteOption;
  story?: string;
  summary?: string;
  value: string;
}

export interface IShowNotesNormalContext {
  ctaLink: string;
  description: string;
  folderLinks: string;
  guestInfo: string;
  guestName?: string;
  isGuest: boolean;
  quoteB: string;
  story?: string;
  summary?: string;
  value: string;
}

export default function makeShowNotesTemplate(context: IShowNotesContext) {
  const getRandomShowNoteOption = () => {
    const options: ShowNoteOption[] = ['story', 'summary']
    const randomIndex = Math.floor(Math.random() * options.length | 0)
    return options[randomIndex]
  }
  const option = context.showNoteOption ?? getRandomShowNoteOption()
  const validContext = validate(context)
  const normalContext = normalize(validContext)
  return buildTemplate(normalContext)

  function buildTemplate(context: IShowNotesNormalContext) {
    const {
      isGuest,
      value,
      guestInfo,
      summary,
      story,
      description,
      quoteB,
      ctaLink,
      folderLinks
    } = context
    const getCtaAction = () => {
      if (!isGuest) {
        return '[Insert links other lead magnets or Calls to Action here]'
      } else {
        return '[Insert links to any other lead magnets or Calls to Action from Guest here]'
      }
    }
    const ctaAction = getCtaAction()
    if (option === 'summary') {
      return `${description}<br><br>
        ${guestInfo}
        ${summary}<br><br>
        <strong>${quoteB}</strong><br><br>
        In this episode, you will learn the following:
        ${value}<br>
        <b>Resources:</b><br>
        ${ctaLink}
        ${ctaAction}
        <br><br>
        <b>Other episodes you'll enjoy:</b><br>
        [Insert 3 past episodes with links]
        <br><br>
        <b>Connect with me:</b><br>
        ${folderLinks}`
    } else {
      return `${description}<br><br>
        <strong>${quoteB}</strong><br><br>
        ${guestInfo}
        ${story}<br><br>
        In this episode, you will learn the following:
        ${value}
        <br>
        <b>Resources:</b><br>
        ${ctaLink}
        ${ctaAction}
        <br><br>
        <b>Other episodes you'll enjoy:</b><br>
        [Insert 3 past episodes with links]
        <br><br>
        <b>Connect with me:</b><br>
        ${folderLinks}`
    }
  }

  function validate(context: IShowNotesContext) {
    const description = assertParam(context, 'description')
    const quoteB = assertParam(context, 'quoteB')
    const isGuest = assertParam(context, 'isGuest') === true
    const value = assertParam(context, 'value')
    const story = context.story ?? ''
    const summary = context.summary ?? ''
    const guestBio = context.guestBio ?? ''
    const folderLinks = context.folderLinks ?? {} as IFolderLinks
    const guestName = isGuest ? assertParam(context, 'guestName') : ''
    return Object.freeze({
      description,
      quoteB,
      story,
      summary,
      guestBio,
      guestName,
      value,
      isGuest,
      folderLinks
    })
  }

  function normalize(context: IShowNotesContext) {
    const {
      description,
      quoteB,
      summary,
      story,
      guestName,
      guestBio,
      value,
      isGuest,
      folderLinks
    } = context
    const normalGuestInfo = normalizeGuestInfo({
      isGuest,
      guestBio
    })
    const normalLinks = normalizeLinks(folderLinks)
    const normalCTA = normalizeCTA(folderLinks)
    const normalDescription = normalizeDescription(description)
    const normalValue = normalizeValue(value)
    return Object.freeze({
      description: normalDescription,
      guestInfo: normalGuestInfo,
      summary: summary ?? '',
      isGuest,
      quoteB,
      story,
      guestName: isGuest ? guestName : '',
      value: normalValue,
      ctaLink: normalCTA,
      folderLinks: normalLinks
    })
  }

  function normalizeDescription(template: string) {
    if (!template) {
      return ''
    }
    const searchString = '<span class="desc-value">'
    return template.includes(searchString)
      ? template.slice(0, getEndIndex(template, searchString))
      : template

    function getEndIndex(template: string, searchString: string) {
      return template.indexOf(searchString)
    }
  }

  function normalizeCTA(folderLinks: IFolderLinks) {
    if (folderLinks.comments) {
      return folderLinks.comments + '<br>'
    } else {
      return ''
    }
  }

  function normalizeGuestInfo(
    {
      isGuest,
      guestBio
    }:
    {
      isGuest: boolean,
      guestBio: string
    }
  ) {
    let guestInfo = ''
    if (isGuest) {
      guestInfo = `${guestBio}<br><br>`
    }
    return guestInfo
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
      links += `<br>Loved this episode? Leave us a review and rating here: ${podcastLink}`
    } else {
      links += '<br>Loved this episode?' +
        ' Leave us a review and rating here: {LINK}'
    }
    return links
  }
}
