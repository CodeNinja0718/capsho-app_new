import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc
} from 'firebase/firestore'
import { collectionRef, docRef, firestore, setDocument } from 'src/services/firebase/db'
import { getAuth } from 'firebase/auth'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { useAuthStore } from 'stores/auth-store'
import { formattedDateString } from 'src/utils/date'
import { useNotification } from 'src/composables/useNotification'
import { UserData, UserDoc } from 'src/models/userProfile'
import { EpisodeInterfaceDoc } from 'src/models/episode'
import { logtail } from 'boot/logtail'
import { slackFrontendErrors } from 'boot/axios'

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
    try {
      const user = auth.currentUser
      if (!user) {
        return null
      }
      const store = useUploadPodcastStore()
      const userSubCollectionDataRef = collectionRef(`users_data/${user.uid}/${subCollectionName}`)
      const q = query(userSubCollectionDataRef, orderBy('createdAt', 'desc'))
      store.unsubUsersDataListener = onSnapshot(q, (querySnapshot) => {
        const episodes: Array<EpisodeInterfaceDoc> = []
        querySnapshot.forEach((doc) => {
          const data = doc.data() as EpisodeInterfaceDoc
          const episode = {
            ...data,
            allCaptions: data.allCaptions ? data.allCaptions : {},
            displayDate: formattedDateString(data.createdAt),
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
