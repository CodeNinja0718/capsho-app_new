import { DescriptionContext, EmailTemplate } from 'stores/cht-templates/models'
import { isPropExists } from './template-helpers'
import normalizeCht from 'stores/cht-templates/normalizer'

export function getRandomEmailTemplate (context: DescriptionContext) {
  const { title, guestName, logLine1, tagline1, story, hookStatement, findings, quoteB, topic2, hook, latestCht, isGuest, intention, chtPrompts } = context
  let chtKeys: string[] = ['story', 'quoteB']
  let cht = {
    ...latestCht
  }
  if (chtPrompts !== undefined && Object.keys(chtPrompts).length) {
    chtKeys = Object.keys(chtPrompts)
  }
  if (intention === 'story') {
    chtKeys = chtKeys?.length ? [...chtKeys, 'story', 'quoteB'] : ['story', 'quoteB']
  } else {
    chtKeys = chtKeys?.length ? [...chtKeys, 'story', 'quoteB', 'hook'] : ['story', 'quoteB', 'hook']
  }
  const strategyEmailTemplates: EmailTemplate = {
    noGuest: {
      story: [
        () => `Hi [Name],\n\n${story}n\nWhich leads me to my latest episode, ${title}\n\n${logLine1}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n${story}n\nWhich leads me to my latest episode, ${title}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n${story}n\nWhich leads me to my latest episode, ${title}\n\n${logLine1}n\n${hookStatement}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n${story}n\nWhich leads me to my latest episode, ${title}\n\n${logLine1}n\nHere are just some of the things I cover:\n${findings}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      quoteB: [
        () => `${quoteB}\n\nIn this week's episode, ${title}, I'm diving into ${topic2}.\n\n${logLine1}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `${quoteB}\n\nIn this week's episode, ${title}, I'm diving into ${topic2}.\n\n${hookStatement}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `${quoteB}\n\nIn this week's episode, ${title}, I'm diving into ${topic2}.\n\nHere are just some of the things I cover:\n${findings}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      hook: [
        () => `Hi [Name],\n\n${hook}\n\nWhen it comes to ${topic2}, here's what you need to know...\n${findings}nI go into a lot more detail in my latest episode, ${title}\n\nHere's where you can listen: Here's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n${hook}\n\nWhen it comes to ${topic2}, here's what you need to know...\n${findings}nI go into a lot more detail in my latest episode, ${title}\n\n${hookStatement}\n\nHere's where you can listen: Here's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n${hook}\n\nWhen it comes to ${topic2}, here's what you need to know...\n${findings}nI go into a lot more detail in my latest episode, ${title}\n\n${logLine1}\n\nHere's where you can listen: Here's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      rebelN1: [
        (cht: {value: string}) => `Hi [Name],\n\nHere's my honest opinion on ${topic2}...\n\nIt's not about:\n\n${cht.value}\n\nIn this week's episode ${title}, I cover what it IS about.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nHere's my honest opinion on ${topic2}...\n\nIt's not about:\n\n${cht.value}\n\nIn this week's episode ${title}, I cover what it IS about.\n\n${logLine1}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN1: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n${logLine1}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n${hookStatement}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nYou'll learn:\n${findings}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN2: [
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, is for you.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen this week's podcast episode is for you.\n\n${logLine1}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen this week's podcast episode, ${title}, is for you.\n\n${hookStatement}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen this week's podcast episode, ${title}, is for you.\n\nYou'll learn:\n${findings}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN3: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n${logLine1}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n${hookStatement}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nYou'll learn:\n${findings}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN4: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n${logLine1}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n${hookStatement}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nYou'll learn:\n${findings}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN5: [
        (cht: {value: string}) => `Hi [Name],\n\nAre you dealing with any of this?\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, is for you.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nAre you dealing with any of this?\n\n${cht.value}\n\nThen this week's podcast episode is for you.\n\n${logLine1}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nAre you dealing with any of this?\n\n${cht.value}\n\nThen this week's podcast episode, ${title}, is for you.\n\n${hookStatement}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nAre you dealing with any of this?\n\n${cht.value}\n\nThen this week's podcast episode, ${title}, is for you.\n\nYou'll learn:\n${findings}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN6: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIf you've been feeling this, then my latest episode, ${title}, is for you.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIf you've been feeling this, then my latest episode, ${title}, is for you.\n\n${logLine1}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIf you've been feeling this, then my latest episode, ${title}, is for you.\n\n${hookStatement}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIf you've been feeling this, then my latest episode, ${title}, is for you.\n\nYou'll learn:\n${findings}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      marvel: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, is for you.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, with my special guest, ${guestName}, is for you.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, is for you.\n\n${hookStatement}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, is for you.\n\nI cover:\n${findings}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      jawDropper: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, is for you.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, is for you.\n\n${logLine1}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, is for you.\n\n${hookStatement}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, is for you.\n\nI cover:\n${findings}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ]
    },
    guest: {
      story: [
        () => `Hi [Name],\n\n"${story}\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n"${story}\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${logLine1}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n"${story}\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${logLine1}n\n${hookStatement}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n"${story}\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${logLine1}n\nHere are just some of the things we cover:\n${findings}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off] `
      ],
      quoteB: [
        () => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode on ${topic2}.\n\n${logLine1}\n\nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode on ${topic2}.\n\n${hookStatement}\n\nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode on ${topic2}.\n\nHere are just some of the things we cover:\n${findings}nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      hook: [
        () => `Hi [Name],\n\n${hook}\n\nWhen it comes to ${topic2}, here's what you need to know...\n${findings}nI go into a lot more detail with the amazing ${guestName} in my latest episode, ${title}\n\nHere's where you can listen: Here's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n${hook}\n\nWhen it comes to ${topic2}, here's what you need to know...\n${findings}nI go into a lot more detail with the amazing ${guestName} in my latest episode, ${title}\n\n${hookStatement}\n\nHere's where you can listen: Here's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n${hook}\n\nWhen it comes to ${topic2}, here's what you need to know...\n${findings}nI go into a lot more detail with the amazing ${guestName} in my latest episode, ${title}\n\n${logLine1}\n\nHere's where you can listen: Here's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      rebelN1: [
        (cht: {value: string}) => `Hi [Name],\n\nThere are a lot of takes on ${topic2} out there, but ${guestName} has a particularly interesting one!\n\nIt's not about:\n\n${cht.value}\n\nIn this week's episode, we cover what ${topic2} IS about.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nThere are a lot of takes on ${topic2} out there, but ${guestName} has a particularly interesting one!\n\nIt's not about:\n\n${cht.value}\n\nIn this week's episode, ${title}, we cover what ${topic2} IS about.\n\n${logLine1}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN1: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIt's called ${title}, and features the amazing ${guestName}.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n${logLine1}\n\nIt's called ${title} and features the amazing ${guestName}.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n${hookStatement}\n\nIt's called ${title} and features the amazing ${guestName}.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nYou'll learn:\n${findings}\n\nIt's called ${title} and features the amazing ${guestName}.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN2: [
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, with the amazing ${guestName} is for you.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen this week's podcast episode featuring the amazing ${guestName} is for you.\n\n${logLine1}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen this week's podcast episode with my amazing guest ${guestName}, is for you.\n\n${hookStatement}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen my conversation with ${guestName} is for you.\n\nYou'll learn:\n${findings}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN3: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIt's called ${title}, and features the amazing ${guestName}.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n${logLine1}\n\nIt's called ${title} and features the amazing ${guestName}.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n${hookStatement}\n\nIt's called ${title} and features the amazing ${guestName}.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nYou'll learn:\n${findings}\n\nIt's called ${title} and features the amazing ${guestName}.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN4: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIt's called ${title}, and features the amazing ${guestName}.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n${logLine1}\n\nIt's called ${title} and features the amazing ${guestName}.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n${hookStatement}\n\nIt's called ${title} and features the amazing ${guestName}.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nYou'll learn:\n${findings}\n\nIt's called ${title} and features the amazing ${guestName}.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN5: [
        (cht: {value: string}) => `Hi [Name],\n\nAre you dealing with any of this?\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, with the amazing ${guestName} is for you.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nAre you dealing with any of this?\n\n${cht.value}\n\nThen this week's podcast episode featuring the amazing ${guestName} is for you.\n\n${logLine1}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nAre you dealing with any of this?\n\n${cht.value}\n\nThen this week's podcast episode with my amazing guest ${guestName}, is for you.\n\n${hookStatement}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nAre you dealing with any of this?\n\n${cht.value}\n\nThen my conversation with ${guestName} is for you.\n\nYou'll learn:\n${findings}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN6: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIf you've been feeling this, then my latest episode ${title}, with ${guestName} is for you.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIf you've been feeling this, then my latest episode ${title}, with ${guestName} is for you.\n\n${logLine1}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIf you've been feeling this, then my latest episode ${title}, with ${guestName} is for you.\n\n${hookStatement}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIf you've been feeling this, then my latest episode ${title}, with ${guestName} is for you.\n\nYou'll learn:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      marvel: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, with my special guest, ${guestName}, is for you.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, with my special guest, ${guestName}, is for you.\n\n${logLine1}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, with my special guest, ${guestName}, is for you.\n\n${hookStatement}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, with my special guest, ${guestName}, is for you.\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      jawDropper: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, with my special guest, ${guestName}, is for you.\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, with my special guest, ${guestName}, is for you.\n\n${logLine1}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, with my special guest, ${guestName}, is for you.\n\n${hookStatement}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, with my special guest, ${guestName}, is for you.\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ]
    }
  }
  const storyEmailTemplates: EmailTemplate = {
    noGuest: {
      story: [
        () => `Hi [Name],\n\n${story}\n\nWhich leads me to my latest episode, ${title}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n${story}\n\nWhich leads me to my latest episode, ${title}\n\n${logLine1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n${story}\n\nWhich leads me to my latest episode, ${title}\n\n${logLine1}\n\nHere are just some of the things I cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n${story}\n\nWhich leads me to my latest episode, ${title}\n\n${tagline1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n${story}\n\nWhich leads me to my latest episode, ${title}\n\n${tagline1}\n\nHere are just some of the things I cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      logLine2: [
        (cht: {value: string}) => `Hi [Name],\n\n${story}\n\nWhich leads me to my latest episode, ${title}\n\n${cht.value}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${story}\n\nWhich leads me to my latest episode, ${title}\n\n${cht.value}\n\nHere are just some of the things I cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `${quoteB}\n\nHere's what I'm diving into for this week's episode, ${title}.\n\n${cht.value}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `${quoteB}\n\nHere's what I'm diving into for this week's episode, ${title}.\n\n${cht.value}\n\nHere are just some of the things I cover:\n${findings}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      logLine3: [
        (cht: {value: string}) => `Hi [Name],\n\n${story}\n\nWhich leads me to my latest episode, ${title}\n\n${cht.value}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${story}\n\nWhich leads me to my latest episode, ${title}\n\n${cht.value}\n\nHere are just some of the things I cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `${quoteB}\n\nHere's what I'm diving into for this week's episode, ${title}.\n\n${cht.value}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `${quoteB}\n\nHere's what I'm diving into for this week's episode, ${title}.\n\n${cht.value}\n\nHere are just some of the things I cover:\n${findings}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      tagline2: [
        (cht: {value: string}) => `Hi [Name],\n\n${story}\n\nWhich leads me to my latest episode, ${title}\n\n${cht.value}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${story}\n\nWhich leads me to my latest episode, ${title}\n\n${cht.value}\n\nHere are just some of the things I cover:\n${findings}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `${quoteB}\n\nHere's what I'm diving into for this week's episode, ${title}.\n\n${cht.value}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `${quoteB}\n\nHere's what I'm diving into for this week's episode, ${title}.\n\n${cht.value}\n\nHere are just some of the things I cover:\n${findings}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      quoteB: [
        () => `${quoteB}\n\nHere's what I'm diving into for this week's episode, ${title}.\n\n${logLine1}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `${quoteB}\n\nHere's what I'm diving into for this week's episode, ${title}.\n\n${logLine1}\n\nHere are just some of the things I cover:\n${findings}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `${quoteB}\n\nHere's what I'm diving into for this week's episode, ${title}.\n\n${tagline1}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `${quoteB}\n\nHere's what I'm diving into for this week's episode, ${title}.\n\n${tagline1}\n\nHere are just some of the things I cover:\n${findings}\n\nHere's where you can listen:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      marvelN10: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nListen to my latest podcast episode, ${title} here: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n\n\n${logLine1}\n\nListen to my latest podcast episode, ${title} here: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIn my latest podcast episode, ${title}, I cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n\n\n${logLine1}\n\nIn my latest podcast episode, ${title}, I cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\\n\n${tagline1}\n\nListen to my latest podcast episode, ${title} here: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\\n\n${tagline1}\n\nIn my latest podcast episode, ${title}, I cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      jawDropperN10: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${logLine1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\nI cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${logLine1}\n\nI cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${tagline1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${tagline1}\n\nI cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN11: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${logLine1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\nI cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${logLine1}\n\nI cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${tagline1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${tagline1}\n\nI cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN12: [
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, is for you.\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen this week's podcast episode, ${title}, is for you.\n\nYou'll learn:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen this week's podcast episode is for you.\n\n${logLine1}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen this week's podcast episode, ${title}, is for you.\n\n${logLine1}\n\nYou'll learn:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen this week's podcast episode is for you.\n\n${tagline1}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen this week's podcast episode, ${title}, is for you.\n\n${tagline1}\n\nYou'll learn:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN13: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${logLine1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\nI cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${logLine1}\n\nI cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${tagline1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${tagline1}\n\nI cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN14: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${logLine1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\nI cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${logLine1}\n\nI cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${tagline1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title}.\n\n${tagline1}\n\nI cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ]
    },
    guest: {
      story: [
        () => `Hi [Name],\n\n"${story}"\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n"${story}"\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${logLine1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n"${story}"\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${logLine1}\n\nHere are just some of the things we cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n"${story}"\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${tagline1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `Hi [Name],\n\n"${story}"\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${tagline1}\n\nHere are just some of the things we cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      logLine2: [
        (cht: {value: string}) => `Hi [Name],\n\n"${story}"\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${cht.value}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n"${story}"\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${cht.value}\n\nHere are just some of the things we cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode.\n\n${cht.value}\n\nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode.\n\n${cht.value}\n\nHere are just some of the things we cover:\n${findings}\nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      logLine3: [
        (cht: {value: string}) => `Hi [Name],\n\n"${story}"\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${cht.value}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n"${story}"\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${cht.value}\n\nHere are just some of the things we cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode.\n\n${cht.value}\n\nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode.\n\n${cht.value}\n\nHere are just some of the things we cover:\n${findings}\nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      tagline2: [
        (cht: {value: string}) => `Hi [Name],\n\n"${story}"\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${cht.value}Here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n"${story}"\n\n- ${guestName}\n\nMy latest podcast episode, ${title}, featuring the wonderful ${guestName}, is here.\n\n${cht.value}\n\nHere are just some of the things we cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode.\n\n${cht.value}\n\nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode.\n\n${cht.value}\n\nHere are just some of the things we cover:\n${findings}\nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      quoteB: [
        () => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode.\n\n${logLine1}\n\nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode.\n\n${logLine1}\n\nHere are just some of the things we cover:\n${findings}\nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode.\n\n${tagline1}\n\nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        () => `"${quoteB}"\n- ${guestName}\n\nThe amazing ${guestName} joined me for this week's episode.\n\n${tagline1}\n\nHere are just some of the things we cover:\n${findings}\nYou can listen to the full episode, ${title}, here:  [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      marvelN10: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nListen to my latest podcast episode, ${title}, with my special guest, ${guestName}, here: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n\n\n${logLine1}\n\nListen to my latest podcast episode, ${title}, with my special guest, ${guestName}, here: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nIn my latest podcast episode, ${title}, with my special guest, ${guestName} we cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\n\n\n${logLine1}\n\nIn my latest podcast episode, ${title}, with my special guest, ${guestName} we cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\\n\n${tagline1}\n\nListen to my latest podcast episode, ${title}, with my special guest, ${guestName}, here: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\\n\n${tagline1}\n\nIn my latest podcast episode, ${title}, with my special guest, ${guestName} we cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      jawDropperN10: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${logLine1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${logLine1}\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${tagline1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${tagline1}\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN11: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${logLine1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${logLine1}\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${tagline1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${tagline1}\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN12: [
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen my latest podcast episode, ${title}, with the amazing ${guestName} is for you.\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen my conversation with ${guestName} is for you.\n\nYou'll learn:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen this week's podcast episode featuring the amazing ${guestName} is for you.\n\n${logLine1}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen my conversation with ${guestName} is for you.\n\n${logLine1}\n\nYou'll learn:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen this week's podcast episode featuring the amazing ${guestName} is for you.\n\n${tagline1}\n\nIt's called ${title} and here's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\nDo you find yourself:\n\n${cht.value}\n\nThen my conversation with ${guestName} is for you.\n\n${tagline1}\n\nYou'll learn:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN13: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${logLine1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${logLine1}\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${tagline1}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${tagline1}\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ],
      boxerN14: [
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${logLine1}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${logLine1}\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${tagline1}\n\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`,
        (cht: {value: string}) => `Hi [Name],\n\n${cht.value}\n\nI'm talking about my latest podcast episode, ${title} with my special guest, ${guestName}.\n\n${tagline1}\n\nWe cover:\n${findings}\nHere's where you can listen: [Insert Spotify/Apple/Google player links here]\n\n\n[Your Sign Off]`
      ]
    }
  }
  const getRandomKey = (): string => {
    let keys = ['story', 'quoteB']
    if (intention === 'story') {
      keys = chtKeys?.length ? [...chtKeys, ...keys] : [...keys]
    } else {
      keys = chtKeys?.length ? [...chtKeys, ...keys, 'hook'] : [...keys, 'hook']
    }
    const randomIndex = Math.floor(Math.random() * keys.length | 0)
    let key = keys[randomIndex]
    if (intention === 'story') {
      if (isGuest) {
        key = isPropExists(storyEmailTemplates.guest, key) ? key : 'story'
      } else {
        key = isPropExists(storyEmailTemplates.noGuest, key) ? key : 'story'
      }
    } else {
      if (isGuest) {
        key = isPropExists(strategyEmailTemplates.guest, key) ? key : 'story'
      } else {
        key = isPropExists(strategyEmailTemplates.noGuest, key) ? key : 'story'
      }
    }
    return key
  }
  const key: string = getRandomKey()
  if (chtKeys.includes(key)) {
    const chtPrompt = chtPrompts !== undefined ? chtPrompts[key] : ''
    if (chtPrompt) {
      cht = {
        key,
        value: chtPrompt
      }
    }
  }
  const normalCht = normalize(key, cht)
  const getStrategyEmailTemplate = () => {
    return isGuest ? strategyEmailTemplates.guest[key] : strategyEmailTemplates.noGuest[key]
  }
  const getStoryEmailTemplate = () => {
    return isGuest ? storyEmailTemplates.guest[key] : storyEmailTemplates.noGuest[key]
  }
  const emailTemplateArray = intention === 'story' ? getStoryEmailTemplate() : getStrategyEmailTemplate()
  const randomTemplateIndex = Math.floor(Math.random() * emailTemplateArray.length | 0)
  const template = emailTemplateArray[randomTemplateIndex]({
    value: normalCht
  })
  const cleanTemplate = template.replace(/^\s+|\s+$/gm, '<br/>')
  return { template: cleanTemplate, key, storyBasedTemplateKeys: Object.keys(storyEmailTemplates.noGuest), strategyBasedTemplateKeys: Object.keys(strategyEmailTemplates.noGuest) }
}

function normalize(key: string, cht: { value: string }) {
  const keys = ['rebelN1', 'rebelN2', 'boxerN2', 'boxerN5', 'boxerN6', 'boxerN12']
  return keys.includes(key) ? normalizeCht(cht.value) : cht.value
}
