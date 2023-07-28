import { getRandomCaptionTemplate } from './social-captions'

const context = {
  topic2: 'Building authority and trust.',
  hook: 'In today\'s competitive landscape, it can be difficult to market a small business. In this talk, the speaker discusses the importance of testimonials, case studies, and a client Bill of Rights in building authority and trust with potential customers.',
  hookStatement: 'You will learn how to use testimonials, case studies, and a client Bill of Rights to build authority and trust with potential customers.',
  findings: '1. How does one stand out in a competitive market?  2. How important is it to know who your ideal client is?  3. How can you guarantee results from your marketing efforts?',
  title: 'The Clicks and Bricks Podcast: Ken Krogue on the Tribulations of Small Business Ownership',
  isGuest: true,
  guestName: 'Ryan Marion',
  quoteB: '"If we forget who we are, they\'re going to forget who you are."',
  logLine1: 'In this episode, we hear the story of how one woman\'s search for love led her to the world of online dating and catfishing.',
  latestCht: {
    key: 'boxerN6',
    value: '1. Feeling lost and confused, not knowing where to turn for help. 2. Feeling like you\'re struggling alone, and that nobody understands. 3. Feeling like you\'re not good enough, and that you\'ll never improve.'
  },
  intention: 'strategy',
  chtKeys: ['boxerN6', 'marvel'],
  chtPrompts: {
    boxerN6: '1. When you\'re not able to connect with your partner on an intimate level.  2. When you\'re not able to communicate effectively with your partner.  3. When you\'re not able to have a healthy and fulfilling sexual relationship with your partner.',
    marvel: 'Do you want to create Raving fans for your podcast?  Pat Chung is sharing the solution so you can get the result you want.'
  }
}
describe('[>>> Random Social Caption Template', () => {
  test('returns story based caption template', () => {
    const { template, key, storyBasedTemplate } = getRandomCaptionTemplate({
      ...context,
      intention: 'story',
      chtKeys: ['boxerN13', 'jawDropperN10'],
      chtPrompts: {
        boxerN13: 'If you\'re feeling like your best efforts to create racial equity in your child\'s school are not working and you don\'t know what to do next, then this episode is for you!'
      }
    })
    expect(template).toBeDefined()
    expect(key).toBeDefined()
    expect(storyBasedTemplate).toContain(key)
  })

  test('returns strategy based caption template', () => {
    const { template, key, strategyBasedTemplateKeys } = getRandomCaptionTemplate(context)
    expect(template).toBeDefined()
    expect(key).toBeDefined()
    expect(strategyBasedTemplateKeys).toContain(key)
  })

  test('returns default story based email template if chtKeys is empty', () => {
    const { key } = getRandomCaptionTemplate({
      ...context,
      intention: 'story',
      chtKeys: []
    })
    expect(key).toBe('quoteB')
    expect(['quoteB']).toContain(key)
  })

  test('returns default strategy based email template if chtKeys is empty', () => {
    const { key } = getRandomCaptionTemplate({
      ...context,
      chtKeys: []
    })
    expect(key).toBe('hookOrQuote')
    expect(['hookOrQuote']).toContain(key)
  })
})
