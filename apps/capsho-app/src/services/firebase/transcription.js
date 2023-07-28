import { api as cloudFunctions } from 'src/boot/axios'
import { collection, doc, getDocs, limit, onSnapshot, query, setDoc } from 'firebase/firestore'
import { firestore } from 'src/services/firebase/db'
import { useNotification } from 'src/composables/useNotification'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { getAuth } from 'firebase/auth'
import { logtail } from 'boot/logtail'
import { slackFrontendErrors } from 'boot/axios'

/**
 * Submits file for transcription
 * @param {boolean} excludeIntro
 * @param {boolean} isGuest
 * @param {boolean} withChapterSummaries
 * @param {string} businessName
 * @param {string} guestName
 * @param {string} hostName
 * @param {string} podcastId
 * @param {string} url
 * @return {Promise<Object>}
 */
export async function submitFileForTranscription (
  {
    businessName,
    excludeIntro,
    guestName,
    hostName,
    isGuest,
    podcastId,
    url,
    withChapterSummaries
  }
) {
  const { triggerNegative } = useNotification()
  const auth = getAuth()
  const endpoint = process.env.DEV
    ? '/development-submitFileForTranscriptionV2'
    : '/transcription-submitFileForTranscription'
  try {
    if (auth.currentUser) {
      return await cloudFunctions({
        method: 'POST',
        url: endpoint,
        data: {
          businessName,
          email: auth.currentUser.email,
          excludeIntro,
          guestName,
          hostName,
          isGuest,
          podcastId,
          url,
          withChapterSummaries
        }
      })
    }
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('transcription.js - submitFileForTranscription', {
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
                text: ':ghost: submitFileForTranscription',
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
                text: err.code
              }
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
                text: auth.currentUser?.email ?? 'no email'
              }
            }
          ]
        }
      }))
      triggerNegative(err.message, false, '', 15000)
    }
  }
}

/**
 *
 * @param {string} podcastId
 * @returns {Promise<{unsub: Unsubscribe, data}>}
 */
export async function listenForTranscriptCollectionUpdates (podcastId) {
  const { triggerNegative } = useNotification()
  const auth = getAuth()
  try {
    if (!auth.currentUser) {
      return null
    }
    const uid = auth.currentUser.uid
    const db = firestore()
    const store = useUploadPodcastStore()
    const docId = `${uid}-${podcastId}`
    const unsubscribe = onSnapshot(doc(db, 'transcripts', docId), (doc) => {
      if (doc.exists()) {
        store.transcript = {
          ...doc.data()
        }
        unsubscribe()
        Promise.resolve(store.createInitialDraftsOne())
      }
    })
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('transcription.js - listenForTranscriptCollectionUpdates', {
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
                text: ':ghost: listenForTranscriptCollectionUpdates',
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
                text: err.code
              }
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
                text: auth.currentUser?.email ?? 'no email'
              }
            }
          ]
        }
      }))
      triggerNegative(err.message)
    }
  }
}

/**
 * Updates the transcript
 * @param {Transcript} data - updated transcript
 * @return {Promise<void>}
 */
export async function updateTranscriptDoc (data) {
  const { triggerNegative } = useNotification()
  const auth = getAuth()
  try {
    if (!auth.currentUser) {
      return null
    }
    const uid = auth.currentUser.uid
    const docId = `${uid}-${data.docId}`
    const db = firestore()
    const docRef = doc(db, 'transcripts', docId)
    await setDoc(docRef, { ...data }, { merge: true })
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('transcription.js - updateTranscriptDoc', {
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
                text: ':ghost: updateTranscriptDoc',
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
                text: err.code
              }
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
                text: auth.currentUser?.email ?? 'no email'
              }
            }
          ]
        }
      }))
      triggerNegative(err.message)
    }
  }
}

/**
 * Check if transcription exists before uploading
 * @param {string} transcriptId
 * @return {Promise<void>}
 */
export async function getTranscription (transcriptId) {
  const { triggerNegative } = useNotification()
  const auth = getAuth()
  try {
    if (!auth.currentUser) {
      return null
    }
    const uid = auth.currentUser.uid
    const db = firestore()
    const docId = `${uid}-${transcriptId}`
    const store = useUploadPodcastStore()
    const unsubscribe = onSnapshot(doc(db, 'transcripts', docId), (transcriptSnap) => {
      if (transcriptSnap.exists()) {
        const transcription = transcriptSnap.data()
        store.transcript = {
          docId: transcriptSnap.id,
          ...transcription,
          speakerLabels: transcription.speakerLabels ? transcription.speakerLabels : false
        }
        store.unsubTranscriptListener = unsubscribe
      } else {
        store.transcript = {
          labeledText: 'No transcript data',
          speakerLabels: false
        }
      }
    })
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('transcription.js - getTranscription', {
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
                text: ':ghost: getTranscription',
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
                text: err.code
              }
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
                text: auth.currentUser?.email ?? 'no email'
              }
            }
          ]
        }
      }))
      triggerNegative(err.message)
    }
  }
}

export async function updateTranscriptionChapters (transcriptId) {
  const auth = getAuth()
  if (!auth.currentUser) {
    return null
  }
  const uid = auth.currentUser.uid
  const db = firestore()
  const docId = `${uid}-${transcriptId}`
  const docPath = `/transcripts/${docId}/chapters/`
  const collectionRef = collection(db, docPath)
  const q = query(collectionRef, limit(1))
  const querySnapshot = await getDocs(q)
  let chapters = {}
  querySnapshot.forEach((doc) => {
    const docData = doc.data()
    if (Array.isArray(docData.chapters) && docData.chapters.length) {
      chapters = docData.chapters.reduce((acc, obj, index) => {
        acc.gistSummaries += `${index + 1} - ${obj.gist}\n\n`
        acc.headlineSummaries += `${index + 1} - ${obj.headline}\n\n`
        return acc
      }, {})
    }
  })
  await updateTranscriptDoc(chapters)
  return chapters
}

/**
 *
 * @param {object} transcriptionData
 * @return {object} results
 */
export function breakTranscript ({ transcriptionData }) {
  const CONTEXT_REQ_LENGTH = 900000 // in milliseconds
  const returnText = (word) => word.text
  const duration = transcriptionData.duration
  if (duration <= (CONTEXT_REQ_LENGTH / 1000)) {
    return {
      words: transcriptionData.words,
      text: transcriptionData.words.map(returnText).join(' ')
    }
  } else {
    // last 15
    const last15StartAt = duration - (CONTEXT_REQ_LENGTH / 1000)
    const last15Idx = transcriptionData.words.findIndex((word) => {
      return word.start >= (last15StartAt * 1000)
    })
    // all but last 15
    return {
      words: transcriptionData.words.slice(0, last15Idx),
      text: transcriptionData.words.slice(0, last15Idx).map(returnText).join(' ')
    }
  }
}
