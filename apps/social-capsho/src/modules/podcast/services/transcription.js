import { cloudFunctions } from '@/config/cloudFunctions'
import { doc, onSnapshot, collection, getDocs, where, query, documentId } from 'firebase/firestore'
import { db } from '@/config/dbConfig'
import { getAuth } from 'firebase/auth'
import { useNotification } from '@/composables/useNotification'
import store from '@/store'

export async function submitFileForTranscription ({ url, fileData }) {
  const { alertDanger } = useNotification()
  try {
    return await cloudFunctions({
      method: 'POST',
      url: '/transcription-submitFileForTranscription',
      data: {
        email: 'bekmuradovbegench@gmail.com',
        fileData,
        url
      }
    })
  } catch (e) {
    alertDanger(e.message)
  }
}

/**
 *
 * @param {string} docId
 * @returns {Promise<{unsub: Unsubscribe, data}>}
 */
export async function listenForTranscriptCollectionUpdates (docId) {
  const { alertDanger } = useNotification()
  try {
    const authUser = getAuth()
    const uid = authUser.currentUser.uid
    console.log(docId)
    return onSnapshot(doc(db, 'transcripts', uid + '-' + docId), (doc) => {
      if (doc.data()) {
        store.commit('podcast/setTranscript' , {
          ...doc.data(),
          words: breakTranscript({transcriptionData: doc.data()})
        })
      }
     })
  } catch (e) {
    alertDanger(e.message)
  }
}

/**
 *
 * @param {string} docId
 * @returns {Promise<{unsub: Unsubscribe, data}>}
 */
export async function listenForTranscriptionWordsCollectionUpdates (docId) {
  const { alertDanger } = useNotification()
  try {
    const authUser = getAuth()
    const uid = authUser.currentUser.uid
    return onSnapshot(doc(db, 'transcriptionData', uid + '-' + docId), (doc) => {
      store.commit('podcast/setTranscriptionData' , doc.data())
    })
  } catch (e) {
    alertDanger(e.message)
  }
}

export async function fetchTranscriptions () {
  const { alertDanger } = useNotification()
  try {
    const transcriptsRef = collection(db, 'transcripts')
    const q = query(transcriptsRef, where(documentId(), '==', 'Q6n59c1COpObpI1nZ6Zs1CODpUY2-oxabfbzo89-6139-4a78-a723-c5d241a3946d'))
    const querySnapshot = await getDocs(q)
    let transcripts = {}
    querySnapshot.forEach((doc) => {
      transcripts = {
        id: doc.id,
        ...doc.data(),
        words: breakTranscript({ transcriptionData: doc.data() })
      }
    })
    store.commit('podcast/setTranscript', transcripts)
  } catch (e) {
    alertDanger(e.message)
  }
}

/**
 *
 * @param {object} transcriptionData
 * @return {object} results
 */
export function breakTranscript({transcriptionData}) {
  console.log(transcriptionData)
  const CONTEXT_REQ_LENGTH = 900000; // in milliseconds
  const returnText = (word) => word.text;
  const duration = transcriptionData.duration
  if (duration <= (CONTEXT_REQ_LENGTH / 1000)) {
    return {
      words: transcriptionData.words,
      text: transcriptionData.words.map(returnText).join(' ')
    }
  }
  const results = {};
  const isLessThan15 = (word) => word.end >= CONTEXT_REQ_LENGTH;
  // first 15
  const first15Idx = transcriptionData.words.findIndex(isLessThan15);
  results['first15'] = {
    words: transcriptionData.words.slice(0, first15Idx),
    text: transcriptionData.words.slice(0, first15Idx).map(returnText).join(' ')
  };
  // last 15
  const last15StartAt = duration - (CONTEXT_REQ_LENGTH / 1000)
  const last15Idx = transcriptionData.words.findIndex((word) => {
    return word.start >= (last15StartAt * 1000);
  });
  console.log(last15StartAt, last15Idx)
  results['last15'] = {
    words: transcriptionData.words.slice(last15Idx),
    text: transcriptionData.words.slice(last15Idx).map(returnText).join(' ')
  };
  // all but last 15
  results['allButLast15'] = {
    words: transcriptionData.words.slice(0, last15Idx),
    text: transcriptionData.words.slice(0, last15Idx).map(returnText).join(' ')
  };
  console.log(results)
  return results;
}
