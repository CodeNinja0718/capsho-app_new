import DialogFileProcessing from 'src/modules/podcast/components/DialogFileProcessing.vue'
import DialogFileProcessingError from 'src/modules/podcast/components/DialogFileProcessingError.vue'
import DialogResolution from 'src/modules/podcast/components/DialogResolution'
import DialogTopicChooser from 'src/modules/podcast/components/DialogTopicChooser.vue'
import axios from 'axios'
import convertToMilliseconds from 'src/utils/convertToMilliseconds'
import type {
  AudioFile,
  CreativeAssetFile,
  CreativeAssetUploaded,
  DropboxFile,
  GoogleDriveFile
} from 'src/models/uploadableFile'
import type { BlogTopics, BlogPost } from 'src/models/blogPost'
import type { Folder } from 'src/models/folders'
import type { IStoreCaptions } from 'src/models/caption'
import type { IStoreEmails } from 'src/models/email'
import type { IStoreShowNotes } from 'src/models/showNotes'
import type { OutputEpisodeDraftsTabs } from 'stores/upload-podcast-state-types'
import { Dialog, Notify, Loading } from 'quasar'
import {
  ChoicesValue,
  EpisodeInterfaceDoc,
  EpisodeInterfaceOpenAI,
  GuestEpisodeDoc,
  PodcastEpisodeDrafts
} from 'src/models/episode'
import { defineStore, UploadPodcastStateProperties } from 'pinia'
import { logtail } from 'boot/logtail'
import { uploadFileToStorage } from 'src/services/firebase/storageService'
import { useAuthStore } from './auth-store'
import { useFolderStore } from 'stores/folder-store'

export const useUploadPodcastStore = defineStore('upload-podcast', {
  state: () => ({
    showGuestDrafts: true,
    topicCG1: '',
    topicCG2: '',
    allCaptions: {} as IStoreCaptions,
    allCaptionsGuest: {} as IStoreCaptions,
    allEmails: {} as IStoreEmails,
    allEmailsGuest: {} as IStoreEmails,
    allShowNotes: {} as IStoreShowNotes,
    audience: '',
    blogPost: {} as BlogPost,
    blogPostCht: '',
    blogTopics: {} as BlogTopics,
    blogTopic: '',
    blogPostType: 'howto',
    blogTemplate: '',
    captionsType: {
      promotion: true,
      engagement: false
    },
    changingTab: false,
    chapterSummary: '',
    cht: {},
    chtCaptions: {},
    chtDescriptions: {},
    chtEmails: {},
    chtKeys: [] as string[],
    chtPrompts: {},
    contentList: [] as Array<ChoicesValue>,
    currentTemplateLayout: {},
    description: '',
    dropboxFile: {} as DropboxFile,
    emailBodyEngagement: '',
    emailBodyPromotion: '',
    emailGuest: {},
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
    guestCreativeAssets: [] as CreativeAssetFile[],
    guestCreativeAssetsUploaded: [] as CreativeAssetUploaded[],
    guestName: '',
    hook: '',
    hookStatement: '',
    hooks: [] as string[],
    hooksRefreshCount: 3,
    intention: '',
    isBlogPostSeoQuestionPicked: false,
    isTopicPicked: false,
    isDropboxLink: false,
    isGoogleDriveLink: false,
    isGuest: false,
    keywords: '',
    laTitle: {} as ChoicesValue,
    laIntro: {} as ChoicesValue,
    laConclusion: {} as ChoicesValue,
    linkedinTemplate: '',
    loading: false,
    logLine: '',
    negativeEmotion: '',
    outputEpisodeTab: 'Title & Description',
    podcastFile: {} as AudioFile,
    podcastId: '',
    podcastName: '',
    podcastURL: '',
    processStep: 'uploadPodcast',
    quoteB: {},
    result: {},
    resources: '',
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
    showContentSnippets: false,
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
    storyCompleter: {},
    storyIdeas: {},
    summary: {},
    summaryHeadings: {},
    summaryDetails: [] as ChoicesValue[],
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
    unsubGuestUserDataListener: {},
    userShouldPickBlogPostSeoQuestion: false,
    withChapterSummaries: false,
    youtubeTemplate: '',
    youtubeTitle: {} as ChoicesValue,
    chts: {},
    keyMoments: {}
  } as UploadPodcastStateProperties),
  actions: {
    toggleNavigationTabs () {
      this.showNavigationTabs = !this.showNavigationTabs
    },
    assignValuesOnEpisodeEdit (data: EpisodeInterfaceOpenAI) {
      this.chts = data.chts || {} as ChoicesValue
      this.keyMoments = data.keyMoments || {} as ChoicesValue
      this.summaryHeadings = data.summaryHeadings || {} as ChoicesValue
      this.summaryDetails = data.summaryDetails || []
      this.chapterSummary = data.chapterSummary || ''
      this.resources = data.resources || ''
      // comes as a string
      this.topic1 = data.topic1
      this.topic2 = data.topic2
      this.hook = data.hook
      this.guestBio = data.guestBio
      this.guestName = data.guestName
      this.quoteB = data.quote || {} as ChoicesValue
      this.hookStatement = data.hookStatement
      this.summary = data.summary || {} as ChoicesValue
      // make them object
      this.title = data.title
      this.story = data.story
      this.intention = data.intention
      this.showNotesDescription = data.showNotesDescription
      this.findings = data.findings
      this.audience = data.audience || ''
      this.logLine = data.logline
      this.tagline1 = data.tagline1
      this.solution = data.solution
      this.ultimateResult = data.result
      this.blogPost = {
        blogConclusion: data.blogConclusion,
        blogDetail1: data.blogDetail1 ?? '',
        blogDetail2: data.blogDetail2 ?? '',
        blogDetail3: data.blogDetail3 ?? '',
        blogIntro: data.blogIntro,
        blogMeetGuest: data.blogMeetGuest ?? '',
        blogPostBody: data.blogPostBody,
        blogSteps: data.blogSteps,
        blogStepsArray: data.blogStepsArray,
        blogStrategyDetail1: data.blogStrategyDetail1 ?? '',
        blogStrategyDetail2: data.blogStrategyDetail2 ?? '',
        blogStrategyDetail3: data.blogStrategyDetail3 ?? '',
        blogTitle: data.blogTitle,
        blogTopicIntro: data.blogTopicIntro,
        blogWhyQuestion: data.blogWhyQuestion ?? '',
        blogWhyQuestionAnswer: data.blogWhyQuestionAnswer ?? '',
        boxerCht: data.boxerCht ?? ''
      }
      this.laTitle = data.laTitle
      this.laIntro = data.laIntro
      this.laConclusion = data.laConclusion
      this.blogTopics = data.blogTopics || {} as BlogTopics
    },
    updatePodcastEpisode (data: object) {
      this.savingPodcast = true
      return this.$fbServices.updateUsersSubCollectionData({ data, id: this.podcastId })
        .catch((err: unknown) => console.error(err))
        .finally(() => (this.savingPodcast = false))
    },
    updateGuestPodcastEpisode (data: object) {
      this.savingPodcast = true
      return Promise.resolve(this.$fbServices.updateGuestSubCollectionData({ data, id: this.podcastId }))
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
      this.allCaptionsGuest = {} as IStoreCaptions
      this.allEmailsGuest = {} as IStoreEmails
      this.emailBodyEngagement = ''
      this.emailBodyPromotion = ''
      this.episodeDraftsProcessingError = false
      this.withChapterSummaries = false
      this.excludeInMin = 0
      this.excludeInSec = 0
      this.excludeIntro = false
      this.podcastFile = {} as AudioFile
      this.dropboxFile = {} as DropboxFile
      this.googleDriveFile = {} as GoogleDriveFile
      this.isDropboxLink = false
      this.isGoogleDriveLink = false
      this.guestName = ''
      this.guestCreativeAssetsUploaded = {} as CreativeAssetUploaded[]
      this.outputEpisodeTab = 'Title & Description'
      this.processStep = 'uploadPodcast'
      this.showNote = ''
      this.userShouldPickBlogPostSeoQuestion = false
    },
    showEpisodeDialog (episode: GuestEpisodeDoc) {
      const authStore = useAuthStore()
      // before assigning clear the current state
      this.clearPersistedData()
      this.selectedEpisode = episode
      this.podcastId = episode.id
      this.transcriptId = episode.transcriptRef
        ? episode.transcriptRef.split('/')[1]
        : ''
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
      this.blogPostType = episode.blogType
      console.log(episode)
      this.description = episode.description
      this.emailBodyPromotion = episode.email.content
      this.emailSubjectLine = episode.email.emailPromoSubject
      this.storyIdeas = episode.email.storyIdeas || {} as ChoicesValue
      this.storyCompleter = episode.email.storyCompleter || {} as ChoicesValue
      this.emailGuest = episode.emailGuest ?? {}
      this.chtEmails = data.email
      this.allCaptions = episode.allCaptions as unknown as IStoreCaptions
      this.allCaptionsGuest = episode.allCaptionsGuest ?? {} as IStoreCaptions
      this.allEmails = episode.allEmails as unknown as IStoreEmails
      this.allEmailsGuest = episode.allEmailsGuest ?? {} as IStoreEmails
      if (episode.guestCreativeAssets && Array.isArray(episode.guestCreativeAssets) && episode.guestCreativeAssets.length) {
        this.guestCreativeAssets = episode.guestCreativeAssets
      }
      this.allShowNotes = episode.allShowNotes ?? {}
      this.chtCaptions = data.caption ? data.caption : { key: '', value: '' }
      this.cht = data.cht
      this.showNote = episode.showNote
      if (!['essentials', 'starter', 'growth'].includes(String(authStore.userCustomClaims.role))) {
        this.blogTemplate = episode.blogPostTemplate || ''
        this.laIntro = data.laIntro || {} as ChoicesValue
        this.laTitle = data.laTitle || {} as ChoicesValue
        this.laConclusion = data.laConclusion || {} as ChoicesValue
        this.linkedinTemplate = episode.linkedinTemplate || ''
        this.youtubeTemplate = episode.youtubeTemplate || ''
      }
      this.isBlogPostSeoQuestionPicked = episode.userPickedBlogPostSeoQuestion ?? false
      this.isTopicPicked = episode.userPickedTopic || false
      this.toggleNavigationTabs()
      this.routeToDraftsEdit('Title & Description')
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
      Loading.show()
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
                content: '',
                emailPromoSubject: {},
                storyCompleter: {},
                storyIdeas: {}
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
              updateCause: 'created document',
              userPickedTopic: false,
              processing: true
            }
            this.$fbServices.addDataToUsersSubCollection({ data })
            Dialog.create({
              component: DialogFileProcessing,
              persistent: true,
              position: 'bottom'
            })
            // await this.$fbServices.listenForHostTranscriptUpdates(this.transcriptId)
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
        .finally(() => {
          Loading.hide()
          this.resetProcessStep()
        })
    },
    async uploadGuestPodcastToStorage () {
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
              email: {
                body: '',
                engagementBody: '',
                promotionBody: '',
                subjectLine: ''
              },
              id: this.podcastId,
              layouts: {
                isDescriptionPicked: false,
                isPodcastWebsiteContentPicked: false,
                isEmailPicked: false,
                isBlogPostPicked: false,
                isLaPicked: false,
                isYtPicked: false
              },
              transcriptionParams: {
                audioUrl: url,
                excludeInMilliseconds,
                excludeInMin: this.excludeInMin,
                excludeInSec: this.excludeInSec,
                excludeIntro: this.excludeIntro,
                withChapterSummaries: this.withChapterSummaries
              },
              transcriptRef: 'transcripts/' + this.transcriptId,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              updateCause: 'created document'
            }
            this.$fbServices.addDataToUsersSubCollection({ data })
            await this.$fbServices.listenForGuestTranscriptUpdates(this.transcriptId)
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
    async fetchGuestStages () {
      // if listener already subscribed then unsubscribe first
      if (typeof this.unsubUsersDataListener === 'function') {
        this.unsubUsersDataListener()
      }
      await this.$fbServices.getGuestSubCollectionData('episodes')
    },
    async createGuestInitialPromoDrafts() {
      this.generatingInitialDrafts = true
      Loading.show()
      try {
        const podcastId = this.podcastId
        const transcriptId = this.transcriptId
        this.topic1List = await this.$guestCloudFunctions.createGuestInitialDraftsOne(
          podcastId,
          transcriptId
        )
        const onOkClick = (topic: string) => {
          this.processStep = 'submitFiles'
          this.topicCG1 = topic
          this.createGuestPromoDrafts()
        }
        Dialog.create({
          component: DialogTopicChooser,
          persistent: true,
          position: 'standard'
        }).onOk((topic) => onOkClick(topic))
      } catch (e) {
        Dialog.create({
          component: DialogFileProcessingError,
          persistent: true,
          position: 'bottom'
        })
      } finally {
        Loading.hide()
        this.generatingInitialDrafts = false
      }
    },
    async createGuestInitialDraftsOne() {
      this.generatingInitialDrafts = true
      Loading.show()
      try {
        const podcastId = this.podcastId
        const transcriptId = this.transcriptId
        this.topic1List = await this.$guestCloudFunctions.createGuestInitialDraftsOne(
          podcastId,
          transcriptId
        )
        const onOkClick = (topic: string) => {
          this.processStep = 'submitFiles'
          this.topicCG1 = topic
          this.createGuestEngagementDrafts()
        }
        Dialog.create({
          component: DialogTopicChooser,
          persistent: true,
          position: 'standard'
        }).onOk((topic) => onOkClick(topic))
      } catch (e) {
        Dialog.create({
          component: DialogFileProcessingError,
          persistent: true,
          position: 'bottom'
        })
      } finally {
        Loading.hide()
        this.generatingInitialDrafts = false
      }
    },
    createGuestEngagementDrafts() {
      this.loading = true
      const context = {
        podcastId: this.podcastId,
        topicCG1: this.topicCG1,
        transcriptId: this.transcriptId
      }
      const data = {
        drafts: {
          topicCG1: this.topicCG1
        }
      }
      const onGuestDraftsDone = () => {
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
        this.router.push({ name: 'PodcastGuestEpisodeDrafts' })
      }
      Loading.show()
      this.updateGuestPodcastEpisode(data)
        .then(() => {
          return this.$guestCloudFunctions.createGuestDrafts({
            ...context
          })
        })
        .then((resp: any) => {
          if (resp && Object.keys(resp)) {
            this.allCaptionsGuest = resp.engCaptionsPlus
            this.allEmailsGuest = resp.engEmailsPlus
            this.topicCG2 = resp.topicCG2
            this.linkedinTemplate = resp.laDrafts.linkedInArticleTemplate
          }
          return resp
        })
        .then((resp) => {
          for (const [key, value] of Object.entries(resp.potentQuotables as object)) {
            if (key !== 'potentQuotablesFirstDrafts') {
              const quoteKey = value.key
              if (quoteKey) {
                this.potentQuotables[quoteKey] = value.value
              } else {
                console.log('Invalid quote key', quoteKey)
              }
            }
          }
        })
        .finally(() => {
          if (!this.episodeDraftsProcessingError) {
            this.episodeDraftsProgress = '100'
            const timer = setTimeout(() => {
              onGuestDraftsDone()
              Loading.hide()
              clearTimeout(timer)
            }, 300)
          }
        })
    },
    createGuestPromoDrafts() {
      Loading.show()
      Promise.allSettled([
        this
          .$guestCloudFunctions
          .createGuestCaptions({
            podcastId: this.podcastId,
            transcriptId: this.transcriptId
          }),
        this
          .$guestCloudFunctions
          .createGuestEmails({
            podcastId: this.podcastId,
            transcriptId: this.transcriptId
          })
      ])
        .then((values: any) => {
          this.allCaptionsGuest = values[0].value as unknown as IStoreCaptions
          this.allEmailsGuest = values[1].value as unknown as IStoreEmails
          this.emailGuest.subjectLine = values[1].value.subjectLine ?? ''
          this.emailGuest.promotionBody = values[1].value.promotionBody ?? ''
        })
        .then(() => {
          this.router.push({
            name: 'OutputEpisodeDrafts',
            query: {
              step: 2
            }
          })
        })
        .catch((err: unknown) => {
          console.error(err)
        })
        .finally(() => {
          Loading.hide()
          this.router.push({
            name: 'OutputEpisodeDrafts',
            query: {
              step: 2
            }
          })
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
        const onOkClick = (topic: string) => {
          this.processStep = 'submitFiles'
          this.topic1 = topic
          this.updatePodcastEpisode({
            drafts: {
              topic1: topic
            }
          })
          this.createEpisodeDrafts()
        }
        Dialog.create({
          component: DialogTopicChooser,
          persistent: true,
          position: 'standard'
        }).onOk((topic) => onOkClick(topic))
        this.generatingInitialDrafts = false
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
      Notify.create({
        message: 'We will process your episode in 10 minutes. You\'ll receive notification when it\'s ready.',
        color: 'accent',
        position: 'top',
        actions: [
          { label: 'Dismiss', color: 'orange-4' }
        ],
        timeout: Math.random() * 5000 + 30000
      })
      this.$cloudFunctions.generateEpisodeDrafts({
        podcastId: validPodcastId,
        transcriptId: this.transcriptId
      })
        .then((data: EpisodeInterfaceOpenAI) => {
          this.assignValuesToState({ ...data })
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
      return true
    },
    createBlogTopics () {
      const authStore = useAuthStore()
      if (['essentials', 'starter', 'growth'].includes(String(authStore.userCustomClaims.role))) {
        return null
      }
      this.isBlogPostSeoQuestionPicked = false
      this.generatingBlogSeoQuestions = true
      Loading.show({
        message: 'Processing...'
      })
      this.$cloudFunctions.generateBlogTopics({
        blogType: this.blogPostType,
        transcriptId: this.transcriptId,
        podcastId: this.podcastId
      })
        .then((response: {value: BlogTopics}) => {
          this.blogTopics = response.value
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
        .finally(() => {
          Loading.hide()
          this.generatingBlogSeoQuestions = false
        })
    },
    createBlogDraftsOne () {
      const authStore = useAuthStore()
      if (['essentials', 'starter', 'growth'].includes(String(authStore.userCustomClaims.role))) {
        return null
      }
      this.generatingBlogPostDrafts = true
      this.showLinkedinArticleSkeleton = true
      this.$cloudFunctions.generateBlogDraftsOne({
        blogType: this.blogPostType,
        blogSeoQuestion: this.blogTopic,
        transcriptId: this.transcriptId,
        podcastId: this.podcastId
      })
        .then((blogDrafts: BlogPost) => {
          if (blogDrafts) {
            this.blogPost = {
              ...blogDrafts
            }
            this.laIntro = blogDrafts.laIntro || {} as ChoicesValue
            this.laTitle = blogDrafts.laTitle || {} as ChoicesValue
            this.laConclusion = blogDrafts.laConclusion || {} as ChoicesValue
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
        blogTopic: this.blogTopic,
        blogType: this.blogPostType
      })
        .then((blogDrafts: BlogPost) => {
          if (blogDrafts) {
            this.blogPost = {
              ...this.blogPost,
              blogConclusion: blogDrafts.blogConclusion,
              blogTitle: blogDrafts.blogTitle
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
    assignEpisodeDrafts (data: EpisodeInterfaceOpenAI) {
      this.episodeDrafts = new PodcastEpisodeDrafts(data)
    },
    clearPersistedData () {
      this.selectedEpisode = {} as EpisodeInterfaceDoc
      this.topic1 = ''
      this.topic2 = ''
      this.hook = ''
      this.quoteB = {} as ChoicesValue
      this.guestBio = ''
      this.guestName = ''
      this.hookStatement = ''
      this.title = {} as ChoicesValue
      this.story = {} as ChoicesValue
      this.findings = {} as ChoicesValue
      this.emailSubjectLine = {} as ChoicesValue
      this.audience = ''
      this.intention = ''
      this.logLine = ''
      this.solution = ''
      this.ultimateResult = ''
      this.tagline1 = ''
      this.emailBodyEngagement = ''
      this.emailBodyPromotion = ''
      this.socialCaption = {} as ChoicesValue
      this.description = ''
      this.chtDescriptions = { key: '', value: '' }
      // comes as an object
      this.cht = { key: '', value: '' }
      this.chtKeys = []
      this.linkedinTemplate = ''
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
      this.allShowNotes = data.allShowNotes || {}
      this.showNote = data.allShowNotes.default ?? ''
      this.showNotesDescription = data.showNotesDescription || ''
      this.topic1 = data.topic1
      this.topic2 = data.topic2 || ''
      this.hook = data.hook
      this.guestBio = data.guestBio
      this.guestName = data.guestName
      this.quoteB = data.quote || {} as ChoicesValue
      this.hookStatement = data.hookStatement
      // making them object
      this.title = data.title
      this.story = data.story
      this.findings = data.findings
      this.emailSubjectLine = data.emailSubject || ''
      this.audience = data.audience ?? ''
      this.intention = data.intention
      this.logLine = data.logLine1 || data.logline || ''
      this.solution = data.solution || ''
      this.summary = data.summary
      this.ultimateResult = data.result
      this.tagline1 = data.tagline1 || ''
      // comes as an object
      this.cht = data.cht || ''
      this.chtKeys = []
      this.chtEmails = data.email
      this.chtCaptions = data.caption
      this.description = ''
      this.socialCaption = {} as ChoicesValue
      this.emailBodyEngagement = ''
      this.emailBodyPromotion = ''
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
      this.outputEpisodeTab = 'Title & Description'
      // this.router.push({ name: 'OutputEpisodeDrafts' })
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
    },
    async addImageToBlock (url: string, episodeId: string) {
      this.image = {
        ...(this.image || { value: '', choices: [] }),
        choices: [...(this.image?.choices || []), url]
      }
      await this.$fbServices.addImageToBlock(this.image, episodeId)
    },
    updateBlogPostSeoQuestion () {
      this.savingPodcast = true
      return this.$fbServices.updateUsersSubCollectionData({
        data: {
          isBlogPostSeoQuestionPicked: this.isBlogPostSeoQuestionPicked,
          blogSeoQuestion: this.blogTopic
        },
        id: this.podcastId
      })
        .catch((err: unknown) => console.error(err))
        .finally(() => (this.savingPodcast = false))
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: sessionStorage,
        paths: [
          'episodes',
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
          'selectedEpisode',
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
          'blogPost',
          'blogSeoQuestion',
          'isBlogPostSeoQuestionPicked',
          'contentList'
        ]
      }
    ]
  }
})
