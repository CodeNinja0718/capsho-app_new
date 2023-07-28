import { getRandomDescriptionTemplate } from './descriptions'

const storyContext = {
  topic2: 'podcast sponsorship.',
  hook: 'Do you want to start a podcast but don\'t know where to begin? Then this article is for you!',
  hookStatement: 'You will learn how to start a podcast from scratch.',
  findings: '1. What are some things podcasters should and shouldn\'t do when seeking out sponsorships?  2. How can podcasters be creative with their ad reads?  3. Why is it beneficial for podcasters to seek out their own sponsors instead of relying on sponsorship websites?',
  logLine1: 'In a world where men are the dominant gender, one woman fights to be seen as an equal.',
  tagline1: 'A heartwarming story of love and friendship that will make you laugh and cry.',
  latestCht: {
    key: 'boxerN13',
    value: 'Do you want to build a strong podcasting community? Are you looking for collaboration and connections within the podcasting world? If you\'re struggling to find ways to get these things, then this episode is for you.'
  },
  intention: 'story'
}

const strategyContext = {
  topic2: 'Growing a podcast audience.',
  hook: 'If you want to grow your podcast audience, you need to get to the top of the traffic pyramid.',
  hookStatement: 'You will learn how to get to the top of the traffic pyramid to grow your podcast audience.',
  findings: '1. A foolproof strategy for getting traffic and growing your audience 2. The importance of creating trust with your audience 3. Leveraging other people\'s audiences to grow your own\n',
  logLine1: 'In order to grow her podcast audience and business, Deidre Chen shares her foolproof traffic pyramid strategy that starts with creating organic content and moves up to leveraging other people\'s audiences.',
  tagline1: '',
  latestCht: {
    key: 'boxerN6',
    value: '1. You put in the work but your audience doesn\'t grow. 2. You\'re not reaching new listeners and your growth stalls. 3. You\'re not sure what you\'re doing wrong and how to fix it.'
  },
  intention: 'strategy'
}

describe('[>>> Random Description Template]', () => {
  test('returns story based template', () => {
    const { template, key, storyBasedTemplateKeys }: { template: string, key: string, storyBasedTemplateKeys: string[] } = getRandomDescriptionTemplate(storyContext)
    expect(template).toBeDefined()
    expect(key).toBeDefined()
    expect(storyBasedTemplateKeys).toContain(key)
  })

  test('returns strategy based template', () => {
    const { template, key, strategyBasedTemplateKeys }: { template: string, key: string, strategyBasedTemplateKeys: string[] } = getRandomDescriptionTemplate(strategyContext)
    expect(template).toBeDefined()
    expect(key).toBeDefined()
    expect(strategyBasedTemplateKeys).toContain(key)
  })

  test('returns default story [\'tagline1\', \'logLine1\'] if random template is undefined', () => {
    const { key } = getRandomDescriptionTemplate({
      ...storyContext,
      latestCht: {
        key: '',
        value: storyContext.latestCht.value
      }
    })
    expect(['tagline1', 'logLine1']).toContain(key)
  })

  test('returns default strategy [\'hook\', \'logLine1\'] if random template is undefined', () => {
    const { key } = getRandomDescriptionTemplate({
      ...strategyContext,
      latestCht: {
        key: '',
        value: strategyContext.latestCht.value
      }
    })
    expect(['hook', 'logLine1']).toContain(key)
  })

  test('returns default [\'hook\', \'logLine1\'] if intention is not specified', () => {
    const { key } = getRandomDescriptionTemplate({
      ...strategyContext,
      intention: ''
    })
    expect([strategyContext.latestCht.key, 'hook', 'logLine1']).toContain(key)
  })
})
