import assertParam from 'src/helpers/assert-param'

interface ISpellingNamesContext {
  isGuest: boolean;
  guestName: string;
  hostName?: string;
  businessName?: string;
  text: string;
}

export default function runNamesSpellChecker (context: ISpellingNamesContext) {
  // validate context
  const validIsGuest = validateIsGuest(context)
  const validGuestName = validateGuestName(context)
  const validHostName = validateHostName(context)
  const validBusinessName = validateBusinessName(context)
  const validText = validateText(context)

  return Object.freeze({
    isGuest: validIsGuest,
    guestName: validGuestName,
    hostName: validHostName,
    businessName: validBusinessName,
    text: validText
  })

  // title
  // description
  // showNotes
  // transcript
  // facebook caption
  // LinkedIn caption
  // TikTok caption
  // Twitter caption
  // blog post caption
  // LinkedIn article
  // YouTube

  function validateIsGuest(context: ISpellingNamesContext) {
    return assertParam(context, 'isGuest')
  }
  function validateGuestName(context: ISpellingNamesContext) {
    const isGuest = assertParam(context, 'isGuest')
    return isGuest ? context.guestName : ''
  }
  function validateHostName(context: ISpellingNamesContext) {
    return context.hostName ?? ''
  }
  function validateBusinessName(context: ISpellingNamesContext) {
    return context.businessName ?? ''
  }
  function validateText(context: ISpellingNamesContext) {
    return assertParam(context, 'text')
  }
}
