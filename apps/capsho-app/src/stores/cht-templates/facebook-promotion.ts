import { DescriptionContext, Prompt, Template } from 'stores/cht-templates/models'

export function getPromotionRandomCaptionTemplate (context: DescriptionContext) {
  const {
    hook,
    title,
    hookStatement,
    isGuest,
    guestName,
    findings,
    quoteB,
    topic2,
    latestCht,
    intention,
    chtPrompts,
    getDefault
  } = context
  const getHookOrQuote = (isGuest: boolean): string => {
    const templates: Prompt = {
      noGuest: [
        () => `${hook}\n\nIn this week's episode, ${title}, ${hookStatement}\n\nListen at the link in bio / comments`,
        () => `${hook}\n\nIn this week's episode I cover:${findings}\n\n${title} is now live. Listen at the link in bio / comments`,
        () => `"${quoteB}"\n\nMy latest podcast episode, ${title}, is now live. Listen at the link in bio / comments`
      ],
      guest: [
        () => `${hook}\n\nIn this week's episode, ${title} with ${guestName}, ${hookStatement}\n\nListen at the link in bio / comments`,
        () => `${hook}\n\nIn this week's episode with ${guestName} I cover:${findings}\n\n${title} is now live. Listen at the link in bio / comments`,
        () => `"${quoteB}"\n\nMy latest podcast episode, ${title} with ${guestName}, is now live. Listen at the link in bio / comments`
      ]
    }
    const hookOrQuoteTemplate = isGuest ? templates.guest : templates.noGuest
    const randomKeyIndex = Math.floor(Math.random() * hookOrQuoteTemplate.length)
    return hookOrQuoteTemplate[randomKeyIndex]()
  }

  const strategyCaptionTemplates: Template = {
    noGuest: {
      rebelN1: [
        () => `${topic2} is not about:\n${cht.value}\n\nWhat IS it about? Find out in this week's episode!\n\nListen at the link in bio / comments`,
        () => `${topic2} is not about:\n${cht.value}\n\nThis week's episode will show you a new perspective! ${hookStatement}\n\nListen at the link in bio / comments`,
        () => `When it comes to ${topic2}, have you ever been told:\n\n${cht.value}\n\nThen this week's episode, ${title}, is for you!\n\nListen at the link in bio / comments`
      ],
      rebelN2: [
        () => `${topic2} is not about:\n${cht.value}\n\nWhat IS it about? Find out in this week's episode!\n\nListen at the link in bio / comments`,
        () => `${topic2} is not about:\n${cht.value}\n\nThis week's episode will show you a new perspective! ${hookStatement}\n\nListen at the link in bio / comments`,
        () => `When it comes to ${topic2}, have you ever been told:\n\n${cht.value}\n\nThen this week's episode, ${title}, is for you!\n\nListen at the link in bio / comments`
      ],
      boxerN1: [
        () => `${cht.value}\n\n${title} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this week's episode, I cover:${findings}\n\nListen at the link in bio / comments`
      ],
      boxerN2: [
        () => `Do you find yourself:\n${cht.value}\n\nThis week's episode is for you! Listen at the link in bio / comments`,
        () => `Do you find yourself:\n${cht.value}\n\nThen this week's episode is for you!\n\n${hookStatement}\n\nListen at the link in bio / comments`
      ],
      boxerN3: [
        () => `${cht.value}\n\n${title} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this week's episode, I cover:${findings}\n\nListen at the link in bio / comments`
      ],
      boxerN4: [
        () => `${cht.value}\n\n${title} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this week's episode, I cover:${findings}\n\nListen at the link in bio / comments`
      ],
      boxerN5: [
        () => `Are you dealing with any of this?\n\n${cht.value}\n\nThen this week's episode, ${title}, is for you. Listen at the link in bio / comments`,
        () => `Are you dealing with any of this?\n\n${cht.value}\n\nThen this week's episode, ${title}, is for you.\n\n${hookStatement}\n\nListen at the link in bio / comments`
      ],
      boxerN6: [
        () => `${cht.value}\n\nIf you've been feeling this, then this week's episode is for you!\n\n${title} is now live! Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIf you've been feeling this, then this week's episode, ${title}, is for you!\n\n${hookStatement}`
      ],
      marvel: [
        () => `${cht.value}\n\nTune into this week' episode, ${title}, to learn more!\n\nListen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this episode I also cover:${findings}\n\nListen at the link in bio / comments`
      ],
      jawDropper: [
        () => `${cht.value}\n\n${title} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this episode I also cover:${findings}\n\nListen at the link in bio / comments`
      ],
      hookOrQuote: [
        () => getHookOrQuote(!!isGuest)
      ]
    },
    guest: {
      rebelN1: [
        () => `${topic2} is not about:\n${cht.value}\n\nWhat IS it about? Find out in this week's episode with ${guestName}!\n\nListen at the link in bio / comments `,
        () => `${topic2} is not about:\n${cht.value}\n\nThis week's episode with ${guestName} will show you a new perspective! ${hookStatement}\n\nListen at the link in bio / comments`,
        () => `When it comes to ${topic2}, have you ever been told:\n\n${cht.value}\n\nThen this week's episode, ${title} featuring ${guestName}, is for you!\n\nListen at the link in bio / comments`
      ],
      rebelN2: [
        () => `${topic2} is not about:\n${cht.value}\n\nWhat IS it about? Find out in this week's episode with ${guestName}!\n\nListen at the link in bio / comments `,
        () => `${topic2} is not about:\n${cht.value}\n\nThis week's episode with ${guestName} will show you a new perspective! ${hookStatement}\n\nListen at the link in bio / comments`,
        () => `When it comes to ${topic2}, have you ever been told:\n\n${cht.value}\n\nThen this week's episode, ${title} featuring ${guestName}, is for you!\n\nListen at the link in bio / comments`
      ],
      boxerN1: [
        () => `${cht.value}\n\n${title} with ${guestName} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this week's episode featuring ${guestName}, I cover:${findings}\n\nListen at the link in bio / comments`
      ],
      boxerN2: [
        () => `Do you find yourself:\n${cht.value}\n\nThis week's episode with ${guestName} is for you! Listen at the link in bio / comments`,
        () => `Do you find yourself:\n${cht.value}\n\nThen this week's episode, featuring ${guestName}, is for you!\n\n${hookStatement}\n\nListen at the link in bio / comments `
      ],
      boxerN3: [
        () => `${cht.value}\n\n${title} with ${guestName} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this week's episode featuring ${guestName}, I cover:${findings}\n\nListen at the link in bio / comments`
      ],
      boxerN4: [
        () => `${cht.value}\n\n${title} with ${guestName} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this week's episode featuring ${guestName}, I cover:${findings}\n\nListen at the link in bio / comments`
      ],
      boxerN5: [
        () => `Are you dealing with any of this?\n\n${cht.value}\n\nThen this week's episode, ${title} with ${guestName}, is for you. Listen at the link in bio / comments`,
        () => `Are you dealing with any of this?\n\n${cht.value}\n\nThen this week's episode, ${title} with ${guestName}, is for you.\n\n${hookStatement}\n\nListen at the link in bio / comments`
      ],
      boxerN6: [
        () => `${cht.value}\n\nIf you've been feeling this, then this week's episode with ${guestName} is for you!\n\n${title} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIf you've been feeling this, then this week's episode featuring ${guestName}, is for you!\n\n${hookStatement}`
      ],
      marvel: [
        () => `${cht.value}\n\nTune into this week' episode with ${guestName}, ${title}, to learn more!\n\nListen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this episode featuring ${guestName}, I also cover:${findings}\n\nListen at the link in bio / comments`
      ],
      jawDropper: [
        () => `${cht.value}\n\n${title} with ${guestName} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this episode with ${guestName} I also cover:${findings}\n\nListen at the link in bio / comments`
      ],
      hookOrQuote: [
        () => getHookOrQuote(!!isGuest)
      ]
    }
  }
  const storyCaptionTemplates: Template = {
    noGuest: {
      marvelN10: [
        () => `${cht.value}\n\nTune into this week' episode, ${title}, to learn more\n\nListen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this episode I also cover:${findings}\n\nListen at the link in bio / comments`
      ],
      jawDropperN10: [
        () => `${cht.value}\n\n${title} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this episode I also cover:${findings}\n\nListen at the link in bio / comments`
      ],
      quoteB: [
        () => `"${quoteB}"\n\nMy latest podcast episode, ${title}, is now live. Listen at the link in bio / comments`
      ],
      boxerN11: [
        () => `${cht.value}\n\n${title} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this week's episode, I cover:${findings}\n\nListen at the link in bio / comments`
      ],
      boxerN12: [
        () => `Do you find yourself:\n${cht.value}\n\nThis week's episode is for you! Listen at the link in bio / comments`,
        () => `Do you find yourself:\n${cht.value}\n\nThis week's episode is for you!\n\nI cover:${findings}\n\nListen at the link in bio / comments`
      ],
      boxerN13: [
        () => `${cht.value}\n\n${title} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this week's episode, I cover:${findings}\n\nListen at the link in bio / comments`
      ],
      boxerN14: [
        () => `${cht.value}\n\n${title} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this week's episode, I cover:${findings}\n\nListen at the link in bio / comments`
      ]
    },
    guest: {
      marvelN10: [
        () => `${cht.value}\n\nTune into this week' episode with ${guestName}, ${title}, to learn more\n\nListen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this episode featuring ${guestName}, I also cover:${findings}\n\nListen at the link in bio / comments`
      ],
      jawDropperN10: [
        () => `${cht.value}\n\n${title} with ${guestName} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this episode with ${guestName} I also cover:${findings}\n\nListen at the link in bio / comments`
      ],
      quoteB: [
        () => `"${quoteB}"\n\nMy latest podcast episode, ${title} with ${guestName}, is now live. Listen at the link in bio / comments`
      ],
      boxerN11: [
        () => `${cht.value}\n\n${title} with ${guestName} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this week's episode featuring ${guestName}, I cover:${findings}\n\nListen at the link in bio / comments`
      ],
      boxerN12: [
        () => `Do you find yourself:\n${cht.value}\n\nThis week's episode with ${guestName} is for you! Listen at the link in bio / comments`,
        () => `Do you find yourself:\n${cht.value}\n\nThis week's episode with ${guestName} is for you!\n\nI cover:${findings}\n\nListen at the link in bio / comments`
      ],
      boxerN13: [
        () => `${cht.value}\n\n${title} with ${guestName} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this week's episode featuring ${guestName}, I cover:${findings}\n\nListen at the link in bio / comments`
      ],
      boxerN14: [
        () => `${cht.value}\n\n${title} with ${guestName} is now live. Listen at the link in bio / comments`,
        () => `${cht.value}\n\nIn this week's episode featuring ${guestName}, I cover:${findings}\n\nListen at the link in bio / comments`
      ]
    }
  }

  if (getDefault) {
    if (intention === 'story') {
      if (isGuest) {
        return Object.freeze({
          template: storyCaptionTemplates.guest.quoteB[0](),
          key: 'quoteB',
          storyBasedTemplate: [],
          strategyBasedTemplateKeys: []
        })
      } else {
        return Object.freeze({
          template: storyCaptionTemplates.noGuest.quoteB[0](),
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

  let chtKeys: string[] = ['quoteB']
  const cht = {
    ...latestCht
  }
  if (chtPrompts !== undefined && Object.keys(chtPrompts).length) {
    chtKeys = Object.keys(chtPrompts).filter((key) => key !== '')
  }
  if (intention === 'story') {
    chtKeys = chtKeys?.length ? [...chtKeys, 'quoteB'] : ['quoteB']
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
        key = isPropExists(storyCaptionTemplates.guest, key) ? key : 'quoteB'
      } else {
        key = isPropExists(storyCaptionTemplates.noGuest, key) ? key : 'quoteB'
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
  const randomKey = typeof latestCht.key === 'undefined' ? chtKeys[0] : latestCht.key
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
    type: 'promotion',
    storyBasedTemplate: Object.keys(storyCaptionTemplates.noGuest),
    strategyBasedTemplateKeys: Object.keys(strategyCaptionTemplates.noGuest)
  })
}
