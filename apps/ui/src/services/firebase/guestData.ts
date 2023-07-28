import {
  addDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc
} from 'firebase/firestore'
import { EpisodeInterfaceDoc } from 'src/models/episode'
import { collectionRef, firestore, getDocument } from 'src/services/firebase/db'
import { formattedDateString } from 'src/utils/date'
import { getAuth } from 'firebase/auth'
import { logtail } from 'boot/logtail'
import { slackFrontendErrors } from 'boot/axios'
import { useAuthStore } from 'stores/auth-store'
import { useNotification } from 'src/composables/useNotification'
import { useUploadPodcastStore } from 'stores/upload-podcast'

export async function getGuestEpisodesLength(
  {
    email
  }: {
    email: string
  }
) {
  if (!email) {
    return false
  }
  const guestDataRef = collectionRef(`users_data_guest/${email}/episodes`)
  const guestDataSnap = await getDocs(guestDataRef)
  return guestDataSnap.docs.length > 0
}

/**
 * @param {Object} data
 * @return {Promise<void>}
 */
export async function saveEpisodesDraftsToGuest (
  { data }: { data: EpisodeInterfaceDoc }
) {
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  try {
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const email = user.email
    const guestSubCollectionDataRef = collectionRef('users_data_guest' + `/${email}` + '/episodes')
    addDoc(guestSubCollectionDataRef, data)
      .catch((err) => console.error(err))
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('guestData.ts - saveEpisodesDraftsToGuest', {
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
                text: ':ghost: saveEpisodesDraftsToGuest',
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
export async function updateGuestSubCollectionData (
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
    const authStore = useAuthStore()
    const email = user.email ?? authStore.user.email
    const docRef = doc(db, 'users_data_guest', email, 'episodes', id)
    await setDoc(docRef, data, { merge: true })
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('guestData.ts - updateGuestSubCollectionData', {
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
 * @param {string} docId
 * @param {string} podcastId
 * @return {Promise<unsubscribe>} - return real time listener
 */
export async function fetchGuestsEpisodeById (
  {
    docId,
    podcastId
  }: {
    docId: string,
    podcastId: string
  }
) {
  const { triggerWarning } = useNotification()
  const auth = getAuth()
  try {
    const user = auth.currentUser
    if (!user) {
      return null
    }
    return await getDocument(`users_data_guest/${docId}/episodes`, podcastId)
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('guestData.ts - fetchGuestsEpisodeById', {
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
                text: ':ghost: fetchGuestsEpisodeById',
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
 * @param subCollectionName
 * @return {Promise<unsubscribe>} - return real time listener
 */
export async function getGuestSubCollectionData (subCollectionName: string) {
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
        const authStore = useAuthStore()
        const email = user.email ?? authStore.user.email
        const userSubCollectionDataRef = collectionRef(`users_data_guest/${email}/${subCollectionName}`)
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
          // store.episodes = sampleEpisodes as EpisodeInterfaceDoc[]
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
