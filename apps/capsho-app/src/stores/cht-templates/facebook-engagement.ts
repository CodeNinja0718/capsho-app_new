import { EngagementCaption, Prompt, Template } from 'stores/cht-templates/models'

export function getEngagementRandomCaptionTemplate (context: EngagementCaption) {
  const {
    hook,
    audience,
    isGuest,
    guestName,
    findings,
    quoteB,
    topic1,
    topic2,
    latestCht,
    intention,
    chtPrompts,
    result,
    podcastName,
    getDefault
  } = context
  const findingsArr = findings?.replace(/<br>/gm, '')
    .split(/\d./)
    .filter((item) => !['', '<br>', '<br><br>'].includes(item)) ?? ['']
  const getHookOrQuote = (isGuest: boolean): string => {
    const templates: Prompt = {
      noGuest: [
        () => `${hook}\n\nWhat do you think? Comment below and let me know!`,
        () => `"${quoteB}"\n\nThese words from this week’s episode of ${podcastName} are still on my mind\n\nDrop me a comment below if it resonates with you.`
      ],
      guest: [
        () => `${hook}\n\nWhat do you think? Comment below and let me know!`,
        () => `"${quoteB}"\n\nThese words by ${guestName} are still on my mind from this week’s episode of ${podcastName}\n\nDrop us a comment below if it resonates with you.`
      ]
    }
    const hookOrQuoteTemplate = isGuest ? templates.guest : templates.noGuest
    const randomKeyIndex = Math.floor(Math.random() * hookOrQuoteTemplate.length)
    return hookOrQuoteTemplate[randomKeyIndex]()
  }

  const strategyCaptionTemplates: Template = {
    noGuest: {
      rebelN1: [
        () => `It’s common to hear that ${topic2} is about:\n${cht.value}\n\nBut I think that misses the point if you’re looking for ${result}\n\nI’ve dedicated this week’s episode of ${podcastName} to deep dive into this.\nFor example: ${findingsArr[0]}\n\nYou can listen at the link in bio / comments.\n\nI want to hear from you. Comment below and let me know: what is your perspective on ${topic2}?`
      ],
      rebelN2: [
        () => `It’s common to hear that ${topic2} is about:\n${cht.value}\n\nBut I think that misses the point if you’re looking for ${result}\n\nI’ve dedicated this week’s episode of ${podcastName} to deep dive into this.\n\nFor example: ${findingsArr[0]}\n\nYou can listen at the link in bio / comments.\n\nI want to hear from you. Comment below and let me know: what is your perspective on ${topic2}?`
      ],
      boxerN2: [
        () => `Are you feeling any of this?\n${cht.value}\n\nYou’re not alone.\n\nSo many other ${audience} are in the same boat. It was something I focused on ${podcastName} this week.\n\nComment below and let me know: what is your biggest challenge when it comes to ${result}?`,
        () => `Are you feeling any of this?\n${cht.value}\n\nTrust me, you’re not alone.\n\nSo many ${audience} are right there with you.\n\nThis is why I focused on it on ${podcastName} this week, covering things like ${findingsArr[0]}\nLet me know in the comments: what are you struggling most when it comes to ${result}?`
      ],
      boxerN5: [
        () => `Are you dealing with any of this?\n\n${cht.value}\n\nThis 👆is what other ${audience} like you have told me they’re struggling with.\n\nWhich is why this week's episode of ${podcastName} is dedicated to solutions to these challenges.\n\nBut I want to hear it in your words. What do YOU struggle with when it comes to ${topic1} and getting ${result}?`,
        () => `Are you dealing with any of this?\n\n${cht.value}\n\nThis 👆is what other ${audience} like you have told me they’re struggling with.\n\nWhich is why this week's episode of ${podcastName} is dedicated to solutions to these challenges.\n\nFor example, ${findingsArr[0]}\n\nComment below and let me know: What do YOU struggle with when it comes to ${topic1} and getting ${result}?`
      ],
      boxerN6: [
        () => `Are you experiencing any of this?\n\n${cht.value}\n\nYou’re not the only one facing this same struggle.\n\nSo I dove into it in this week's episode of ${podcastName}.\n\nWhat is the hardest thing about getting ${result} for you? Comment below`,
        () => `Are you experiencing any of this?\n\n${cht.value}\n\nYou’re not the only one facing this same struggle.\n\nSo I dove into it in this week's episode of ${podcastName}.\n\nOne of my favorite parts was ${findingsArr[0]}\n\nWhat is the hardest thing about getting ${result} for you? Comment below and let me know`
      ],
      marvel: [
        () => `${cht.value}\n\nOne very important thing we covered is ${findingsArr[0]}\n\nI want to hear from you. How are you getting ${result}?`
      ],
      hookOrQuote: [
        () => getHookOrQuote(!!isGuest)
      ]
    },
    guest: {
      rebelN1: [
        () => `It’s common to hear that ${topic2} is about:\n${cht.value}\n\nBut I think that misses the point if you’re looking for ${result}\n\nI’ve dedicated this week’s episode of ${podcastName}, I have a special guest, ${guestName} to deep dive into this.\nThey shared so many gems including this: ${findingsArr[0]}\n\nYou can listen to the full conversation at the link in bio / comments.\n\nI want to hear from you. Comment below and let me know: what is your perspective on ${topic2}?`
      ],
      rebelN2: [
        () => `It’s common to hear that ${topic2} is about:\n${cht.value}\n\nBut I think that misses the point if you’re looking for ${result}\n\nSo on this week’s episode of ${podcastName}, I have a special guest, ${guestName} to deep dive into this.\n\nThey shared so many gems including this: ${findingsArr[0]}\n\nYou can listen to the full conversation at the link in bio / comments.\n\nI want to hear from you. Comment below and let me know: what is your perspective on ${topic2}?`
      ],
      boxerN2: [
        () => `Are you feeling any of this?\n${cht.value}\n\nYou’re not alone.\n\nSo many other ${audience} are in the same boat. I had such a great conversation with ${guestName} this week on this very topic.\n\nComment below and let us know: what is your biggest challenge when it comes to ${result}?`,
        () => `Are you feeling any of this?\n${cht.value}\n\nTrust me, you’re not alone.\n\nSo many ${audience} are right there with you.\n\nThis is why I interviewed ${guestName} in this week's episode of ${podcastName} and we covered a lot of ground including ${findingsArr[0]}\nLet us know in the comments: what are you struggling most when it comes to ${result}?`
      ],
      boxerN5: [
        () => `Are you dealing with any of this?\n\n${cht.value}\n\nThis 👆is what other ${audience} like you have told me they’re struggling with.\n\nWhich is why I invited ${guestName} on this week's episode of ${podcastName} to discuss solutions to these challenges.\n\nBut we want to hear it in your words. What do YOU struggle with when it comes to ${topic1} and getting ${result}?`,
        () => `Are you dealing with any of this?\n\n${cht.value}\n\nThis 👆is what other ${audience} like you have told me they’re struggling with.\n\nWhich is why I invited ${guestName} on this week's episode of ${podcastName} to discuss solutions to these challenges.\n\nFor example, ${findingsArr[0]}\n\nComment below and let us know: What do YOU struggle with when it comes to ${topic1} and getting ${result}?`
      ],
      boxerN6: [
        () => `Are you experiencing any of this?\n\n${cht.value}\n\nYou’re not the only one facing this same struggle.\n\nI dove into it with ${guestName} in this week's episode of ${podcastName}.\n\nWhat is the hardest thing about getting ${result} for you? Comment below`,
        () => `Are you experiencing any of this?\n\n${cht.value}\n\nYou’re not the only one facing this same struggle.\n\nI dove into it with ${guestName} in this week's episode of ${podcastName}.\n\nOne of my favorite parts was ${findingsArr[0]}\n\nWhat is the hardest thing about getting ${result} for you? Comment below and let me know`
      ],
      marvel: [
        () => `${cht.value}\n\nOne very important thing we covered is ${findingsArr[0]}\n\nWe want to hear from you. How are you getting ${result}?`
      ],
      hookOrQuote: [
        () => getHookOrQuote(!!isGuest)
      ]
    }
  }
  const storyCaptionTemplates: Template = {
    noGuest: {
      marvelN10: [
        () => `${cht.value}\n\nOne very important thing is ${findingsArr[0]}\n\nI want to hear from you. How are you getting ${result}?`
      ],
      quoteB: [
        () => `"${quoteB}"\n\nThese words from this week’s episode of ${podcastName} are still on my mind\n\nDrop me a comment below if it resonates with you.`
      ],
      boxerN12: [
        () => `Are you feeling any of this?\n${cht.value}\n\nYou’re not alone.\n\nSo many other ${audience} are in the same boat. It was something I focused on ${podcastName} this week.\n\nComment below and let me know: what is your biggest challenge when it comes to ${result}?`,
        () => `Are you feeling any of this?\n${cht.value}\n\nTrust me, you’re not alone.\n\nSo many ${audience} are right there with you.\n\nThis is why I focused on it on ${podcastName} this week, covering things like ${findingsArr[0]}\n\nLet me know in the comments: what are you struggling most when it comes to ${result}?`
      ]
    },
    guest: {
      marvelN10: [
        () => `${cht.value}\n\nOne very important thing is ${findingsArr[0]}\n\nWe want to hear from you. How are you getting ${result}?`
      ],
      quoteB: [
        () => `"${quoteB}"\n\nThese words by ${guestName} are still on my mind from this week’s episode of ${podcastName}\n\nDrop me a comment below if it resonates with you.`
      ],
      boxerN12: [
        () => `Are you feeling any of this?\n${cht.value}\n\nYou’re not alone.\n\nSo many other ${audience} are in the same boat.I had such a great conversation with ${guestName} this week on this very topic.\n\nComment below and let me know: what is your biggest challenge when it comes to ${result}?`,
        () => `Are you feeling any of this?\n${cht.value}\n\nTrust me, you’re not alone.\n\nSo many ${audience} are right there with you.\n\nThis is why I interviewed ${guestName} in this week's episode of ${podcastName}, covering things like ${findingsArr[0]}\n\nLet me know in the comments: what are you struggling most when it comes to ${result}?`
      ]
    }
  }

  const validStrategyKeys = ['rebelN1', 'rebelN2', 'boxerN2', 'boxerN5', 'boxerN6', 'marvel']
  const validStoryKeys = ['marvel', 'boxerN12']

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
    chtKeys = Object.keys(chtPrompts).filter((key) => key !== '').filter((key) => {
      if (intention === 'strategy') {
        return validStrategyKeys.includes(key)
      } else {
        return validStoryKeys.includes(key)
      }
    })
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
  const randomKey = getRandomKey()
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
