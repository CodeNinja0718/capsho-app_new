import { EngagementCaption, Prompt } from 'stores/cht-templates/models'

export function getRandomTiktokEngagementCaptionTemplate (context: EngagementCaption) {
  const {
    hook,
    isGuest,
    quoteB
  } = context
  const getHookOrQuote = (isGuest: boolean): string => {
    const templates: Prompt = {
      noGuest: [
        () => `${hook}`,
        () => `${quoteB}`
      ],
      guest: [
        () => `${hook}`,
        () => `${quoteB}`
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
