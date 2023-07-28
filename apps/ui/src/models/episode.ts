import { RefreshInterface } from 'src/models/refreshModel'
import type { BlogBody, BlogPost, BlogPostType } from 'src/models/blogPost'
import type { IStoreCaptions } from 'src/models/caption'
import type { IStoreEmails } from 'src/models/email'
import type { IStoreShowNotes } from 'src/models/showNotes'
import type { CreativeAssetFile } from 'src/models/uploadableFile'
export interface CHTPrompt {
  key: string,
  value: string
}

export type ChoicesValue = {
  value: string; // no need related to tiptap drag and drop function
  choices: string[];
  label?: string;
}

export interface PickedLayouts {
  isDescriptionPicked: boolean;
  isPodcastWebsiteContentPicked: boolean;
  isEmailPicked: boolean;
  isBlogPostPicked: boolean;
  isLaPicked: boolean;
  isYtPicked: boolean;
}

type Intention = 'story' | 'strategy'

export interface EpisodeInterfaceOpenAI extends Partial<BlogPost>{
  allShowNotes: IStoreShowNotes;
  audience?: string
  blogConclusion: ChoicesValue
  blogIntro: ChoicesValue
  blogMeetGuest: string
  blogPostBody?: BlogBody[]
  blogPostTemplate?: string
  blogSteps: ChoicesValue
  blogStepsArray?: string[]
  blogStory: string
  blogStrategyDetail1: string
  blogStrategyDetail2: string
  blogStrategyDetail3: string
  caption: CHTPrompt

  chapterSummary?: string
  cht: CHTPrompt
  chts?: ChoicesValue
  keyMoments?: ChoicesValue
  defaultCht?: string
  description: string
  descriptionTemplate?: string
  email: CHTPrompt
  emailSubject: ChoicesValue
  findings: ChoicesValue
  guestBio: string
  guestName: string
  hook: string
  hookStatement: string
  intention: Intention
  laTitle: ChoicesValue;
  laIntro: ChoicesValue;
  laConclusion: ChoicesValue;
  linkedinCaption?: string
  logLine1: string
  logline: string
  quoteA: string
  quoteB: string
  quote?: ChoicesValue
  result: string
  resources?: string
  summaryHeadings?: ChoicesValue
  summaryDetails?: ChoicesValue[]
  showNoteTemplate?: string
  showNotesDescription?: string
  solution: string
  story: ChoicesValue
  summary?: ChoicesValue
  tagline1: string
  tiktokCaption?: string
  title: ChoicesValue
  topic1: string
  topic2: string
  topics: string[]
  twitterCaption?: string
}

export class PodcastEpisodeDrafts {
  cht: CHTPrompt
  chtCaptions: CHTPrompt
  chtEmails: CHTPrompt
  emailSubjectLine: ChoicesValue
  findings: object
  guestBio: string
  guestName: string
  hook: string
  hookStatement: string
  intention: string
  logLine1: string
  logLine: string
  quoteB: string
  result: string
  solution: string
  story: object
  tagline1: string
  title: object
  topic1: string
  topic2: string

  constructor (data: EpisodeInterfaceOpenAI) {
    this.cht = data.cht
    this.chtCaptions = data.caption
    this.chtEmails = data.email
    this.emailSubjectLine = data.emailSubject
    this.findings = data.findings
    this.guestBio = data.guestBio
    this.guestName = data.guestName
    this.hook = data.hook
    this.hookStatement = data.hookStatement
    this.intention = data.intention
    this.logLine = data.logline
    this.logLine1 = data.logLine1
    this.quoteB = data.quoteB
    this.result = data.result
    this.solution = data.solution
    this.story = data.story
    this.tagline1 = data.tagline1
    this.title = data.title
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
  allCaptionsGuest?: IStoreCaptions;
  allEmails: IStoreEmails;
  allEmailsGuest?: IStoreEmails;
  allShowNotes: IStoreShowNotes;
  blogPostTemplate?: string;
  blogType: BlogPostType;
  captions: string[];
  created: number;
  createdAt: Date;
  description: string;
  displayDate?: string;
  drafts: EpisodeInterfaceOpenAI;
  email: {
    content: string;
    emailPromoSubject: ChoicesValue;
    storyCompleter: ChoicesValue;
    storyIdeas: ChoicesValue;
  }

  emailGuest: {
    engagementBody: string;
    promotionBody: string;
    subjectLine: string;
  }
  folder: string;
  id: string;
  isGuest: boolean;

  layouts: PickedLayouts;
  linkedCaptions?: string[];
  linkedinTemplate?: string;
  potentQuotables?: IPotentQuotables;
  processing: boolean;
  showNote: string;
  socialCaption?: RefreshInterface;
  tiktokCaptions?: string[];
  title: string;
  transcriptRef: string;
  twitterCaptions?: string[];
  userPickedBlogPostSeoQuestion?: boolean;
  userPickedTopic?: boolean;
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
    content: string
    emailPromoSubject: ChoicesValue;
    storyCompleter: ChoicesValue;
    storyIdeas: ChoicesValue;
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
      blogTopicIntro: data.drafts.blogTopicIntro,
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
      laIntro: data.drafts.laIntro,
      laTitle: data.drafts.laTitle,
      laConclusion: data.drafts.laConclusion,
      linkedinCaption: data.drafts.linkedinCaption ?? '',
      logLine1: data.drafts.logLine1,
      logline: data.drafts.logline,
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
      topics: data.drafts.topics,
      twitterCaption: data.drafts.twitterCaption ?? ''
    }
  }
}

export interface GuestEpisodeDoc extends EpisodeInterfaceDoc {
  podcastId?: string
  transcriptId?: string
  guestCreativeAssets?: CreativeAssetFile[]
}
