/* eslint-disable */
import 'pinia'
import type {Unsubscribe} from '@firebase/firestore'
import type {Transcript} from 'src/models/models'
import type {
  CHTPrompt,
  EpisodeInterfaceDoc,
  PodcastEpisodeDrafts,
  ChoicesValue
} from 'src/models/episode'
import type {
  AudioFile,
  DropboxFile,
  GoogleDriveFile,
  CreativeAssetUploaded,
  CreativeAssetFile
} from 'src/models/uploadableFile'
import type {BlogTopics, BlogPost, BlogPostType} from 'src/models/blogPost'
import type {Folder} from 'src/models/folders'
import type {IPotentQuotables} from 'src/models/episode'
import type {IStoreCaptions} from 'src/models/caption'
import type {IStoreEmails} from 'src/models/email'
import type {IStoreShowNotes} from 'src/models/showNotes'
import {LayoutContent} from "src/models/template";

type ProcessStep = 'uploadPodcast' | 'episodeClipper' | 'episodeDetails' | 'episodeTopic' | 'submitFiles'
export type OutputEpisodeDraftsTabs = 'Title & Description' | 'Podcast Website Content' | 'Transcript' | 'Captions' | 'Facebook/Instagram' | 'LinkedIn' | 'TikTok' | 'Twitter' | 'Email' | 'Blog Post' | 'Blog Post(Listicle)' | 'Blog Post(How to)' | 'Blog Post(Q & A)' | 'LinkedIn Article' | 'YouTube Description' | 'Potent Quotables' | 'Invite' | 'guestAssets'
type EpisodeProcessingProgress = '0' | '20' | '40' | '60' | '80' | '100'

declare module 'pinia' {
  export interface UploadPodcastStateProperties<> {
    chts: ChoicesValue
    keyMoments: ChoicesValue
    showGuestDrafts: boolean
    topicCG1: string
    topicCG2: string
    $cloudFunctions: any;
    $fbServices: any;
    $router: any;
    $guestCloudFunctions: any;
    allCaptions: IStoreCaptions,
    allCaptionsGuest: IStoreCaptions,
    allEmails: IStoreEmails,
    allEmailsGuest: IStoreEmails,
    allShowNotes: IStoreShowNotes,
    audience: string;
    blogPost: BlogPost;
    blogPostCht: string
    blogPostType: BlogPostType;
    blogTopics: BlogTopics;
    blogTopic: string;
    blogTemplate: string;
    captionsType: {
      promotion: boolean,
      engagement: boolean,
      [key:string]: boolean
    },

    changingTab: boolean

    chapterSummary: string;
    chtPrompts: {
      [key: string]: string
    };
    cht: CHTPrompt;
    chtCaptions: CHTPrompt;
    chtDescriptions: CHTPrompt;
    chtEmails: CHTPrompt;
    chtKeys: string[];
    contentList: ChoicesValue[];
    currentTemplateLayout: LayoutContent;
    description: string;
    dropboxFile: DropboxFile;
    emailBodyEngagement: string;
    emailBodyPromotion: string;
    emailGuest: {
      promotionBody: string;
      subjectLine: string;
    }
    emailStory: string;
    emailSubjectLine: ChoicesValue;
    storyIdeas: ChoicesValue;
    storyCompleter: ChoicesValue;
    episodeDrafts: PodcastEpisodeDrafts;
    episodeDraftsProcessingError: boolean;
    episodeDraftsProgress: EpisodeProcessingProgress;
    episodes: Array<EpisodeInterfaceDoc>;
    excludeInMin: number;
    excludeInSec: number;
    excludeIntro: boolean;
    findings: ChoicesValue;
    folder: string;
    generatedCaption: string;
    generatedEmail: string;
    generatingBlogPostDrafts: boolean;
    generatingBlogSeoQuestions: boolean;
    generatingEpisodeDrafts: boolean;
    generatingInitialDrafts: boolean;
    generatingSocialCaptions: boolean;
    googleDriveFile: GoogleDriveFile;
    guestBio: string;
    guestCreativeAssets: CreativeAssetFile[];
    guestCreativeAssetsUploaded: CreativeAssetUploaded[];
    guestName: string;
    hook: string;
    hookStatement: string;
    hooks: Array<string>;
    hooksRefreshCount: number;
    intention: string;
    isBlogPostSeoQuestionPicked: boolean;
    isTopicPicked: boolean;
    isDropboxLink: boolean;
    isGoogleDriveLink: boolean;
    isGuest: boolean;
    keywords: string;
    laTitle: ChoicesValue;
    laIntro: ChoicesValue;
    laConclusion: ChoicesValue;
    linkedinTemplate: string;
    loading: boolean;
    logLine: string | ChoicesValue;
    negativeEmotion: string;
    outputEpisodeTab: OutputEpisodeDraftsTabs;
    podcastFile: AudioFile;
    podcastId: string;
    podcastName: string;
    podcastURL: string;
    potentQuotables: IPotentQuotables,
    processStep: ProcessStep;
    quoteB: ChoicesValue;
    result: object;

    resources: string;
    router: any;
    savingPodcast: boolean;
    selectedEpisode: EpisodeInterfaceDoc;
    selectedFolder: Folder
    showContentSnippets: boolean;
    showData: boolean;
    showDescriptionSkeleton: boolean;
    showDraftsLoading: boolean;
    showEmailBodySkeleton: boolean;
    showEmailSubjectSkeleton: boolean;
    showEpisode: boolean;
    showLinkedinArticleSkeleton: boolean;
    showLinkedinCaptionSkeleton: boolean;
    showNavigationTabs: boolean;
    showNote: string;
    showNotesDescription?: string;
    showNotesSkeleton: boolean;
    showPotentQuotablesSkeleton: boolean;
    showSocialMediaSkeleton: boolean;
    showStepFour: boolean;
    showStepOne: boolean;
    showStepThree: boolean;
    showStepTwo: boolean;
    showTikTokCaptionSkeleton: boolean;
    showTitleSkeleton: boolean;
    showTwitterCaptionSkeleton: boolean;
    showYoutubeDescriptionSkeleton: boolean;
    socialCaption: ChoicesValue;
    socialCaptions: Array<string>;
    solution: string;
    story: ChoicesValue;
    summary?: ChoicesValue;

    summaryHeadings: ChoicesValue;

    summaryDetails: ChoicesValue[];
    tagline1: string;
    title: ChoicesValue;
    topic1: string;
    topic1List: string[];
    topic2: string;
    transcript: Transcript;
    transcriptByTimestamp: boolean;
    transcriptId: string;
    ultimateResult: string;
    youtubeTitle: ChoicesValue;
    // blog-post
    blogListicleTitle: ChoicesValue;
    blogListicleIntroduction: ChoicesValue;
    blogGuestBio: ChoicesValue;
    blogListicleList: ChoicesValue;
    listicleListSubheading: ChoicesValue;
    listicleListDetail: ChoicesValue;
    blogListicleConclusion: ChoicesValue;
    blogCallToAction: ChoicesValue;
    followLinks: ChoicesValue;
    freeText: ChoicesValue;
    blogHowToTitle: ChoicesValue;
    blogHowToIntroduction: ChoicesValue;
    blogHowToTopicIntroduction: ChoicesValue;
    blogHowToSteps: ChoicesValue;
    blogHowToSTepsSubhaeding: ChoicesValue;
    blogHowToStepsSubheading: ChoicesValue;
    blogHowToAddDetails: ChoicesValue;
    blogHowToconclusion: ChoicesValue;
    followingLinks: ChoicesValue;
    blogQATitle: ChoicesValue;
    blogQAIntroduction: ChoicesValue;
    qASubheading: ChoicesValue;
    qAAnswer: ChoicesValue;
    blogQAConclusion: ChoicesValue;
    // linkedin article
    linkedInArticleHowToTitle: ChoicesValue;
    linkedInArticleHowToIntroduction: ChoicesValue;
    linkedInArticleGuestBio: ChoicesValue;
    blogHowToStrategyDetails: ChoicesValue;
    linkedInArticleHowToConclusion: ChoicesValue;
    linkedInArticlecallToAction: ChoicesValue;
    image?: ChoicesValue;
    linkedInArticleQATitle: ChoicesValue;
    linkedInArticleQAIntroduction: ChoicesValue;
    linkedInQAAnswerSummary: ChoicesValue;
    linkedInArticleQAConclusion: ChoicesValue;
    linkedInArticleTitle: ChoicesValue;
    linkedInArticleIntroduction: ChoicesValue;
    topicIntroduction: ChoicesValue;
    linkedInListicleListDetailSummary: ChoicesValue;
    linkedInArticleListicleConclusion: ChoicesValue;
    unsubEpisodeDocListener: Unsubscribe;
    unsubTranscriptListener: Unsubscribe;
    unsubUsersDataListener: Unsubscribe;
    unsubGuestUserDataListener: Unsubscribe;
    userShouldPickBlogPostSeoQuestion: boolean;
    withChapterSummaries: boolean;
    youtubeTemplate: string;
  }
}
