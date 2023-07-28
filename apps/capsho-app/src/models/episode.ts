import { RefreshInterface, RefreshModel } from 'src/models/refreshModel'
import type { BlogBody, BlogPost } from 'src/models/blogPost'
import type { IStoreCaptions } from 'src/models/caption'
import type { IStoreEmails } from 'src/models/email'
import { ShowNoteOption } from 'src/modules/podcast/components/shownote/makeShowNoteTemplate'
import type { IStoreShowNotes } from 'src/models/showNotes'

export interface CHTPrompt {
  key: string,
  value: string
}

export interface EpisodeInterface {
  caption: object
  captions: string[]
  createdAt: Date
  description: object
  displayDate?: string
  email: {
    body: string
    subjectLine: string
  }
  emailBody: object
  emailSubject: string
  findings: string
  guestBio: string
  guestName: string
  hook: string
  hookStatement: string
  id?: string
  quoteA: string
  quoteB: string
  showNote: string
  story: string
  title: string
  topic1: string
  topic2: string
  transcriptRef: string
}

type Intention = 'story' | 'strategy'

export interface EpisodeInterfaceOpenAI extends Partial<BlogPost>{
  allShowNotes: IStoreShowNotes;
  audience?: string
  blogConclusion: string
  blogIntro: string
  blogMeetGuest: string
  blogPostBody?: BlogBody[]
  blogPostTemplate?: string
  blogSteps: string
  blogStepsArray?: string[]
  blogStory: string
  blogStrategyDetail1: string
  blogStrategyDetail2: string
  blogStrategyDetail3: string
  caption: CHTPrompt
  cht: CHTPrompt
  defaultCht?: string
  description: CHTPrompt
  descriptionTemplate?: string
  email: CHTPrompt
  emailSubject: string
  findings: string
  guestBio: string
  guestName: string
  hook: string
  hookStatement: string
  intention: Intention
  linkedinArticleIntro?: string
  linkedinCaption?: string
  logLine1: string
  logLine: string
  quoteA: string
  quoteB: string
  result: string
  showNoteOption?: ShowNoteOption
  showNoteTemplate?: string
  showNotesDescription?: string
  solution: string
  story: string
  summary?: string
  tagline1: string
  tiktokCaption?: string
  title: string
  topic1: string
  topic2: string
  twitterCaption?: string
}

export class PodcastEpisodeDrafts {
  cht: CHTPrompt
  chtCaptions: CHTPrompt
  chtDescriptions: CHTPrompt
  chtEmails: CHTPrompt
  emailSubjectLine: object
  findings: object
  guestBio: string
  guestName: string
  hook: string
  hookStatement: string
  intention: string
  logLine1: string
  logLine: string
  quoteA: object
  quoteB: string
  result: string
  solution: string
  story: object
  tagline1: string
  title: object
  topic1: string
  topic2: string

  constructor (data: EpisodeInterfaceOpenAI) {
    const findings = data
      .findings
      .split(/\n/)
      .reduce((str: string, item: string): string => {
        if (item !== '') str += `${item}<br>`
        return str
      }, '')
    this.cht = data.cht
    this.chtCaptions = data.caption
    this.chtDescriptions = data.description
    this.chtEmails = data.email
    this.emailSubjectLine = new RefreshModel(data.emailSubject)
    this.findings = new RefreshModel(findings)
    this.guestBio = data.guestBio
    this.guestName = data.guestName
    this.hook = data.hook
    this.hookStatement = data.hookStatement
    this.intention = data.intention
    this.logLine = data.logLine
    this.logLine1 = data.logLine1
    this.quoteA = new RefreshModel(data.quoteA)
    this.quoteB = data.quoteB
    this.result = data.result
    this.solution = data.solution
    this.story = new RefreshModel(data.story)
    this.tagline1 = data.tagline1
    this.title = new RefreshModel(data.title)
    this.topic1 = data.topic1
    this.topic2 = data.topic2
  }
}

export interface IPotentQuotables {
  [key:string]: string;
  epiphany: string;
  motivation: string;
  sales: string;
  story: string;
  topic: string;
}

export interface EpisodeInterfaceDoc {
  allCaptions: IStoreCaptions;
  allEmails: IStoreEmails;
  allShowNotes: IStoreShowNotes;
  blogPostTemplate?: string;
  captions: string[];
  createdAt: Date;
  description: string;
  displayDate?: string;
  drafts: EpisodeInterfaceOpenAI;
  email: {
    body: string;
    engagementBody: string;
    promotionBody: string;
    subjectLine: string;
  }
  folder: string;
  id: string;
  isGuest: boolean;
  linkedCaptions?: string[];
  linkedinTemplate?: string;
  potentQuotables?: IPotentQuotables;
  showNote: string;
  showNoteOption?: ShowNoteOption;
  socialCaption?: RefreshInterface;
  tiktokCaptions?: string[];
  title: string;
  transcriptRef: string;
  twitterCaptions?: string[];
  userPickedBlogPostSeoQuestion?: boolean;
  youtubeTemplate?: string;
}

export class Episode {
  blogPostTemplate?: string
  captions: string[]
  createdAt: Date
  description: string
  displayDate?: string
  drafts: EpisodeInterfaceOpenAI
  email: {
    subjectLine: string
    body: string
  }

  folder: string
  id: string
  isGuest: boolean
  linkedCaptions?: string[]
  linkedinTemplate?: string
  potentQuotables?: IPotentQuotables
  showNote: string
  templatesFirstDraft?: object
  tiktokCaptions?: string[]
  title: string
  transcriptRef: string
  twitterCaptions?: string[]
  youtubeTemplate?: string

  constructor (data: EpisodeInterfaceDoc) {
    this.blogPostTemplate = data.blogPostTemplate
    this.captions = data.captions
    this.createdAt = data.createdAt
    this.description = data.description
    this.displayDate = data.displayDate || ''
    this.email = data.email
    this.folder = data.folder
    this.id = data.id
    this.isGuest = data.isGuest
    this.linkedCaptions = data.linkedCaptions
    this.linkedinTemplate = data.linkedinTemplate
    this.potentQuotables = data.potentQuotables
    this.showNote = data.showNote
    this.tiktokCaptions = data.tiktokCaptions
    this.title = data.title
    this.transcriptRef = data.transcriptRef
    this.twitterCaptions = data.twitterCaptions
    this.youtubeTemplate = data.youtubeTemplate
    this.drafts = {
      allShowNotes: data.allShowNotes,
      audience: data.drafts.audience,
      blogConclusion: data.drafts.blogConclusion ?? '',
      blogDetail1: data.drafts.blogDetail1 ?? '',
      blogDetail2: data.drafts.blogDetail2 ?? '',
      blogDetail3: data.drafts.blogDetail3 ?? '',
      blogIntro: data.drafts.blogIntro ?? '',
      blogMeetGuest: data.drafts.blogMeetGuest ?? '',
      blogPostBody: data.drafts.blogPostBody,
      blogSteps: data.drafts.blogSteps ?? '',
      blogStepsArray: data.drafts.blogStepsArray,
      blogStory: data.drafts.blogStory ?? '',
      blogStrategyDetail1: data.drafts.blogStrategyDetail1 ?? '',
      blogStrategyDetail2: data.drafts.blogStrategyDetail2 ?? '',
      blogStrategyDetail3: data.drafts.blogStrategyDetail3 ?? '',
      caption: data.drafts.caption,
      cht: data.drafts.cht,
      defaultCht: data.drafts.defaultCht ?? '',
      description: data.drafts.description,
      email: data.drafts.email,
      emailSubject: data.drafts.emailSubject,
      findings: data.drafts.findings,
      guestBio: data.drafts.guestBio || '',
      guestName: data.drafts.guestName || '',
      hook: data.drafts.hook,
      hookStatement: data.drafts.hookStatement,
      intention: data.drafts.intention,
      linkedinArticleIntro: data.drafts.linkedinArticleIntro,
      linkedinCaption: data.drafts.linkedinCaption ?? '',
      logLine1: data.drafts.logLine1,
      logLine: data.drafts.logLine,
      quoteA: data.drafts.quoteA,
      quoteB: data.drafts.quoteB,
      result: data.drafts.result,
      solution: data.drafts.solution,
      story: data.drafts.story,
      tagline1: data.drafts.tagline1,
      tiktokCaption: data.drafts.tiktokCaption ?? '',
      title: data.drafts.title,
      topic1: data.drafts.topic1,
      topic2: data.drafts.topic2,
      twitterCaption: data.drafts.twitterCaption ?? ''
    }
  }
}
