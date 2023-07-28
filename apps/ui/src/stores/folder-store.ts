import { defineStore, FolderStateProperties } from 'pinia'
import type { Folder } from 'src/models/folders'
import type { Unsubscribe } from '@firebase/firestore'
import { useUploadPodcastStore } from './upload-podcast'
import { ISocialPrefix } from 'stores/folder-state-types'
import upperFirst from 'src/helpers/upper-first-char'

export const useFolderStore = defineStore('folder-store', {
  state: () => ({
    businessName: '',
    comments: '',
    documents: [] as Folder[],
    editFolder: false,
    email: '',
    facebookLink: '',
    folderFile: {},
    folderFileUrl: '',
    foldersListener: {} as Unsubscribe,
    hostName: '',
    id: '',
    instagramLink: '',
    linkedinLink: '',
    order: 0,
    podcastLink: '',
    podcastName: '',
    saving: false,
    selectedFolder: {} as Folder,
    selectedFolderId: '',
    socialLinksPrefix: {
      facebook: 'https://www.facebook.com/',
      instagram: 'https://www.instagram.com/',
      linkedin: 'https://www.linkedin.com/',
      tiktok: 'https://www.tiktok.com/',
      twitter: 'https://www.twitter.com/',
      youtube: 'https://www.youtube.com/'
    } as ISocialPrefix,
    twitterLink: '',
    websiteLink: '',
    youtubeLink: ''
  } as FolderStateProperties),
  actions: {
    getAllDocuments() {
      if (typeof this.foldersListener !== 'function') {
        Promise.resolve(this.$fbServices.listAllDocuments())
      }
    },
    populateData(document: Folder) {
      this.selectedFolder = {
        ...document,
        businessName: upperFirst(document.businessName),
        hostName: upperFirst(document.hostName),
        podcastName: upperFirst(document.podcastName),
        facebookLink: normalize(document.facebookLink),
        instagramLink: normalize(document.instagramLink),
        linkedinLink: normalize(document.linkedinLink),
        twitterLink: normalize(document.twitterLink),
        youtubeLink: normalize(document.youtubeLink)
      }
      function normalize(link: string) {
        let normalLink: string = link
        const pattern = /https:\/\/www.+.com\//gm
        if (pattern.test(link)) {
          const result = link.split(pattern)
          normalLink = result[1]
        }
        return normalLink
      }
    },
    async editDocumentToFolder() {
      const data = {
        ...this.selectedFolder
      }
      await this.$fbServices.editFolderDocument(data)
      this.partialStoreReset()
    },
    sortDocumentToFolder() {
      for (let i = 0; i < this.documents.length; i++) {
        if (this.documents[i].id && this.documents[i].id !== 'default') {
          this.documents[i].order = i
          Promise.resolve(this.$fbServices.editFolderDocument(this.documents[i]))
        }
      }
    },
    async deleteDocument(id: string) {
      await this.$fbServices.deleteFolderDocument(id)
      for (let i = 0; i < useUploadPodcastStore().episodes.length; i++) {
        if (useUploadPodcastStore().episodes[i].folder === id) {
          await useUploadPodcastStore().deleteEpisode(useUploadPodcastStore().episodes[i].id)
        }
      }
    },
    async addDocumentToFolder() {
      const normalLinks = this.normalizeSocialLinks()
      const order = this.documents.length
      const data = {
        businessName: upperFirst(this.businessName),
        comments: this.comments,
        email: this.email,
        facebookLink: normalLinks.facebook,
        folderFileUrl: this.folderFileUrl,
        hostName: upperFirst(this.hostName),
        instagramLink: normalLinks.instagram,
        linkedinLink: normalLinks.linkedin,
        order: order - 1,
        podcastLink: this.podcastLink,
        podcastName: upperFirst(this.podcastName),
        twitterLink: normalLinks.twitter,
        websiteLink: this.websiteLink,
        youtubeLink: normalLinks.youtube
      }
      await this.$fbServices.createFolderDocument(data)
      this.partialStoreReset()
    },
    normalizeSocialLinks() {
      const normalFacebook = this.normalizeLink({
        link: this.facebookLink,
        key: 'facebook'
      })
      const normalInstagram = this.normalizeLink({
        link: this.instagramLink,
        key: 'instagram'
      })
      const normalLinkedin = this.normalizeLink({
        link: this.linkedinLink,
        key: 'linkedin'
      })
      const normalTwitter = this.normalizeLink({
        link: this.twitterLink,
        key: 'twitter'
      })
      const normalYouTube = this.normalizeLink({
        link: this.youtubeLink,
        key: 'youtube'
      })
      return Object.freeze({
        facebook: normalFacebook,
        instagram: normalInstagram,
        linkedin: normalLinkedin,
        twitter: normalTwitter,
        youtube: normalYouTube
      })
    },
    normalizeLink(
      {
        link,
        key
      } : {
        link: string,
        key: 'facebook' | 'youtube' | 'twitter' | 'instagram' | 'linkedin'
      }
    ) {
      const prefixes = this.socialLinksPrefix
      let normalLink: string = link
      const pattern = /https:\/\/www.+.com\//gm
      if (!pattern.test(link)) {
        normalLink = prefixes[key] + link
      }
      return normalLink
    },
    partialStoreReset() {
      this.podcastName = ''
      this.hostName = ''
      this.businessName = ''
      this.instagramLink = ''
      this.facebookLink = ''
      this.youtubeLink = ''
      this.twitterLink = ''
      this.linkedinLink = ''
      this.websiteLink = ''
      this.podcastLink = ''
      this.comments = ''
      this.folderFileUrl = ''
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: sessionStorage,
        paths: ['documents', 'id']
      }
    ]
  }
})
