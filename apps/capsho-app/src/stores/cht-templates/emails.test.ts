import { getRandomEmailTemplate } from './emails'

const storyContext = {
  title: 'The Beguiled',
  guestName: '',
  logLine1: 'A struggling writer tries to sell a script about a struggling writer and finds that no one wants to hear his story.',
  tagline1: '"A heartwarming story of a young girl\'s journey to find her place in the world."',
  story: 'I was walking home from the store when I saw a cat in the street. I decided to pick it up and take it home with me. When I got home, I found out that the cat was pregnant. I took care of the cat and her kittens until they were old enough to be on their own. Now I have six new cats in my hous…',
  latestCht: {
    key: 'marvelN10',
    value: 'Do you want to understand the history of the United States in a different way? I\'m sharing the solution so that you can get a deeper understanding of the history of race relations in the United States.'
  },
  quoteB: '"You can\'t put a limit on how much you can improve and how much you can do. There are no limits on what you can be, do, or have in life." -Tony Robbins',
  findings: '1. What are the benefits of meditation? 2. How can meditation help reduce stress? 3. How can meditation help improve focus and concentration?',
  isGuest: false,
  intention: 'story',
  chtKeys: ['boxerN13', 'jawDropperN10'],
  chtPrompts: {
    boxerN13: '1. When you\'re not able to connect with your partner on an intimate level.  2. When you\'re not able to communicate effectively with your partner.  3. When you\'re not able to have a healthy and fulfilling sexual relationship with your partner.',
    jawDropperN10: 'Do you want to create Raving fans for your podcast?  Pat Chung is sharing the solution so you can get the result you want.'
  }
}
const strategyContext = {
  title: 'Racial Preferences for Schools: Evidence from an Experiment with White, Black, Latinx, and Asian Parents and Students',
  guestName: 'Dr. Sean Paul Haley',
  logLine1: 'When white, black, Latinx, and Asian parents and students are given a choice of schools with controlled variables, race is still a central factor in family school rankings.',
  story: 'I\'m Dr. Sean Paul Haley, and my work focuses on the role of race and racism and how it shapes young people\'s lives. I got interested in this topic when I transitioned from middle school to high school and saw the huge difference in resources available to students depending on what school the…',
  hookStatement: 'You will learn if schools that are segregated by race and income actually provide a better education for children.',
  findings: '1. How race and racism shape young people\'s lives 2. How school segregation is related to housing segregation 3. How parents and students express racial preferences for schools',
  quoteB: '"So often when policymakers look at school segregation they tie it to the racial segregation of the city. Right? You can\'t fix school segregation until you fix housing segregation. Right. So then the logic goes, if you\'re assigned to your neighborhood school and we have racial segregation, …',
  topic2: '"School choice and integration."',
  hook: 'Do schools that are segregated by race and income actually provide a better education for children?',
  latestCht: {
    key: 'boxerN3',
    value: 'If you\'re a parent looking for equity, inclusion, or integration in your child\'s school, then this episode is for you. We\'ll explore the various ways that parents can advocate for their children and get the results they\'re looking for.'
  },
  isGuest: true,
  intention: 'strategy',
  chtKeys: ['boxerN6', 'marvel'],
  chtPrompts: {
    boxerN6: '1. When you\'re not able to connect with your partner on an intimate level.  2. When you\'re not able to communicate effectively with your partner.  3. When you\'re not able to have a healthy and fulfilling sexual relationship with your partner.',
    marvel: 'Do you want to create Raving fans for your podcast?  Pat Chung is sharing the solution so you can get the result you want.'
  }
}
describe('[>>> Random Email Template]', () => {
  test('returns story based email template', () => {
    const { template, key, storyBasedTemplateKeys } = getRandomEmailTemplate(storyContext)
    expect(template).toBeDefined()
    expect(key).toBeDefined()
    expect(storyBasedTemplateKeys).toContain(key)
  })

  test('returns strategy based email template', () => {
    const { template, key, strategyBasedTemplateKeys } = getRandomEmailTemplate(strategyContext)
    expect(template).toBeDefined()
    expect(key).toBeDefined()
    expect(strategyBasedTemplateKeys).toContain(key)
  })

  test('returns default story based email template if chtKeys is empty', () => {
    const { key } = getRandomEmailTemplate({
      ...storyContext,
      chtKeys: []
    })
    expect(['story', 'quoteB']).toContain(key)
  })

  test('returns default strategy based email template if chtKeys is empty', () => {
    const { key } = getRandomEmailTemplate({
      ...strategyContext,
      chtKeys: []
    })
    expect(['story', 'quoteB', 'hook']).toContain(key)
  })

  test('returns default story based email template if cht key is strategy', () => {
    const { key } = getRandomEmailTemplate({
      ...storyContext,
      latestCht: strategyContext.latestCht,
      chtKeys: []
    })
    expect(['story', 'quoteB']).toContain(key)
  })

  test('returns default strategy based email template if cht key is story', () => {
    const { key } = getRandomEmailTemplate({
      ...strategyContext,
      latestCht: storyContext.latestCht,
      chtKeys: []
    })
    expect(['story', 'quoteB', 'hook']).toContain(key)
  })
})
