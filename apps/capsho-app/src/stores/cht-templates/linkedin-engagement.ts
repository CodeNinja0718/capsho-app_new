import { EngagementCaption, Prompt } from 'stores/cht-templates/models'

export function getRandomLinkedinEngagementCaptionTemplate (context: EngagementCaption) {
  const {
    hook,
    audience,
    isGuest,
    guestName,
    findings,
    quoteB,
    topic1,
    result
  } = context
  const getHookOrQuote = (isGuest: boolean): string => {
    const templates: Prompt = {
      noGuest: [
        () => `One of the most common questions I get? How do other ${audience} get ${result}\n\nI want to hear from you. What is your path to ${result}`,
        () => `“${quoteB}”\n\nDoes this resonate with you like it did with me?`,
        () => `${hook}\n\nHere are my top takeaways when it comes to ${topic1}:\n\n${findings}\n\nWhich of these are your favorite? Or if you have a different insight to add, I’d love to learn from you`
      ],
      guest: [
        () => `${guestName} and I were talking about this common question we both get? How do other ${audience} get ${result}\n\nWe want to hear from you. What is your path to ${result}`,
        () => `“${quoteB}” - ${guestName}\n\nDoes this resonate with you like it did with me?`,
        () => `${hook}\n\n${guestName}'s top takeaways on ${topic1} are too good not to share:\n\n${findings}\n\nWhich of these are your favorite? Or if you have a different insight to add, I’d love to learn from you`
      ]
    }
    const hookOrQuoteTemplate = isGuest ? templates.guest : templates.noGuest
    const randomKeyIndex = Math.floor(Math.random() * hookOrQuoteTemplate.length)
    return hookOrQuoteTemplate[randomKeyIndex]()
  }
  const template = getHookOrQuote(isGuest === true)
  const cleanTemplate = template.replace(/\n/gm, '<br/>')
  return Object.freeze({
    template: cleanTemplate,
    key: 'quoteB',
    type: 'engagement',
    storyBasedTemplate: [],
    strategyBasedTemplateKeys: []
  })
}
