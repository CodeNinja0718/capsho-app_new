import { defineStore, UploadPodcastStateProperties } from 'pinia'
import { uploadFileToStorage } from 'src/services/firebase/storageService'
import { toRaw } from 'vue'
import { Dialog, Notify } from 'quasar'
import axios from 'axios'
import { EpisodeInterfaceDoc, EpisodeInterfaceOpenAI, PodcastEpisodeDrafts } from 'src/models/episode'
import { RefreshInterface, RefreshModel } from 'src/models/refreshModel'
import type { AudioFile, DropboxFile, GoogleDriveFile } from 'src/models/uploadableFile'
import type { OutputEpisodeDraftsTabs } from 'stores/upload-podcast-state-types'
import type { IStoreCaptions } from 'src/models/caption'
import {
  getRandomDescriptionTemplate
} from 'stores/cht-templates/'
import { logtail } from 'boot/logtail'
import type { BlogPost } from 'src/models/blogPost'
import { useAuthStore } from './auth-store'
import { makeBlogPostTemplate } from 'src/modules/podcast/components/blogpost/makeBlogPostTemplate'
import makeShowNotesTemplate from 'src/modules/podcast/components/shownote/makeShowNoteTemplate'
import { useFolderStore } from 'stores/folder-store'
import type { Folder } from 'src/models/folders'
import { useNotification } from 'src/composables/useNotification'
import { makeLinkedInArticleTemplate } from 'src/modules/podcast/components/linkedin/makeLinkedInArticleTemplate'
import { IYoutubeContext } from 'src/modules/podcast/components/template-interfaces'
import makeYoutubeDescriptionTemplate from 'src/modules/podcast/components/youtube/makeYoutubeDescriptionTemplate'
import DialogFileProcessingError from 'src/modules/podcast/components/DialogFileProcessingError.vue'
import DialogTopicChooser from 'src/modules/podcast/components/DialogTopicChooser.vue'
import normalize from 'stores/cht-templates/normalizer'
import type { IStoreEmails } from 'src/models/email'
import type { IStoreShowNotes } from 'src/models/showNotes'
import { updateShowNotes } from 'src/modules/podcast/components/shownote/updateShowNotes'
import convertToMilliseconds from 'src/utils/convertToMilliseconds'
import DialogResolution from 'src/modules/podcast/components/DialogResolution'

export const useUploadPodcastStore = defineStore('upload-podcast', {
  state: () => ({
    allCaptions: {} as IStoreCaptions,
    allEmails: {} as IStoreEmails,
    allShowNotes: {} as IStoreShowNotes,
    audience: '',
    blogPost: {} as BlogPost,
    blogPostCht: '',
    blogPostSeoQuestions: [] as string[],
    blogSeoQuestion: '',
    blogTemplate: '',
    captions: {
      twitter: {
        value: {} as RefreshInterface,
        saved: [] as string[]
      },
      linkedin: {
        value: {} as RefreshInterface,
        saved: [] as string[]
      },
      tiktok: {
        value: {} as RefreshInterface,
        saved: [] as string[]
      }
    },
    captionsType: {
      promotion: true,
      engagement: false
    },
    cht: {},
    chtCaptions: {},
    chtDescriptions: {},
    chtEmails: {},
    chtKeys: [] as string[],
    chtPrompts: {},
    description: {},
    dropboxFile: {} as DropboxFile,
    emailBodyEngagement: '',
    emailBodyPromotion: '',
    emailStory: '',
    emailSubjectLine: {},
    episodeDrafts: {},
    episodeDraftsProcessingError: false,
    episodeDraftsProgress: '20',
    episodes: [] as object[],
    excludeInMin: 0,
    excludeInSec: 0,
    excludeIntro: false,
    findings: {},
    folder: '',
    generatedCaption: '',
    generatedEmail: '',
    generatingBlogPostDrafts: false,
    generatingBlogSeoQuestions: false,
    generatingInitialDrafts: false,
    generatingSocialCaptions: false,
    googleDriveFile: {} as GoogleDriveFile,
    guestBio: '',
    guestName: '',
    hook: '',
    hookStatement: '',
    hooks: [] as string[],
    hooksRefreshCount: 3,
    intention: '',
    isBlogPostSeoQuestionPicked: false,
    isDropboxLink: false,
    isGoogleDriveLink: false,
    isGuest: false,
    keywords: '',
    linkedinArticleIntro: '',
    linkedinTemplate: '',
    loading: false,
    logLine: '',
    negativeEmotion: '',
    outputEpisodeTab: 'title',
    podcastFile: {} as AudioFile,
    podcastId: '',
    podcastName: '',
    podcastURL: '',
    processStep: 'uploadPodcast',
    quoteA: {},
    quoteB: '',
    result: {},
    potentQuotables: {
      motivation: '',
      story: '',
      sales: '',
      topic: '',
      epiphany: ''
    },
    savingPodcast: false,
    selectedEpisode: {},
    selectedFolder: {} as Folder,
    showData: true,
    showDescriptionSkeleton: false,
    showDraftsLoading: false,
    showEmailBodySkeleton: false,
    showEmailSubjectSkeleton: false,
    showEpisode: false,
    showLinkedinArticleSkeleton: false,
    showLinkedinCaptionSkeleton: false,
    showNavigationTabs: true,
    showNote: '',
    showNoteOption: 'story',
    showNotesDescription: '',
    showNotesSkeleton: false,
    showPotentQuotablesSkeleton: false,
    showSocialMediaSkeleton: false,
    showStepFour: false,
    showStepOne: false,
    showStepThree: false,
    showStepTwo: false,
    showTikTokCaptionSkeleton: false,
    showTitleSkeleton: false,
    showTwitterCaptionSkeleton: false,
    showYoutubeDescriptionSkeleton: false,
    socialCaption: {},
    socialCaptions: [] as string[],
    solution: '',
    story: {},
    summary: '',
    title: {},
    topic1: '',
    topic1List: [] as string[],
    topic2: '',
    transcript: {},
    transcriptByTimestamp: true,
    transcriptId: '',
    ultimateResult: '',
    unsubEpisodeDocListener: {},
    unsubTranscriptListener: {},
    unsubUsersDataListener: {},
    userShouldPickBlogPostSeoQuestion: false,
    withChapterSummaries: false,
    youtubeTemplate: ''
  } as UploadPodcastStateProperties),
  actions: {
    toggleNavigationTabs () {
      this.showNavigationTabs = !this.showNavigationTabs
    },
    assignValuesOnEpisodeEdit (data: EpisodeInterfaceOpenAI) {
      // comes as a string
      this.topic1 = data.topic1
      this.topic2 = data.topic2
      this.hook = data.hook
      this.guestBio = data.guestBio
      this.guestName = data.guestName
      this.quoteB = data.quoteB
      this.hookStatement = data.hookStatement
      this.summary = data.summary
      // make them object
      this.title = new RefreshModel(data.title)
      this.story = new RefreshModel(data.story)
      const findings = data.findings.split(/\n/).reduce((str: string, item: string): string => {
        if (item !== '') str += `${item}<br>`
        return str
      }, '')
      this.intention = data.intention
      this.showNotesDescription = data.showNotesDescription
      this.findings = new RefreshModel(findings)
      this.audience = data.audience || ''
      this.logLine = new RefreshModel(data.logLine1 || data.logLine)
      this.tagline1 = data.tagline1
      this.solution = data.solution
      this.ultimateResult = data.result
      this.blogPost = {
        blogConclusion: data.blogConclusion ?? '',
        blogDetail1: data.blogDetail1 ?? '',
        blogDetail2: data.blogDetail2 ?? '',
        blogDetail3: data.blogDetail3 ?? '',
        blogIntro: data.blogIntro ?? '',
        blogMeetGuest: data.blogMeetGuest ?? '',
        blogPostBody: data.blogPostBody,
        blogSeoQuestion: data.blogSeoQuestion ?? '',
        blogSteps: data.blogSteps ?? '',
        blogStepsArray: data.blogStepsArray,
        blogStrategyDetail1: data.blogStrategyDetail1 ?? '',
        blogStrategyDetail2: data.blogStrategyDetail2 ?? '',
        blogStrategyDetail3: data.blogStrategyDetail3 ?? '',
        blogTitle: data.blogTitle ?? '',
        blogWhyQuestion: data.blogWhyQuestion ?? '',
        blogWhyQuestionAnswer: data.blogWhyQuestionAnswer ?? '',
        boxerCht: data.boxerCht ?? ''
      }
      this.blogPostSeoQuestions = data.blogPostSeoQuestions ?? [] as string[]
    },
    savePodcastEpisode () {
      const validPodcastId = this.podcastId || (this.isDropboxLink ? this.dropboxFile.title
        : this.isGoogleDriveLink ? this.googleDriveFile.title
          : this.podcastFile.id)
      if (!validPodcastId) {
        throw new Error('Podcast file id is missing! Can not save.')
      }
      const data = {
        id: validPodcastId,
        isGuest: this.isGuest,
        title: this.title.value,
        description: this.description.value,
        showNote: this.showNote,
        blogPostTemplate: this.blogTemplate,
        youtubeTemplate: this.youtubeTemplate,
        linkedinTemplate: this.linkedinTemplate,
        email: {
          subjectLine: this.emailSubjectLine.value,
          body: ''
        },
        potentQuotables: {
          ...this.potentQuotables
        },
        folder: this.folder,
        transcriptRef: 'transcripts/' + this.transcriptId,
        drafts: {
          topic1: this.topic1,
          topic2: this.topic2,
          title: this.title.value,
          hook: this.hook,
          story: this.story.value,
          findings: this.findings.value,
          quoteA: this.quoteA.value ?? '',
          quoteB: this.quoteB,
          emailSubject: this.emailSubjectLine.value,
          audience: this.audience,
          hookStatement: this.hookStatement,
          caption: this.chtCaptions,
          linkedinCaption: this.captions.linkedin.value.value ?? '',
          tiktokCaption: this.captions.tiktok.value.value ?? '',
          twitterCaption: this.captions.twitter.value.value ?? '',
          description: this.chtDescriptions,
          email: {},
          ...this.blogPost,
          blogIntro: typeof this.blogPost.blogIntro === 'string' ? this.blogPost.blogIntro : this.blogPost.blogIntro.value
        } as EpisodeInterfaceOpenAI
      }
      if (this.isGuest) {
        data.drafts.guestBio = this.guestBio
        data.drafts.guestName = this.guestName
      }
      this.$fbServices.addDataToUsersSubCollection({ data })
        .catch((err: unknown) => console.error(err))
    },
    partialUpdatePodcastEpisode () {
      const validPodcastId = this.podcastId || (this.isDropboxLink ? this.dropboxFile.title
        : this.isGoogleDriveLink ? this.googleDriveFile.title
          : this.podcastFile.id)
      if (!validPodcastId) {
        throw new Error('Podcast file id is missing! Can not save.')
      }
      const data = {
        id: validPodcastId,
        folder: this.folder,
        description: this.description.value ?? '',
        showNote: this.showNote,
        youtubeTemplate: this.youtubeTemplate ?? '',
        linkedinTemplate: this.linkedinTemplate ?? '',
        drafts: {
          emailSubject: this.emailSubjectLine.value ?? '',
          email: this.chtEmails
        } as EpisodeInterfaceOpenAI
      }
      this.$fbServices.addDataToUsersSubCollection({ data })
        .catch((err: unknown) => console.error(err))
      return null
    },
    updatePodcastEpisode (data: object) {
      this.savingPodcast = true
      return this.$fbServices.checkIfDocumentExist(this.podcastId)
        .then(async (isDocExist: boolean) => {
          if (isDocExist) {
            await Promise.resolve(this.$fbServices.updateUsersSubCollectionData({ data, id: this.podcastId }))
          } else {
            this.savePodcastEpisode()
          }
        })
        .catch((err: unknown) => console.error(err))
        .finally(() => (this.savingPodcast = false))
    },
    async updateTranscript (data: object) {
      this.savingPodcast = true
      await this.$fbServices.updateTranscriptDoc(data)
      if (typeof this.unsubTranscriptListener !== 'function') {
        await this.$fbServices.getTranscription(this.transcriptId)
      }
      this.savingPodcast = false
    },
    resetProcessStep () {
      this.allCaptions = {} as IStoreCaptions
      this.allEmails = {} as IStoreEmails
      this.allShowNotes = {} as IStoreShowNotes
      this.dropboxFile = {} as DropboxFile
      this.emailBodyEngagement = ''
      this.emailBodyPromotion = ''
      this.episodeDraftsProcessingError = false
      this.excludeInMin = 0
      this.excludeInSec = 0
      this.excludeIntro = false
      this.googleDriveFile = {} as GoogleDriveFile
      this.guestName = ''
      this.isDropboxLink = false
      this.isGoogleDriveLink = false
      this.outputEpisodeTab = 'title'
      this.podcastFile = {} as AudioFile
      this.processStep = 'uploadPodcast'
      this.showNote = ''
      this.userShouldPickBlogPostSeoQuestion = false
      this.withChapterSummaries = false
    },
    showEpisodeDialog (episode: EpisodeInterfaceDoc) {
      const authStore = useAuthStore()
      // before assigning clear the current state
      this.clearPersistedData()
      this.selectedEpisode = episode
      this.podcastId = episode.id
      this.transcriptId = episode.transcriptRef.split('/')[1]
      this.isGuest = episode.isGuest
      const data: EpisodeInterfaceOpenAI = {
        ...episode.drafts
      }
      this.assignValuesOnEpisodeEdit(data)
      if (episode.potentQuotables) {
        this.potentQuotables = {
          ...episode.potentQuotables
        }
      }
      this.description = new RefreshModel(episode.description)
      this.chtDescriptions = data.description
      this.emailSubjectLine = new RefreshModel(episode.email.subjectLine)
      this.emailBodyPromotion = episode.email.promotionBody ?? ''
      this.emailBodyEngagement = episode.email.engagementBody ?? ''
      this.chtEmails = data.email
      this.allCaptions = episode.allCaptions as unknown as IStoreCaptions
      this.allEmails = episode.allEmails as unknown as IStoreEmails
      this.allShowNotes = episode.allShowNotes ?? {}
      this.chtCaptions = data.caption ? data.caption : { key: '', value: '' }
      this.cht = data.cht
      this.showNote = episode.showNote
      if (!['essentials', 'starter', 'growth'].includes(String(authStore.userCustomClaims.role))) {
        this.blogTemplate = episode.blogPostTemplate ?? ''
        this.linkedinArticleIntro = (data.linkedinArticleIntro ?? '')
        this.linkedinTemplate = episode.linkedinTemplate ?? ''
        if (!episode.youtubeTemplate) {
          this.buildYoutubeTemplate()
        } else {
          this.youtubeTemplate = episode.youtubeTemplate
        }
      }
      this.isBlogPostSeoQuestionPicked = episode.userPickedBlogPostSeoQuestion ?? false
      this.toggleNavigationTabs()
      this.routeToDraftsEdit('title')
    },
    async fetchDocumentById (podcastId: string) {
      this.showDraftsLoading = true
      this.showData = false
      const data = await this.$fbServices.getEpisodeById(podcastId)
      const timer = setTimeout(() => {
        this.showDraftsLoading = false
        this.showEpisodeDialog({
          ...data,
          id: podcastId
        })
        this.showData = true
        clearTimeout(timer)
      }, 3000)
    },
    hideEpisodeDialog () {
      this.selectedEpisode = {} as EpisodeInterfaceDoc
      this.showEpisode = false
    },
    async fetchPodcastEpisodes () {
      // if listener already subscribed then unsubscribe first
      if (typeof this.unsubUsersDataListener === 'function') {
        this.unsubUsersDataListener()
      }
      await this.$fbServices.getUsersSubCollectionData('episodes')
    },
    async deleteEpisode (id: string) {
      await this.$fbServices.deleteEpisode(id)
    },
    async uploadPodcastToStorage () {
      this.loading = true
      let url: string|undefined
      if (!this.isDropboxLink && !this.isGoogleDriveLink) {
        url = await uploadFileToStorage(this.podcastFile)
      } else if (this.isGoogleDriveLink) {
        url = this.googleDriveFile.link
      } else if (this.isDropboxLink) {
        url = this.dropboxFile.link
      }
      if (!url) {
        throw new Error('Download url is missing!')
      }
      const validPodcastId = this.isDropboxLink ? this.dropboxFile.title
        : this.isGoogleDriveLink ? this.googleDriveFile.title
          : this.podcastFile.id
      if (!validPodcastId) {
        throw new Error('Podcast file id is missing!')
      }
      this.episodeDraftsProgress = '40'
      this.podcastURL = url || ''
      this.podcastId = validPodcastId
      const excludeInMilliseconds = convertToMilliseconds({
        minutes: this.excludeInMin,
        seconds: this.excludeInSec
      })
      this.$fbServices.submitFileForTranscription({
        businessName: this.selectedFolder.businessName,
        excludeIntro: this.excludeIntro,
        guestName: this.guestName,
        hostName: this.selectedFolder.hostName,
        isGuest: this.isGuest,
        podcastId: this.podcastId,
        url,
        withChapterSummaries: this.withChapterSummaries
      })
        .then(async (result: {data: {transcriptId: string}}) => {
          if (result) {
            this.result = result.data
            this.transcriptId = result.data.transcriptId
            const data = {
              businessName: this.selectedFolder.businessName,
              email: {
                body: '',
                engagementBody: '',
                promotionBody: '',
                subjectLine: ''
              },
              folder: this.folder,
              guestName: this.guestName,
              hostName: this.selectedFolder.hostName,
              id: this.podcastId,
              isGuest: this.isGuest,
              transcriptionParams: {
                audioUrl: url,
                excludeInMilliseconds,
                excludeInMin: this.excludeInMin,
                excludeInSec: this.excludeInSec,
                excludeIntro: this.excludeIntro,
                withChapterSummaries: this.withChapterSummaries
              },
              transcriptRef: 'transcripts/' + this.transcriptId,
              updateCause: 'created document'
            }
            this.$fbServices.addDataToUsersSubCollection({ data })
            await this.$fbServices.listenForTranscriptCollectionUpdates(this.transcriptId)
          } else {
            throw new Error('Response is missing from submit transcription!')
          }
        })
        .catch((err: unknown) => {
          Dialog.create({
            component: DialogFileProcessingError,
            persistent: true,
            position: 'bottom'
          })
          if (err instanceof Error) {
            logtail?.error('upload-podcast.ts - uploadPodcastToStorage', {
              message: err.message
            })
          }
        })
    },
    async createInitialDraftsOne () {
      try {
        this.generatingInitialDrafts = true
        this.episodeDraftsProgress = '60'
        // this.processStep = 'topicChooser'
        const podcastId = this.podcastId
        const transcriptId = this.transcriptId
        const response = await this.$cloudFunctions.createInitialDraftsOne(
          podcastId,
          transcriptId
        )
        this.topic1List = response.topics
        this.intention = response.intention
        this.audience = response.audience
        this.solution = response.solution
        Dialog.create({
          component: DialogTopicChooser,
          persistent: true,
          position: 'standard'
        })
        this.generatingInitialDrafts = false
      } catch (e) {
        Dialog.create({
          component: DialogFileProcessingError,
          persistent: true,
          position: 'bottom'
        })
      }
    },
    async createInitialDraftsTwo () {
      try {
        this.generatingInitialDrafts = true
        // this.processStep = 'topicChooser'
        const context = {
          audience: this.audience,
          guestName: this.guestName,
          intention: this.intention,
          isGuest: this.isGuest,
          podcastId: this.podcastId,
          topic1: this.topic1,
          transcriptId: this.transcriptId
        }
        const response = await this.$cloudFunctions.createInitialDraftsTwo(context)
        this.title = response.title
        this.ultimateResult = response.result
        this.findings = response.findings
        this.generatingInitialDrafts = false
        this.createEpisodeDrafts()
        this.createFiveSeoQuestions()
      } catch (e) {
        Dialog.create({
          component: DialogFileProcessingError,
          persistent: true,
          position: 'bottom'
        })
      }
    },
    createEpisodeDrafts () {
      this.generatingEpisodeDrafts = true
      const validPodcastId = this.podcastId
      if (!validPodcastId) {
        throw new Error('Podcast file id is missing!')
      }
      if (!this.transcriptId) {
        throw new Error('Transcript id is missing!')
      }
      this.episodeDraftsProgress = '80'
      this.$cloudFunctions.generateEpisodeDrafts({
        podcastId: validPodcastId,
        transcriptId: this.transcriptId
      })
        .then((data: EpisodeInterfaceOpenAI) => {
          this.assignValuesToState({ ...data })
          this.buildYoutubeTemplate()
          this.createBlogDraftsOne()
          this.generatePotentQuotables()
          this.generateSocialCaptions()
          this.generateEmails()
        })
        .catch((error: unknown) => {
          this.episodeDraftsProcessingError = true
          if (axios.isAxiosError(error)) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              logtail?.error('upload-podcast.ts - createCompletions - response error', {
                data: {
                  ...error.response.data
                },
                status: error.response.status,
                headers: {
                  ...error.response.headers
                }
              })
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              logtail?.error('upload-podcast.ts - createCompletions - request error', {
                request: error.request
              })
            } else {
              Notify.create({
                type: 'warning',
                message: error.message,
                actions: [
                  { label: 'Dismiss', color: 'orange-4' }
                ]
              })
              // Something happened in setting up the request that triggered an Error
              logtail?.error('upload-podcast.ts - createCompletions - request setup error', {
                message: error.request
              })
            }
            logtail?.error('upload-podcast.ts - createCompletions - config error', {
              axiosConfig: JSON.stringify(error.config)
            })
          }
          this.podcastFile = {} as AudioFile
          this.dropboxFile = {} as DropboxFile
          this.googleDriveFile = {} as GoogleDriveFile
          this.isDropboxLink = false
          this.isGoogleDriveLink = false
          Dialog.create({
            component: DialogResolution,
            componentProps: {
              reason: 'EpisodeDrafts'
            },
            persistent: true,
            position: 'bottom'
          })
        })
        .finally(() => {
          if (!this.episodeDraftsProcessingError) {
            this.episodeDraftsProgress = '100'
            const timer = setTimeout(() => {
              this.onLoadingDone()
              clearTimeout(timer)
            }, 300)
          }
        })
    },
    createFiveSeoQuestions () {
      const authStore = useAuthStore()
      if (['essentials', 'starter', 'growth'].includes(String(authStore.userCustomClaims.role))) {
        return null
      }
      this.isBlogPostSeoQuestionPicked = false
      this.generatingBlogSeoQuestions = true
      this.$cloudFunctions.generateFiveSeoQuestions({
        transcriptId: this.transcriptId,
        podcastId: this.podcastId
      })
        .then((response: {value: string[]}) => {
          this.blogPostSeoQuestions = response.value
        })
        .catch(() => {
          Dialog.create({
            component: DialogResolution,
            componentProps: {
              reason: 'SeoQuestions'
            },
            persistent: true,
            position: 'bottom'
          })
        })
        .finally(() => (this.generatingBlogSeoQuestions = false))
    },
    createBlogDraftsOne () {
      const authStore = useAuthStore()
      if (['essentials', 'starter', 'growth'].includes(String(authStore.userCustomClaims.role))) {
        return null
      }
      this.generatingBlogPostDrafts = true
      this.showLinkedinArticleSkeleton = true
      this.$cloudFunctions.generateBlogDraftsOne({
        transcriptId: this.transcriptId,
        podcastId: this.podcastId
      })
        .then((blogDrafts: BlogPost) => {
          if (blogDrafts) {
            this.blogPost = {
              ...blogDrafts
            }
            if (blogDrafts.linkedInIntro) {
              this.linkedinArticleIntro = blogDrafts.linkedInIntro
            }
          } else {
            console.error('blog post drafts are empty')
          }
        })
        .catch((err: unknown) => {
          Dialog.create({
            component: DialogResolution,
            componentProps: {
              reason: 'BlogDraftsOne'
            },
            persistent: true,
            position: 'bottom'
          })
          if (err instanceof Error) {
            throw new Error(err.message)
          }
        })
        .finally(() => {
          this.generatingBlogPostDrafts = false
          this.showLinkedinArticleSkeleton = false
        })
    },
    createBlogDraftsTwo () {
      const authStore = useAuthStore()
      if (['essentials', 'starter', 'growth'].includes(String(authStore.userCustomClaims.role))) {
        return null
      }
      this.generatingBlogPostDrafts = true
      this.$cloudFunctions.generateBlogDraftsTwo({
        transcriptId: this.transcriptId,
        podcastId: this.podcastId,
        blogSeoQuestion: this.blogSeoQuestion
      })
        .then((blogDrafts: BlogPost) => {
          if (blogDrafts) {
            this.blogPost = {
              ...this.blogPost,
              blogIntro: blogDrafts.blogIntro,
              boxerCht: blogDrafts.boxerCht,
              blogConclusion: blogDrafts.blogConclusion,
              blogTitle: blogDrafts.blogTitle,
              blogSeoQuestion: blogDrafts.blogSeoQuestion,
              blogWhyQuestion: blogDrafts.blogWhyQuestion,
              blogWhyQuestionAnswer: blogDrafts.blogWhyQuestionAnswer
            }
            if (blogDrafts.blogPostTemplate) {
              this.blogTemplate = blogDrafts.blogPostTemplate
            } else {
              this.blogTemplate = makeBlogPostTemplate({
                isGuest: this.isGuest,
                blogPostData: {
                  ...this.blogPost
                },
                result: this.ultimateResult,
                solution: this.solution
              })
            }
          } else {
            console.error('blog post drafts are empty')
          }
        })
        .then(() => {
          this.generateSocialCaptionsPlus()
          this.generateEmailsPlus()
        })
        .catch((err: unknown) => {
          Dialog.create({
            component: DialogResolution,
            componentProps: {
              reason: 'BlogDraftsTwo'
            },
            persistent: true,
            position: 'bottom'
          })
          if (err instanceof Error) {
            throw new Error(err.message)
          }
        })
        .finally(() => {
          this.generatingBlogPostDrafts = false
        })
    },
    generateSocialCaptions() {
      const authStore = useAuthStore()
      if (String(authStore.userCustomClaims.role) === 'starter') {
        return null
      }
      this.showSocialMediaSkeleton = true
      this.$cloudFunctions.createCaptions({
        podcastId: this.podcastId,
        transcriptId: this.transcriptId
      })
        .then((response: IStoreCaptions) => {
          this.allCaptions = response
        })
        .catch(() => {
          Dialog.create({
            component: DialogResolution,
            componentProps: {
              reason: 'Captions'
            },
            persistent: true,
            position: 'bottom'
          })
        })
        .finally(() => {
          this.showSocialMediaSkeleton = false
        })
    },
    generateSocialCaptionsPlus() {
      const authStore = useAuthStore()
      const role = String(authStore.userCustomClaims.role)
      if (['starter', 'growth'].includes(role)) {
        return null
      }
      this.showSocialMediaSkeleton = true
      this.$cloudFunctions.createCaptionsPlus({
        podcastId: this.podcastId,
        transcriptId: this.transcriptId
      })
        .then((response: IStoreCaptions) => {
          this.allCaptions = response
        })
        .catch(() => {
          Dialog.create({
            component: DialogResolution,
            componentProps: {
              reason: 'CaptionsPlus'
            },
            persistent: true,
            position: 'bottom'
          })
        })
        .finally(() => {
          this.showSocialMediaSkeleton = false
        })
    },
    generateEmails() {
      const authStore = useAuthStore()
      if (String(authStore.userCustomClaims.role) === 'starter') {
        return null
      }
      this.showEmailBodySkeleton = true
      this.$cloudFunctions.createEmails({
        podcastId: this.podcastId,
        transcriptId: this.transcriptId
      })
        .then((response: IStoreEmails) => {
          this.allEmails = response
          this.emailBodyEngagement = response.engagementBody
          this.emailBodyPromotion = response.promotionBody
        })
        .catch(() => {
          Dialog.create({
            component: DialogResolution,
            componentProps: {
              reason: 'Emails'
            },
            persistent: true,
            position: 'bottom'
          })
        })
        .finally(() => {
          this.showEmailBodySkeleton = false
        })
    },
    generateEmailsPlus() {
      const authStore = useAuthStore()
      const role = String(authStore.userCustomClaims.role)
      if (['starter', 'growth'].includes(role)) {
        return null
      }
      this.showEmailBodySkeleton = true
      this.$cloudFunctions.createEmailsPlus({
        podcastId: this.podcastId,
        transcriptId: this.transcriptId
      })
        .then((response: IStoreEmails) => {
          this.allEmails = response
        })
        .catch(() => {
          Dialog.create({
            component: DialogResolution,
            componentProps: {
              reason: 'EmailsPlus'
            },
            persistent: true,
            position: 'bottom'
          })
        })
        .finally(() => {
          this.showEmailBodySkeleton = false
        })
    },
    buildLinkedInArticleTemplate(blogPostData: BlogPost) {
      this.showLinkedinArticleSkeleton = true
      const context = {
        articleIntro: this.linkedinArticleIntro,
        isGuest: this.isGuest,
        title: this.title.value,
        result: this.ultimateResult,
        podcastName: this.podcastName,
        blogPostData
      }
      this.linkedinTemplate = makeLinkedInArticleTemplate(context)
      const data = Object.freeze({
        linkedinTemplate: this.linkedinTemplate,
        templatesFirstDraft: {
          linkedIn: this.linkedinTemplate
        }
      })
      this.updatePodcastEpisode(data)
        .finally(() => {
          const timer = setTimeout(() => {
            this.showLinkedinArticleSkeleton = false
            clearTimeout(timer)
          }, 1500)
        })
    },
    generatePotentQuotables() {
      const authStore = useAuthStore()
      if (['essentials', 'starter', 'growth'].includes(authStore.userCustomClaims.role as string)) {
        return null
      }
      const context = {
        transcriptId: this.transcriptId,
        podcastId: this.podcastId
      }
      this.showPotentQuotablesSkeleton = true
      this.$cloudFunctions.createPotentQuotables(context)
        .then((potentQuotables: object) => {
          let firstDrafts = null
          for (const [key, value] of Object.entries(potentQuotables)) {
            if (key === 'potentQuotablesFirstDrafts') {
              firstDrafts = value
            } else {
              const quoteKey = value.key
              this.potentQuotables[quoteKey] = value.value
            }
          }
          const docData = {
            potentQuotables: {
              motivation: this.potentQuotables.motivation,
              sales: this.potentQuotables.sales,
              story: this.potentQuotables.story,
              epiphany: this.potentQuotables.epiphany,
              topic: this.potentQuotables.topic
            },
            templatesFirstDraft: {
              potentQuotables: {
                motivation: firstDrafts.motivation,
                sales: firstDrafts.sales,
                story: firstDrafts.story,
                epiphany: firstDrafts.epiphany,
                topic: firstDrafts.topic
              }
            }
          }
          Promise.resolve(this.updatePodcastEpisode(docData))
        })
        .catch(() => {
          Dialog.create({
            component: DialogResolution,
            componentProps: {
              reason: 'PotentQuotables'
            },
            persistent: true,
            position: 'bottom'
          })
        })
        .finally(() => (this.showPotentQuotablesSkeleton = false))
    },
    assignEpisodeDrafts (data: EpisodeInterfaceOpenAI) {
      this.episodeDrafts = new PodcastEpisodeDrafts(data)
    },
    clearPersistedData () {
      this.selectedEpisode = {} as EpisodeInterfaceDoc
      this.topic1 = ''
      this.topic2 = ''
      this.hook = ''
      this.quoteB = ''
      this.guestBio = ''
      this.guestName = ''
      this.hookStatement = ''
      this.title = {} as RefreshInterface
      this.story = {} as RefreshInterface
      this.findings = {} as RefreshInterface
      this.emailSubjectLine = {} as RefreshInterface
      this.audience = ''
      this.intention = ''
      this.logLine = ''
      this.solution = ''
      this.ultimateResult = ''
      this.tagline1 = ''
      this.emailBodyEngagement = ''
      this.emailBodyPromotion = ''
      this.socialCaption = {} as RefreshInterface
      this.description = {} as RefreshInterface
      this.chtDescriptions = { key: '', value: '' }
      // comes as an object
      this.cht = { key: '', value: '' }
      this.chtKeys = []
      this.linkedinTemplate = ''
      // this.linkedinArticleIntro = ''
      this.captions = {
        twitter: {
          value: {} as RefreshInterface,
          saved: [] as string[]
        },
        tiktok: {
          value: {} as RefreshInterface,
          saved: [] as string[]
        },
        linkedin: {
          value: {} as RefreshInterface,
          saved: [] as string[]
        }
      }
      this.allCaptions = {} as IStoreCaptions
      this.blogTemplate = ''
      this.blogPost = {} as BlogPost
      this.isBlogPostSeoQuestionPicked = false
      // this.youtubeTemplate = ''
      this.showNote = ''
    },
    assignValuesToState (data: EpisodeInterfaceOpenAI) {
      // before assigning clear the current state
      this.clearPersistedData()
      // comes as a string
      this.allShowNotes = data.allShowNotes
      this.showNote = data.allShowNotes.default ?? ''
      this.showNotesDescription = data.showNotesDescription
      this.topic1 = data.topic1
      this.topic2 = data.topic2
      this.hook = data.hook
      this.guestBio = data.guestBio
      this.guestName = data.guestName
      this.quoteB = data.quoteB
      this.hookStatement = data.hookStatement
      // making them object
      this.title = new RefreshModel(data.title)
      this.story = new RefreshModel(data.story)
      const findings = normalize(data.findings)
      this.findings = new RefreshModel(findings)
      this.emailSubjectLine = new RefreshModel(data.emailSubject)
      this.audience = data.audience ?? ''
      this.intention = data.intention
      this.logLine = data.logLine1
      this.solution = data.solution
      this.summary = data.summary
      this.ultimateResult = data.result
      this.tagline1 = data.tagline1
      // comes as an object
      this.cht = data.cht
      this.chtKeys = []
      this.chtDescriptions = data.description
      this.chtEmails = data.email
      this.chtCaptions = data.caption
      this.description = {} as RefreshInterface
      this.socialCaption = {} as RefreshInterface
      this.emailBodyEngagement = ''
      this.emailBodyPromotion = ''
      if (data.descriptionTemplate) {
        this.description = new RefreshModel(data.descriptionTemplate)
      } else {
        this.showDescriptionSkeleton = true
        this.showTitleSkeleton = true
        this.refreshDescription()
        const timer = setTimeout(() => {
          this.showDescriptionSkeleton = false
          this.showTitleSkeleton = false
          clearTimeout(timer)
        }, 1300)
      }
    },
    onLoadingDone () {
      this.loading = false
      this.episodeDraftsProgress = '20'
      Notify.create({
        color: 'accent',
        position: 'top',
        icon: 'task_alt',
        message: `Woohoo! The drafts for your episode, ${this.podcastId}, are ready. Check ‘em out!`,
        actions: [
          { label: 'Dismiss', color: 'orange-4' }
        ],
        timeout: Math.random() * 5000 + 30000
      })
      this.processStep = 'uploadPodcast'
      this.outputEpisodeTab = 'title'
      this.router.push({ name: 'OutputEpisodeDrafts' })
    },
    async refreshTitle () {
      const { triggerWarning } = useNotification()
      if (this.title.isRefreshAllowed) {
        this.showTitleSkeleton = true
        const title = await this.$cloudFunctions.createTitle(
          this.transcriptId,
          this.isGuest,
          this.guestName
        )
        this.title.updateValue(title.getTitle())
        this.showTitleSkeleton = false
      } else {
        triggerWarning('You have reached max refresh limit!')
      }
    },
    async refreshEmailSubjectLine () {
      const { triggerWarning } = useNotification()
      if (this.emailSubjectLine.isRefreshAllowed) {
        this.showEmailSubjectSkeleton = true
        const emailSubjectLine = await this.$cloudFunctions.generateEmailSubject({
          story: this.story.value,
          findings: this.findings.value,
          topic: this.topic1
        })
        this.emailSubjectLine.updateValue(emailSubjectLine.getEmailSubjectLine())
        this.showEmailSubjectSkeleton = false
      } else {
        triggerWarning('You have reached max refresh limit!')
      }
    },
    refreshDescription () {
      const { triggerWarning } = useNotification()
      if (this.description.isRefreshAllowed) {
        this.showDescriptionSkeleton = true
        const params = {
          transcriptId: this.transcriptId,
          podcastId: this.podcastId
        }
        this.$cloudFunctions.createRandomDescription(params)
          .then((data: { template: string, cht: { key: string, value: string } }) => {
            this.chtDescriptions = data.cht
            this.cht = data.cht
            if (this.description instanceof RefreshModel) {
              this.description.updateValue(data.template)
            } else {
              this.description = new RefreshModel(data.template)
            }
            this.showDescriptionSkeleton = false
          })
          .catch(() => {
            this.getPrevDescriptionValue()
          })
      } else {
        triggerWarning('You have reached max refresh limit!')
      }
    },
    getPrevDescriptionValue () {
      this.showDescriptionSkeleton = true
      this.description.getPrevValue()
      const timer = setTimeout(() => {
        this.showDescriptionSkeleton = false
        clearTimeout(timer)
      }, 400)
    },
    getDescription (): void {
      this.chtKeys.push(this.cht.key)
      this.chtPrompts[this.cht.key] = this.cht.value
      const randomDescriptionTemplate = getRandomDescriptionTemplate({
        topic2: this.topic2,
        hook: this.hook,
        hookStatement: this.hookStatement,
        findings: this.findings.value,
        logLine1: typeof this.logLine === 'string' ? this.logLine : this.logLine.value,
        tagline1: this.tagline1,
        latestCht: toRaw(this.cht),
        intention: this.intention
      })
      if (this.description instanceof RefreshModel) {
        this.description.updateValue(randomDescriptionTemplate.template)
      } else {
        this.description = new RefreshModel(randomDescriptionTemplate.template)
      }
    },
    async refreshStory () {
      const { triggerWarning } = useNotification()
      if (this.story.isRefreshAllowed) {
        this.showNotesSkeleton = true
        const payload = {
          transcriptId: this.transcriptId,
          isGuest: this.isGuest,
          guestName: this.guestName
        }
        const data = await this.$cloudFunctions.generateStory(payload)
        this.story.updateValue(data.story)
        this.getShowNotesTemplate()
        this.showNotesSkeleton = false
      } else {
        triggerWarning('You have reached max refresh limit!')
      }
    },
    getPrevStoryValue () {
      this.story.getPrevValue()
      this.getShowNotesTemplate()
    },
    async refreshFindings () {
      const { triggerWarning } = useNotification()
      if (this.findings.isRefreshAllowed) {
        this.showNotesSkeleton = true
        const payload = {
          transcriptId: this.transcriptId,
          isGuest: this.isGuest,
          guestName: this.guestName
        }
        const data = await this.$cloudFunctions.generateFindings(payload)
        this.findings.updateValue(data.findings)
        this.getShowNotesTemplate()
        this.showNotesSkeleton = false
      } else {
        triggerWarning('You have reached max refresh limit!')
      }
    },
    getPrevFindingValue() {
      this.findings.getPrevValue()
      this.getShowNotesTemplate()
    },
    buildYoutubeTemplate () {
      this.showYoutubeDescriptionSkeleton = true
      const context: IYoutubeContext = {
        logLine1: this.logLine,
        value: normalize(this.findings.value),
        isGuest: this.isGuest,
        folderLinks: this.selectedFolder
      }
      this.youtubeTemplate = makeYoutubeDescriptionTemplate(context)
      const timer = setTimeout(() => {
        this.showYoutubeDescriptionSkeleton = false
        clearTimeout(timer)
      }, 1000)
    },
    updateShowNotesTemplates() {
      this.showNotesSkeleton = true
      try {
        const description = this.description instanceof RefreshModel
          ? this.description.value : ''
        if (this.allShowNotes && Object.keys(this.allShowNotes).length) {
          this.allShowNotes = {
            story: updateShowNotes({
              description,
              showNote: this.allShowNotes.story ?? ''
            }),
            summary: updateShowNotes({
              description,
              showNote: this.allShowNotes.summary ?? ''
            })
          }
          this.showNote = this.isGuest
            ? this.allShowNotes.story
            : this.allShowNotes.summary
        }
      } catch (err) {
        console.error(err)
      } finally {
        const timer = setTimeout(() => {
          this.showNotesSkeleton = false
          clearTimeout(timer)
        }, 400)
      }
    },
    getShowNotesTemplate () {
      this.showNotesSkeleton = true
      const description = this.description instanceof RefreshModel
        ? this.description.value : ''
      this.allShowNotes = {
        story: makeShowNotesTemplate({
          description,
          quoteB: this.quoteB,
          summary: this.summary,
          showNoteOption: 'story',
          guestName: this.guestName,
          story: this.story.value,
          guestBio: this.guestBio,
          value: [...this.findings.value].join(''),
          isGuest: this.isGuest,
          folderLinks: this.selectedFolder
        }),
        summary: makeShowNotesTemplate({
          description,
          quoteB: this.quoteB,
          summary: this.summary,
          showNoteOption: 'summary',
          guestName: this.guestName,
          story: this.story.value,
          guestBio: this.guestBio,
          value: [...this.findings.value].join(''),
          isGuest: this.isGuest,
          folderLinks: this.selectedFolder
        })
      }
      const timer = setTimeout(() => {
        this.showNotesSkeleton = false
        clearTimeout(timer)
      }, 400)
    },
    routeToDraftsEdit (tabName: OutputEpisodeDraftsTabs) {
      const folderStore = useFolderStore()
      this.$fbServices.getFolderById(folderStore.selectedFolderId)
        .then((folder: Folder) => {
          this.selectedFolder = folder
        })
      this.outputEpisodeTab = tabName
      this.showEpisode = false
      this.showNavigationTabs = false
      this.podcastId = this.selectedEpisode.id
      this.router.push({
        name: 'OutputEpisodeDrafts',
        query: {
          folder: folderStore.selectedFolderId,
          episode: this.podcastId
        }
      })
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: sessionStorage,
        paths: [
          'potentQuotables',
          'podcastFile',
          'podcastURL',
          'podcastId',
          'transcript',
          'transcriptId',
          'showNote',
          'podcastId',
          'transcriptId',
          'isGuest',
          'description',
          'chtDescriptions',
          'emailSubjectLine',
          'emailBody',
          'chtEmails',
          'socialCaption',
          'chtCaptions',
          'cht',
          'captions',
          'showNote',
          'blogTemplate',
          'linkedinArticleIntro',
          'linkedinTemplate',
          'youtubeTemplate',
          'topic1',
          'topic2',
          'hook',
          'guestBio',
          'guestName',
          'quoteB',
          'hookStatement',
          'title',
          'story',
          'findings',
          'intention',
          'chtPrompts',
          'audience',
          'logLine',
          'tagline1',
          'solution',
          'ultimateResult',
          'blogPost'
        ]
      }
    ]
  }
})
