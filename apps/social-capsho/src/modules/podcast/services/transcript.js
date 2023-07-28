import { db } from '@/config/dbConfig'
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where, getDoc } from 'firebase/firestore'
import store from '../../../store'

export async function addTranscriptToCollection({ user_id, transcript_id, title, episode_guid, transcript, podcast_id, created_at }) {
  const transcriptRef = doc(db, 'transcripts', podcast_id + '---' + episode_guid)
  await setDoc(transcriptRef, {
    uid: user_id,
    transcript_id,
    title,
    episode_guid,
    transcript,
    podcast_id,
    created_at: created_at || Date.now(),
    lastUpdated: serverTimestamp()
  })
    .then(() => {
      store.commit('podcast/addTranscript', {
        doc_id: podcast_id + '---' + episode_guid,
        data: {
          user_id,
          transcript_id,
          title,
          episode_guid,
          transcript,
          podcast_id,
          created_at
        }
      })
    })
}

export async function getTranscripts(podcastId) {
  const transcriptsRef = collection(db, 'transcripts')
  const q = query(transcriptsRef, where('podcast_id', '==', podcastId))
  const querySnapshot = await getDocs(q)
  const transcripts = {}
  querySnapshot.forEach((doc) => {
    transcripts[doc.id] = doc.data()
  })
  store.commit('podcast/setTranscripts', transcripts)
}

export async function getTranscriptByDocId({ podcast_id, episode_guid }) {
  const transcriptRef = doc(db, 'transcripts', podcast_id + '---' + episode_guid)
  const transcriptSnap = await getDoc(transcriptRef)
  if (transcriptSnap.exists()) {
    return transcriptSnap.data()
  } else {
    return null
  }
}
