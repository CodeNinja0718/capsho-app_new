import { db } from '@/config/dbConfig'
import { doc, serverTimestamp, setDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import store from '../../../store'

export async function addPodcastToCollection({ user_id, podcast_id, title, image_url, description, created_at, rss_url }) {
	const podcastRef = doc(db, 'podcasts', user_id + '---' + podcast_id)
	await setDoc(podcastRef, {
		uid: user_id,
		podcast_id,
		title,
		image_url,
		description,
		rss_url,
		created_at: created_at || Date.now(),
		lastUpdated: serverTimestamp()
	})
}

export async function getPodcasts() {
	const auth = getAuth()
	const podcastsRef = collection(db, 'podcasts')
	const q = query(podcastsRef, where('uid', '==', auth.currentUser.uid))
	const querySnapshot = await getDocs(q)
	const podcasts = []
	querySnapshot.forEach((doc) => {
		podcasts.push(doc.data())
	})
	store.commit('podcast/setPodcasts', podcasts)
}

export async function getPodcastById({ user_id, podcast_id }) {
	const podcastRef = doc(db, 'podcasts', user_id + '---' + podcast_id)
	const podcastSnap = await getDoc(podcastRef)
	if (podcastSnap.exists()) {
		return podcastSnap.data()
	} else {
		return null
	}
}
