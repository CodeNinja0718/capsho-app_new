import type { EpisodeInterfaceDoc } from 'src/models/episode'
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc
} from 'firebase/firestore'
import { IPodcastEpisodeDraftsHostBlogPostTemplate } from 'src/models/podcast/episode-drafts/host/blogPost.interface'
import { TemplateV2Creator, TemplateV2 } from 'src/models/template'
import { UserData, UserDoc } from 'src/models/userProfile'
import { collectionRef, docRef, firestore, setDocument } from 'src/services/firebase/db'
import { getAuth } from 'firebase/auth'
import { logtail } from 'boot/logtail'
import { slackFrontendErrors } from 'boot/axios'
import { useAuthStore } from 'stores/auth-store'
import { useNotification } from 'src/composables/useNotification'
import { usePodcastEpisodeDraftsHostBlogPostStore } from 'src/stores/podcast/episode-drafts/host/blog-post'
import { useTemplatesStore } from 'src/stores/templates'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import moment from 'moment'

export async function isHostInTheList() {
  const auth = getAuth()
  const authUser = auth.currentUser
  if (!authUser) {
    return null
  }
  const store = useUploadPodcastStore()
  store.showGuestDrafts = false
  const uidRef = docRef('capsho_guest_beta', '74Tx0xc3BnCZxUePJAHw')
  const uidSnap = await getDoc(uidRef)
  const uidData = uidSnap.data()
  let result = false
  if (uidData && uidData.UIDs && Array.isArray(uidData.UIDs)) {
    result = uidData.UIDs.includes(authUser.uid)
  }
  store.showGuestDrafts = result
  return result
}
/**
 * @return {Promise<unsubscribe>} - returns real time listener
 */
export async function getUsersData () {
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  try {
    const authUser = auth.currentUser
    if (!authUser) {
      return null
    }
    const store = useAuthStore()
    const userDocRef = docRef('users', authUser.uid)
    return new Promise<null | void>((resolve, reject) => {
      store.unsubUsersListener = onSnapshot(userDocRef, async (doc) => {
        if (doc.exists()) {
          const user = {
            ...doc.data()
          }
          store.user = new UserData({
            ...user,
            betaUserGotFreeCredits: (user.betaUserGotFreeCredits ?? false),
            hasSeenCapshoBetaOffer: (user.hasSeenCapshoBetaOffer ?? false),
            hasSeenOnboardingTutorial: (user.hasSeenOnboardingTutorial ?? false),
            isDoneOnBoardingFlow: user.isDoneOnBoardingFlow ?? false,
            isLoggedIn: user.isDoneOnBoardingFlow ?? false,
            isCacheRefreshed: user.isCacheRefreshed ?? false,
            showAgencyPlan: (user.showAgencyPlan ?? false)
          } as UserDoc)
          if (user.userType) {
            store.userType = user.userType
          }
        }
        resolve()
      }, () => {
        reject(new Error('Looks like there is a problem with the firebase service. Please try again later'))
      })
    })
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('usersData.ts - getUsersData', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: getUsersData',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? ''
              }
            }
          ]
        }
      }))
      triggerWarning(err.message)
    }
  }
}

/**
 * @param {Object} data
 * @return {Promise<void>}
 */
export async function updateUsersData (data: object) {
  const { triggerWarning } = useNotification()
  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      return null
    }
    await setDocument('users', user.uid, {
      ...data,
      email: user.email,
      id: user.uid
    })
  } catch (e) {
    if (e instanceof Error) {
      logtail?.error('usersData.ts - Update', {
        message: e.message
      })
      triggerWarning(e.message)
    }
  }
}

/**
 * @param subCollectionName
 * @return {Promise<unsubscribe>} - return real time listener
 */
export async function getUsersSubCollectionData (subCollectionName: string) {
  const allowedSubCollectionNames = ['episodes']
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  if (allowedSubCollectionNames.includes(subCollectionName)) {
    setTimeout(() => {
      try {
        const user = auth.currentUser
        if (!user) {
          return null
        }
        const store = useUploadPodcastStore()
        // const userSubCollectionDataRef = collectionRef(`users_data/${user.uid}/${subCollectionName}`)
        const uid = 'epXH5eJKosPPS4gG79RS8J2T9Mv1'
        const userSubCollectionDataRef = collectionRef(`users_data/${uid}/${subCollectionName}`)
        const q = query(userSubCollectionDataRef, orderBy('createdAt', 'desc'))
        store.unsubUsersDataListener = onSnapshot(q, (querySnapshot) => {
          const episodes: Array<EpisodeInterfaceDoc> = []
          querySnapshot.forEach((doc) => {
            const data = doc.data() as EpisodeInterfaceDoc
            const episode = {
              ...data,
              allCaptions: data.allCaptions ? data.allCaptions : {},
              displayDate: moment(data.created || data.createdAt).format('MM/DD/YYYY'),
              id: doc.id,
              folder: data.folder ? data.folder : 'default'
            } as EpisodeInterfaceDoc
            episodes.push(episode)
          })
          store.episodes = episodes
        })
      } catch (err) {
        if (err instanceof Error) {
          logtail?.error('usersData.ts - getUsersSubCollectionData', {
            message: err.message
          })
          Promise.resolve(slackFrontendErrors({
            method: 'POST',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              blocks: [
                {
                  type: 'header',
                  text: {
                    type: 'plain_text',
                    text: ':ghost: getUsersSubCollectionData',
                    emoji: true
                  }
                },
                {
                  type: 'divider'
                },
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: err.message
                  }
                },
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: auth.currentUser?.email ?? ''
                  }
                }
              ]
            }
          }))
          triggerWarning(err.message)
        }
      }
    }, 500)
  }
}

export async function getEpisodeById (podcastId: string) {
  const { triggerNegative } = useNotification()
  const auth = getAuth()
  try {
    if (!auth.currentUser || !podcastId) {
      return null
    }
    const uid = auth.currentUser.uid
    const db = firestore()
    const docRef = doc(db, 'users_data', uid, 'episodes', podcastId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data() as EpisodeInterfaceDoc
      return {
        ...data,
        allCaptions: data.allCaptions ?? {}
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      triggerNegative(err.message)
    }
  }
}

export async function checkIfDocumentExist (docId: string) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return null
  }
  const db = firestore()
  const docRef = doc(db, 'users_data', user.uid, 'episodes', docId)
  const episodeDrafts = await getDoc(docRef)
  return !!episodeDrafts.exists()
}

/**
 * @param {Object} data
 * @return {Promise<void>}
 */
export function addDataToUsersSubCollection (
  { data }: { data: EpisodeInterfaceDoc }
) {
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  try {
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const userSubCollectionDataRef = `users_data/${user.uid}/episodes`
    setDoc(docRef(userSubCollectionDataRef, data.id), data, { merge: true })
      .catch((err) => console.error(err))
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('usersData.ts - addDataToUsersSubCollection', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: addDataToUsersSubCollection',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? ''
              }
            }
          ]
        }
      }))
      triggerWarning(err.message)
    }
  }
}

/**
 * Updates podcast episodes data
 * @param {Object} data
 * @param {String} id
 * @return {Promise<void>}
 */
export async function updateUsersSubCollectionData (
  { data, id }: { data: EpisodeInterfaceDoc | object, id: string }
) {
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  try {
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const db = firestore()
    const docRef = doc(db, 'users_data', user.uid, 'episodes', id)
    await setDoc(docRef, data, { merge: true })
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('usersData.ts - updateUsersSubCollectionData', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: updateUsersSubCollectionData',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? ''
              }
            }
          ]
        }
      }))
      triggerWarning(err.message)
    }
  }
}

/**
 * @param {String} docId
 * @return {Promise<void>}
 */
export async function deleteEpisode (docId: string) {
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  try {
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const usersSubCollectionDataRef = doc(firestore(), `users_data/${user.uid}/episodes/${docId}`)
    await deleteDoc(usersSubCollectionDataRef)
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('usersData.ts - deleteEpisode', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: deleteEpisode',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? ''
              }
            }
          ]
        }
      }))
      triggerWarning(err.message)
    }
  }
}

/**
 * @Depricated by misunderstanding
 */
export async function getPodcastEpisodeDraftsHostTemplates() {
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  try {
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const store = usePodcastEpisodeDraftsHostBlogPostStore()
    const userEpisodeDraftsHostDataRef = collectionRef(`users_data/${user.uid}/episode-drafts-host-blog-post`)
    const q = query(userEpisodeDraftsHostDataRef, orderBy('createdAt', 'desc'))
    store.unsubUsersDataListener = onSnapshot(q, async (querySnapshot) => {
      const templates: Array<IPodcastEpisodeDraftsHostBlogPostTemplate> = []
      querySnapshot.forEach((document) => {
        const data = document.data() as IPodcastEpisodeDraftsHostBlogPostTemplate
        const template = {
          ...data,
          id: document.id
        } as IPodcastEpisodeDraftsHostBlogPostTemplate
        templates.push(template)
      })
      for (let i = 0; i < templates.length; i++) {
        const documentRef = docRef('users', templates[i].creator.id)
        const userDocumentSnapshot = await getDoc(documentRef)
        const userDocument = userDocumentSnapshot.data()
        templates[i].creator.name = userDocument?.firstName + ' ' + userDocument?.lastName
      }
      const userEpisodeDraftsHostSharedInfoDataRef = collectionRef(`users_data/${user.uid}/episode-drafts-host-blog-post-shared`)
      const sharedTemplatesSnapshot = await getDocs(userEpisodeDraftsHostSharedInfoDataRef)
      const sharedTemplates: Array<IPodcastEpisodeDraftsHostBlogPostTemplate> = []
      const sharedTemplatesInfo: Array<{ userId: string; templateId: string }> = []
      sharedTemplatesSnapshot.forEach((document) => {
        const sharedTemplateInfo = document.data() as { userId: string; templateId: string }
        sharedTemplatesInfo.push(sharedTemplateInfo)
      })
      for (const sharedTemplateInfo of sharedTemplatesInfo) {
        const userEpisodeDraftsHostSharedDataRef = docRef(`users_data/${sharedTemplateInfo.userId}/episode-drafts-host-blog-post`, sharedTemplateInfo.templateId)
        const userEpisodeDraftHostSharedDataSnapshot = await getDoc(userEpisodeDraftsHostSharedDataRef)
        const userEpisodeDraftHostSharedData = userEpisodeDraftHostSharedDataSnapshot.data() as IPodcastEpisodeDraftsHostBlogPostTemplate
        sharedTemplates.push(userEpisodeDraftHostSharedData)
      }
      for (let i = 0; i < sharedTemplates.length; i++) {
        const documentRef = docRef('users', sharedTemplates[i].creator.id)
        const userDocumentSnapshot = await getDoc(documentRef)
        const userDocument = userDocumentSnapshot.data()
        sharedTemplates[i].creator.name = userDocument?.firstName + ' ' + userDocument?.lastName
      }
      store.templates = [...templates, ...sharedTemplates]
    })
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('usersData.ts - getPodcastEpisodeDraftsHostTemplates', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: getPodcastEpisodeDraftsHostTemplates',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? ''
              }
            }
          ]
        }
      }))
      triggerWarning(err.message)
    }
  }
}

/**
 * @Depricated by misunderstanding
 */
export async function createPodcastEpisodeDraftsHostTemplates(data: IPodcastEpisodeDraftsHostBlogPostTemplate) {
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  try {
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const userEpisodeDraftsHostDataRef = collectionRef(`users_data/${user.uid}/episode-drafts-host-blog-post`)
    await addDoc(userEpisodeDraftsHostDataRef, data)
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('usersData.ts - getPodcastEpisodeDraftsHostTemplates', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: getPodcastEpisodeDraftsHostTemplates',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? ''
              }
            }
          ]
        }
      }))
      triggerWarning(err.message)
    }
  }
}

/**
 * @Depricated by misunderstanding
 */
export async function createPodcastEpisodeDraftsHostSharedTemplate(data: { userId: string; templateId: string }) {
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  try {
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const userEpisodeDraftsHostSharedDataRef = collectionRef(`users_data/${user.uid}/episode-drafts-host-blog-post-shared`)
    await addDoc(userEpisodeDraftsHostSharedDataRef, data)
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('usersData.ts - getPodcastEpisodeDraftsHostTemplates', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: getPodcastEpisodeDraftsHostTemplates',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? ''
              }
            }
          ]
        }
      }))
      triggerWarning(err.message)
    }
  }
}

export async function getAllTemplates() {
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  try {
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const authStore = useAuthStore()
    const store = useTemplatesStore()
    const userTemplatesDataRef = collectionRef(`users_data/${user.uid}/templates`)
    const usersTemplateSnapshot = await getDocs(userTemplatesDataRef)
    const templates: Array<TemplateV2 & TemplateV2Creator> = []
    usersTemplateSnapshot.forEach((document) => {
      const data = document.data() as TemplateV2
      const template = {
        ...data,
        id: document.id,
        creator: {
          id: user.uid,
          name: authStore.firstName + ' ' + authStore.lastName
        }
      } as TemplateV2 & TemplateV2Creator
      templates.push(template)
    })
    const userSharedTemplatesDataRef = collectionRef(`users_data/${user.uid}/shared-templates`)
    const sharedTemplatesSnapshot = await getDocs(userSharedTemplatesDataRef)
    const sharedTemplates: Array<TemplateV2 & TemplateV2Creator> = []
    const sharedTemplatesInfo: Array<{ userId: string; templateId: string }> = []
    sharedTemplatesSnapshot.forEach((document) => {
      const sharedTemplateInfo = document.data() as { userId: string; templateId: string }
      sharedTemplatesInfo.push(sharedTemplateInfo)
    })
    for (let i = 0; i < sharedTemplatesInfo.length; i++) {
      const userSharedTemplateDataRef = docRef(`users_data/${sharedTemplatesInfo[i].userId}/templates`, sharedTemplatesInfo[i].templateId)
      const userSharedTemplateDataSnapshot = await getDoc(userSharedTemplateDataRef)
      const userSharedTemplate = userSharedTemplateDataSnapshot.data() as TemplateV2
      const userDocRef = docRef('users', sharedTemplatesInfo[i].userId)
      const userDocumentSnapshot = await getDoc(userDocRef)
      const userDocument = userDocumentSnapshot.data()
      sharedTemplates.push({
        ...userSharedTemplate,
        creator: {
          id: sharedTemplatesInfo[i].userId,
          name: userDocument?.firstName + ' ' + userDocument?.lastName
        }
      })
    }
    const capshoTemplatesRef = collectionRef('capsho_layouts/')
    const capshoTemplatesSnapshot = await getDocs(capshoTemplatesRef)
    const capshoTemplates: Array<TemplateV2 & TemplateV2Creator> = []
    capshoTemplatesSnapshot.forEach((doc) => {
      capshoTemplates.push({
        id: doc.id,
        ...doc.data(),
        creator: {
          id: doc.id,
          name: 'Capsho'
        }
      } as TemplateV2 & TemplateV2Creator)
    })
    store.templates = [...templates, ...sharedTemplates, ...capshoTemplates]
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('usersData.ts - getAllTemplates', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: getAllTemplates',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? ''
              }
            }
          ]
        }
      }))
      triggerWarning(err.message)
    }
  }
}

export async function createTemplate(data: TemplateV2) {
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  try {
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const userTemplateDataRef = collectionRef(`users_data/${user.uid}/templates`)
    await addDoc(userTemplateDataRef, data)
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('usersData.ts - createTemplate', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: createTemplate',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? ''
              }
            }
          ]
        }
      }))
      triggerWarning(err.message)
    }
  }
}

export async function createSharedTemplate(data: { userId: string, templateId: string }) {
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  try {
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const userSharedTemplateRef = collectionRef(`users_data/${user.uid}/shared-templates`)
    await addDoc(userSharedTemplateRef, data)
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('usersData.ts - createSharedTemplate', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: createSharedTemplate',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? ''
              }
            }
          ]
        }
      }))
      triggerWarning(err.message)
    }
  }
}
