/* eslint-disable */
import 'pinia'
import type {Unsubscribe} from '@firebase/firestore'
import type {Transcript} from 'src/models/models'
import type {CHTPrompt, EpisodeInterfaceDoc, PodcastEpisodeDrafts} from 'src/models/episode'
import type {RefreshInterface} from 'src/models/refreshModel'
import type {AudioFile, DropboxFile, GoogleDriveFile} from 'src/models/uploadableFile'
import type {BlogPost} from 'src/models/blogPost'
import type {Folder} from 'src/models/folders'
import {ShowNoteOption} from 'src/modules/podcast/components/shownote/makeShowNoteTemplate'
import {IPotentQuotables} from 'src/models/episode'
import type {IStoreCaptions} from 'src/models/caption'
import {IStoreEmails} from 'src/models/email'
import {IStoreShowNotes} from 'src/models/showNotes'

type ProcessStep = 'uploadPodcast' | 'askQuestion' | 'submitFiles' | 'topicChooser'
export type OutputEpisodeDraftsTabs = 'title' | 'showNotes' | 'social' | 'linkedin' | 'tiktok' | 'twitter' | 'email' | 'transcript' | 'blogPost' | 'linkedin_article' | 'youtube'
type EpisodeProcessingProgress = '0' | '20' | '40' | '60' | '80' | '100'

declare module 'pinia' {
  export interface UploadPodcastStateProperties<> {
    $cloudFunctions: any;
    $fbServices: any;
    $router: any;
    allCaptions: IStoreCaptions,
    allEmails: IStoreEmails,
    allShowNotes: IStoreShowNotes,
    audience: string;
    blogPost: BlogPost;
    blogPostCht: string
    blogPostSeoQuestions: string[];
    blogSeoQuestion: string;
    blogTemplate: string;
    captionsType: {
      promotion: boolean,
      engagement: boolean,
      [key:string]: boolean
    },
    captions: {
      twitter: {
        value: RefreshInterface,
        saved: string[]
      },
      linkedin: {
        value: RefreshInterface,
        saved: string[]
      },
      tiktok: {
        value: RefreshInterface,
        saved: string[]
      }
    },
    chtPrompts: {
      [key: string]: string
    };
    cht: CHTPrompt;
    chtCaptions: CHTPrompt;
    chtDescriptions: CHTPrompt;
    chtEmails: CHTPrompt;
    chtKeys: string[];
    description: RefreshInterface;
    dropboxFile: DropboxFile;
    emailBodyEngagement: string;
    emailBodyPromotion: string;
    emailStory: string;
    emailSubjectLine: RefreshInterface;
    episodeDrafts: PodcastEpisodeDrafts;
    episodeDraftsProcessingError: boolean;
    episodeDraftsProgress: EpisodeProcessingProgress;
    episodes: Array<EpisodeInterfaceDoc>;
    excludeInMin: number;
    excludeInSec: number;
    excludeIntro: boolean;
    findings: RefreshInterface;
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
    guestName: string;
    hook: string;
    hookStatement: string;
    hooks: Array<string>;
    hooksRefreshCount: number;
    intention: string;
    isBlogPostSeoQuestionPicked: boolean;
    isDropboxLink: boolean;
    isGoogleDriveLink: boolean;
    isGuest: boolean;
    keywords: string;
    linkedinArticleIntro: string;
    linkedinTemplate: string;
    loading: boolean;
    logLine: string | RefreshInterface;
    negativeEmotion: string;
    outputEpisodeTab: OutputEpisodeDraftsTabs;
    podcastFile: AudioFile;
    podcastId: string;
    podcastName: string;
    podcastURL: string;
    potentQuotables: IPotentQuotables,
    processStep: ProcessStep;
    quoteA: RefreshInterface;
    quoteB: string;
    result: object;
    router: any;
    savingPodcast: boolean;
    selectedEpisode: EpisodeInterfaceDoc;
    selectedFolder: Folder
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
    showNoteOption?: ShowNoteOption;
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
    socialCaption: RefreshInterface;
    socialCaptions: Array<string>;
    solution: string;
    story: RefreshInterface;
    summary?: string;
    tagline1: string;
    title: RefreshInterface;
    topic1: string;
    topic1List: string[];
    topic2: string;
    transcript: Transcript;
    transcriptByTimestamp: boolean;
    transcriptId: string;
    ultimateResult: string;
    unsubEpisodeDocListener: Unsubscribe;
    unsubTranscriptListener: Unsubscribe;
    unsubUsersDataListener: Unsubscribe;
    userShouldPickBlogPostSeoQuestion: boolean;
    withChapterSummaries: boolean;
    youtubeTemplate: string;
  }
}
