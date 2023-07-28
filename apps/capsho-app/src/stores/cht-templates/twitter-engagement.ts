import { EngagementCaption, Prompt, Template } from 'stores/cht-templates/models'

export function getRandomEngagementTwitterCaptionTemplate (context: EngagementCaption) {
  const {
    hook,
    audience,
    isGuest,
    guestName,
    findings,
    quoteB,
    topic1,
    latestCht,
    intention,
    chtPrompts,
    result,
    getDefault
  } = context
  const cht = {
    ...latestCht
  }
  const chtArr = cht.value.replace(/<br>/gm, '')
    .split(/\d./)
    .filter((item) => !['', '<br>', '<br><br>'].includes(item)) ?? ['']
  const findingsArr = findings?.replace(/<br>/gm, '')
    .split(/\d./)
    .filter((item) => !['', '<br>', '<br><br>'].includes(item)) ?? ['']
  const getHookOrQuote = (isGuest: boolean): string => {
    const templates: Prompt = {
      noGuest: [
        () => `Main Tweet: ${hook}\n\nReply 1: I was thinking about ${topic1}. More specifically: ${findingsArr[0]}\n\nReply 2: What’s your biggest question when it comes to ${topic1}?`,
        () => `Main Tweet: ${hook}\n\nReply 1: I was thinking about ${topic1}. More specifically: ${findingsArr[1]}\n\nReply 2: What’s your biggest question when it comes to ${topic1}?`,
        () => `Main Tweet: ${hook}\n\nReply 1: I was thinking about ${topic1}. More specifically: ${findingsArr[2]}\n\nReply 2: What’s your biggest question when it comes to ${topic1}?`,
        () => `Main Tweet: ${hook}\n\nReply 1: ${findingsArr[0]}\n\nReply 2: ${findingsArr[1]}\n\nReply 3: ${findingsArr[2]}\n\nReply 4: Which of these resonate the most?`,
        () => `“${quoteB}”\n\nWhat do you think?`
      ],
      guest: [
        () => `Main Tweet: ${hook}\n\nReply 1: ${guestName} and I got talking about ${topic1} and we covered a lot...\n\nReply 2: For example: ${findingsArr[0]}\n\nReply 2: What’s your biggest question when it comes to ${topic1}?`,
        () => `Main Tweet: ${hook}\n\nReply 1: ${guestName} and I got talking about ${topic1} and we covered a lot...\n\nReply 2: For example: ${findingsArr[1]}\n\nReply 2: What’s your biggest question when it comes to ${topic1}?`,
        () => `Main Tweet: ${hook}\n\nReply 1: ${guestName} and I got talking about ${topic1} and we covered a lot...\n\nReply 2: For example: ${findingsArr[2]}\n\nReply 2: What’s your biggest question when it comes to ${topic1}?`,
        () => `Main Tweet: ${hook}\n\nReply 1: ${guestName} and I got talking about ${topic1} and here's what we covered\n\nReply 2: ${findingsArr[0]}\n\nReply 3: ${findingsArr[1]}\n\nReply 4: ${findingsArr[2]}\n\nReply 5: Which of these resonate the most?`,
        () => `“${quoteB} - ${guestName}”\n\nWhat do you think?`
      ]
    }
    const hookOrQuoteTemplate = isGuest ? templates.guest : templates.noGuest
    if (intention === 'story') {
      return hookOrQuoteTemplate[4]()
    }
    const randomKeyIndex = Math.floor(Math.random() * hookOrQuoteTemplate.length)
    return hookOrQuoteTemplate[randomKeyIndex]()
  }

  const strategyCaptionTemplates: Template = {
    noGuest: {
      rebelN1: [
        () => `Main Tweet: Which of these have you tried when it comes to getting ${result}?\n\nReply 1: ${chtArr[0]}\n\nReply 2: ${chtArr[1]}\n\nReply 3: ${chtArr[2]}\n\nReply 4: Did it work for you?`
      ],
      rebelN2: [
        () => `Main Tweet: Here’s what ${audience} are always told when it comes to ${topic1}\n\nReply 1: ${chtArr[0]}\n\nReply 2: ${chtArr[1]}\n\nReply 3: ${chtArr[2]}\n\nReply 4: Myth or Reality? What do you think?`
      ],
      boxerN2: [
        () => `Main Tweet: The top 3 challenges when trying to get ${result}\n\nReply 1: ${chtArr[0]}\n\nReply 2: ${chtArr[1]}\n\nReply 3: ${chtArr[2]}\n\nReply 4: Which of these hit the hardest? Or do you have a different POV?`
      ],
      boxerN5: [
        () => `Main Tweet: Struggling with ${topic1} and getting ${result}? Here’s what it looks like for other ${audience} 👇\n\nReply 1: ${chtArr[0]}\n\nReply 2: ${chtArr[1]}\n\nReply 3: ${chtArr[2]}\n\nReply 4: What does it look like for you?`
      ],
      boxerN6: [
        () => `Main Tweet: One of the most common pain points when trying to get ${result}\n\nReply 1: ${chtArr[0]}\n\nReply 2: What are you struggling most with?`,
        () => `Main Tweet: One of the most common pain points when trying to get ${result}\n\nReply 1: ${chtArr[1]}\n\nReply 2: What are you struggling most with?`,
        () => `Main Tweet: One of the most common pain points when trying to get ${result}\n\nReply 1: ${chtArr[2]}\n\nReply 2: What are you struggling most with?`
      ],
      hookOrQuote: [
        () => getHookOrQuote(!!isGuest)
      ]
    },
    guest: {
      rebelN1: [
        () => `Main Tweet: Which of these have you tried when it comes to getting ${result}?\n\nReply 1: ${chtArr[0]}\n\nReply 2: ${chtArr[1]}\n\nReply 3: ${chtArr[2]}\n\nReply 4: Did it work for you?`
      ],
      rebelN2: [
        () => `Main Tweet: Here’s what ${audience} are always told when it comes to ${topic1}\n\nReply 1: ${chtArr[0]}\n\nReply 2: ${chtArr[1]}\n\nReply 3: ${chtArr[2]}\n\nReply 4: Myth or Reality? What do you think?`
      ],
      boxerN2: [
        () => `Main Tweet: The top 3 challenges when trying to get ${result}\n\nReply 1: ${chtArr[0]}\n\nReply 2: ${chtArr[1]}\n\nReply 3: ${chtArr[2]}\n\nReply 4: Which of these hit the hardest? Or do you have a different POV?`
      ],
      boxerN5: [
        () => `Main Tweet: Struggling with ${topic1} and getting ${result}? Here’s what it looks like for other ${audience} 👇\n\nReply 1: ${chtArr[0]}\n\nReply 2: ${chtArr[1]}\n\nReply 3: ${chtArr[2]}\n\nReply 4: What does it look like for you?`
      ],
      boxerN6: [
        () => `Main Tweet: One of the most common pain points when trying to get ${result}\n\nReply 1: ${chtArr[0]}\n\nReply 2: What are you struggling most with?`,
        () => `Main Tweet: One of the most common pain points when trying to get ${result}\n\nReply 1: ${chtArr[1]}\n\nReply 2: What are you struggling most with?`,
        () => `Main Tweet: One of the most common pain points when trying to get ${result}\n\nReply 1: ${chtArr[2]}\n\nReply 2: What are you struggling most with?`
      ],
      hookOrQuote: [
        () => getHookOrQuote(!!isGuest)
      ]
    }
  }
  const storyCaptionTemplates: Template = {
    noGuest: {
      boxerN12: [
        () => `Main Tweet: One of the most common pain points when trying to get ${result}\n\nReply 1: ${chtArr[0]}\n\nReply 2: What are you struggling most with?`,
        () => `Main Tweet: One of the most common pain points when trying to get ${result}\n\nReply 1: ${chtArr[1]}\n\nReply 2: What are you struggling most with?`,
        () => `Main Tweet: One of the most common pain points when trying to get ${result}\n\nReply 1: ${chtArr[2]}\n\nReply 2: What are you struggling most with?`
      ],
      hookOrQuote: [
        () => getHookOrQuote(!!isGuest)
      ]
    },
    guest: {
      boxerN12: [
        () => `Main Tweet: One of the most common pain points when trying to get ${result}\n\nReply 1: ${chtArr[0]}\n\nReply 2: What are you struggling most with?`,
        () => `Main Tweet: One of the most common pain points when trying to get ${result}\n\nReply 1: ${chtArr[1]}\n\nReply 2: What are you struggling most with?`,
        () => `Main Tweet: One of the most common pain points when trying to get ${result}\n\nReply 1: ${chtArr[2]}\n\nReply 2: What are you struggling most with?`
      ],
      hookOrQuote: [
        () => getHookOrQuote(!!isGuest)
      ]
    }
  }

  const validStrategyKeys = ['rebelN1', 'rebelN2', 'boxerN2', 'boxerN5', 'boxerN6']
  const validStoryKeys = ['boxerN12']
  if (getDefault) {
    if (intention === 'story') {
      if (isGuest) {
        return Object.freeze({
          template: storyCaptionTemplates.guest.hookOrQuote[0](),
          key: 'quoteB',
          storyBasedTemplate: [],
          strategyBasedTemplateKeys: []
        })
      } else {
        return Object.freeze({
          template: storyCaptionTemplates.guest.hookOrQuote[0](),
          key: 'quoteB',
          storyBasedTemplate: [],
          strategyBasedTemplateKeys: []
        })
      }
    } else {
      if (isGuest) {
        return Object.freeze({
          template: strategyCaptionTemplates.guest.hookOrQuote[0](),
          key: 'quoteB',
          storyBasedTemplate: [],
          strategyBasedTemplateKeys: []
        })
      } else {
        return Object.freeze({
          template: strategyCaptionTemplates.noGuest.hookOrQuote[0](),
          key: 'quoteB',
          storyBasedTemplate: [],
          strategyBasedTemplateKeys: []
        })
      }
    }
  }

  let chtKeys: string[] = ['hookOrQuote']
  if (chtPrompts !== undefined && Object.keys(chtPrompts).length) {
    chtKeys = [...Object.keys(chtPrompts), latestCht.key].filter((key) => key !== '').filter((key) => {
      if (intention === 'strategy') {
        return validStrategyKeys.includes(key)
      } else {
        return validStoryKeys.includes(key)
      }
    })
  }
  if (intention === 'story') {
    chtKeys = chtKeys?.length ? [...chtKeys, 'hookOrQuote'] : ['hookOrQuote']
  } else {
    chtKeys = chtKeys?.length ? [...chtKeys, 'hookOrQuote'] : ['hookOrQuote']
  }
  const isPropExists = (obj: object, key: string) => Object.prototype.hasOwnProperty.call(obj, key)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getRandomKey = () => {
    const keys = chtKeys
    const randomIndex = Math.floor(Math.random() * keys.length)
    let key = keys[randomIndex]
    if (intention === 'story') {
      if (isGuest) {
        key = isPropExists(storyCaptionTemplates.guest, key) ? key : 'hookOrQuote'
      } else {
        key = isPropExists(storyCaptionTemplates.noGuest, key) ? key : 'hookOrQuote'
      }
    } else {
      if (isGuest) {
        key = isPropExists(strategyCaptionTemplates.guest, key) ? key : 'hookOrQuote'
      } else {
        key = isPropExists(strategyCaptionTemplates.noGuest, key) ? key : 'hookOrQuote'
      }
    }
    return key
  }
  const randomKey = getRandomKey()
  // const randomKey = typeof latestCht.key === 'undefined' ? chtKeys[0] : latestCht.key
  const getStrategyCaptionTemplate = () => {
    return isGuest ? strategyCaptionTemplates.guest[randomKey] : strategyCaptionTemplates.noGuest[randomKey]
  }
  const getStoryCaptionTemplate = () => {
    return isGuest ? storyCaptionTemplates.guest[randomKey] : storyCaptionTemplates.noGuest[randomKey]
  }
  const captionTemplateArray = intention === 'story' ? getStoryCaptionTemplate() : getStrategyCaptionTemplate()
  const randomTemplateIndex = Math.floor(Math.random() * captionTemplateArray.length | 0)
  const template = captionTemplateArray[randomTemplateIndex]()
  const cleanTemplate = template.replace(/\n/gm, '<br/>')
  return Object.freeze({
    template: cleanTemplate,
    key: randomKey,
    type: 'engagement',
    storyBasedTemplate: Object.keys(storyCaptionTemplates.noGuest),
    strategyBasedTemplateKeys: Object.keys(strategyCaptionTemplates.noGuest)
  })
}
