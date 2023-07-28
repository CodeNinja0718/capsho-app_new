import type { DescriptionContext } from 'stores/cht-templates/models'
import { isPropExists } from './template-helpers'

export interface Template {
  [key: string]: Array<() => string>,
}
export function getRandomDescriptionTemplate (context: DescriptionContext) {
  const { topic2, hook, hookStatement, findings, logLine1, latestCht, tagline1, intention } = context
  const cht = {
    ...latestCht
  }
  const strategyDescriptionTemplates: Template = {
    rebelN1: [
      () => `${topic2} is not about: ${cht.value}\n\nFind out what it IS about in this episode`,
      () => `${topic2} is not about: ${cht.value}\n\nThis episode will show you a new perspective. ${hookStatement}`,
      () => `When it comes to ${topic2}, have you ever been told:\n\n${cht.value}\n\nThen this episode is for you!`
    ],
    rebelN2: [
      () => `${topic2} is not about: ${cht.value}\n\nFind out what it IS about in this episode`,
      () => `${topic2} is not about: ${cht.value}\n\n${hookStatement}`,
      () => `When it comes to ${topic2}, have you ever been told:\n\n${cht.value}\n\nThen this episode is for you!`
    ],
    boxerN1: [
      () => cht.value,
      () => `${cht.value}\n\n${hookStatement}`,
      () => `${cht.value}\n\nIn this episode you will learn:\n${findings}`
    ],
    boxerN2: [
      () => `Do you find yourself:\n\n${cht.value}\n\nThen this episode is for you!`,
      () => `Do you find yourself:\n\n${cht.value}\n\nThen this episode is for you!\n\n${hookStatement}`,
      () => `Do you find yourself:\n\n${cht.value}\n\nThen this episode is for you!\n\nYou will learn:\n${findings}`
    ],
    boxerN3: [
      () => cht.value,
      () => `${cht.value}\n\n${hookStatement}`,
      () => `${cht.value}\n\nIn this episode you will learn:\n${findings}`
    ],
    boxerN4: [
      () => cht.value,
      () => `${cht.value}\n\n${hookStatement}`,
      () => `${cht.value}\n\nIn this episode you will learn:\n${findings}`
    ],
    boxerN5: [
      () => `Are you dealing with any of this?\n\n${cht.value}\n\nThen this episode is for you!`,
      () => `Are you dealing with any of this?\n\n${cht.value}\n\nIn this episode, ${hookStatement}`,
      () => `Are you dealing with any of this?${cht.value}\n\nIn this episode you will learn:\n${findings}`
    ],
    boxerN6: [
      () => `${cht.value}\n\nIf you've been feeling this, then this episode is for you!`,
      () => `${cht.value}\n\nIf you've been feeling this, then this episode is for you!\n\nIn this episode, ${hookStatement}`,
      () => `${cht.value}\n\nIf you've been feeling this, then this episode is for you!\n\nYou will learn:\n${findings}`
    ],
    marvel: [
      () => cht.value,
      () => `${cht.value}\n\n${hookStatement}`,
      () => `${cht.value}\n\nIn this episode you will learn:\n${findings}`
    ],
    jawDropper: [
      () => cht.value,
      () => `${cht.value}\n\n${hookStatement}`,
      () => `${cht.value}\n\nIn this episode you will learn:\n${findings}`
    ],
    hook: [
      () => `${hook}\n\n${hookStatement}`,
      () => `${hook}\n\nIn this episode you will learn:\n${findings}`
    ],
    logLine1: [
      () => `${logLine1}\n\n${hookStatement}`,
      () => `${logLine1}\n\nIn this episode you will learn:\n${findings}`
    ]
  }
  const storyDescriptionTemplates: Template = {
    tagline1: [
      () => `${tagline1}`,
      () => `${tagline1}\n\nIn this episode, you will learn:\n${findings}`
    ],
    tagline2: [
      () => `${cht.value}`,
      () => `${cht.value}\n\nIn this episode, you will learn:\n${findings}`
    ],
    logLine1: [
      () => `${logLine1}`,
      () => `${logLine1}\n\nIn this episode, you will learn:\n${findings}`
    ],
    logLine2: [
      () => `${cht.value}`,
      () => `${cht.value}\n\nIn this episode, you will learn:\n${findings}`
    ],
    logLine3: [
      () => `${cht.value}`,
      () => `${cht.value}\n\nIn this episode, you will learn:\n${findings}`
    ],
    marvelN10: [
      () => `${cht.value}`,
      () => `${cht.value}\n\nIn this episode, you will learn:\n${findings}`
    ],
    jawDropperN10: [
      () => `${cht.value}`,
      () => `${cht.value}\n\nIn this episode, you will learn:\n${findings}`
    ],
    boxerN11: [
      () => `${cht.value}`,
      () => `${cht.value}\n\nIn this episode, you will learn:\n${findings}`
    ],
    boxerN12: [
      () => `Do you find yourself:\n\n${cht.value}\n\nThen this episode is for you!`,
      () => `Do you find yourself:\n\n${cht.value}\n\nThen this episode is for you!\n\nYou will learn:\n${findings}`
    ],
    boxerN13: [
      () => `${cht.value}`,
      () => `${cht.value}\n\nIn this episode, you will learn:\n${findings}`
    ],
    boxerN14: [
      () => `${cht.value}`,
      () => `${cht.value}\n\nIn this episode, you will learn:\n${findings}`
    ]
  }
  const getRandomKey = () => {
    let keys
    if (intention === 'story') {
      keys = [cht.key, 'tagline1', 'logLine1']
    } else {
      keys = [cht.key, 'hook', 'logLine1']
    }
    const randomKeyIndex = Math.floor(Math.random() * keys.length | 0)
    const key = keys[randomKeyIndex]
    return intention === 'story' ? isPropExists(storyDescriptionTemplates, key) ? key : 'logLine1'
      : isPropExists(strategyDescriptionTemplates, key) ? key : 'logLine1'
  }
  const key = getRandomKey()
  const toolTemplates = intention === 'story'
    ? storyDescriptionTemplates[key]
    : strategyDescriptionTemplates[key]
  const randomKeyIndex = Math.floor(Math.random() * toolTemplates.length | 0)
  let template = toolTemplates[randomKeyIndex]()
  if (template === undefined) {
    template = intention === 'story' ? storyDescriptionTemplates.logLine1[0]() : strategyDescriptionTemplates.logLine1[0]()
  }
  return { template, key, storyBasedTemplateKeys: Object.keys(storyDescriptionTemplates), strategyBasedTemplateKeys: Object.keys(strategyDescriptionTemplates) }
}
