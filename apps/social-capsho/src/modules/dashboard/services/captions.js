import { db } from '@/config/dbConfig'
import { doc, getDoc } from 'firebase/firestore'
import store from '../../../store'

export async function fetchCaptions({ userId, toneOfVoice }) {
	try {
		if (userId) {
			const engageRef = doc(db, 'engage', toneOfVoice)
			const engageSnap = await getDoc(engageRef)
			const engageCaptions = []
			if (engageSnap.exists()) {
				const engageData = engageSnap.data()
				await engageData.captions.reduce(async (promise, captionRef) => {
					await promise
					const captionSnap = await getDoc(captionRef)
					engageCaptions.push(captionSnap.data())
				}, Promise.resolve())
				store.commit('app/setEngageCaptions', engageCaptions)
			}
		}
	} catch (e) {
		console.error(e)
	}
}

export async function getCaptionHelper(captions) {
	const promises = []
	for (const captionRef of captions) {
		const captionSnap = await getDoc(captionRef)
		promises.push(captionSnap)
	}
	return Promise.all(promises)
}
const honeyTrapCaptionsPath = [
	'TXCCE1',
	'TXCCE2',
	'TXCCE3',
	'TXCCE4',
	'TXCCE5',
	'TXCCE6',
	'TXCCE7',
	'TXCCE8',
	'TXCCE9',
	'TXCCE10',
	'TXCFM1',
	'TXCFM2',
	'TXCFM3',
	'TXGCCE1',
	'TXGCCE2',
	'TXGCCE3',
	'TXGCCE4',
	'TXGCCE5',
	'TXGCCE6',
	'TXGCCE7',
	'TXGCCE8',
	'TXGCCE9',
	'TXGCCE10',
	'TXGCFM1',
	'TXGCFM2',
	'TXGCFM3',
	'TRCCE1',
	'TRCCE2',
	'TRCCE3',
	'TRCCE4',
	'TRCCE5',
	'TRCCE6',
	'TRCCE7',
	'TRCCE8',
	'TRCCE9',
	'TRCCE10',
	'TRCFM1',
	'TRCFM2',
	'TRCFM3',
	'TRGCCE1',
	'TRGCCE2',
	'TRGCCE3',
	'TRGCCE4',
	'TRGCCE5',
	'TRGCCE6',
	'TRGCCE7',
	'TRGCCE8',
	'TRGCCE9',
	'TRGCCE10',
	'TRGCFM1',
	'TRGCFM2',
	'TRGCFM3',
	'TJCCE1',
	'TJCCE2',
	'TJCCE3',
	'TJCCE4',
	'TJCCE5',
	'TJCCE6',
	'TJCCE7',
	'TJCCE8',
	'TJCCE9',
	'TJCCE10',
	'TJCFM1',
	'TJCFM2',
	'TJCFM3',
	'TJGCCE1',
	'TJGCCE2',
	'TJGCCE3',
	'TJGCCE4',
	'TJGCCE5',
	'TJGCCE6',
	'TJGCCE7',
	'TJGCCE8',
	'TJGCCE9',
	'TJGCCE10',
	'TJGCFM1',
	'TJGCFM2',
	'TJGCFM3',
	'TMCCE1',
	'TMCCE2',
	'TMCCE3',
	'TMCCE4',
	'TMCCE5',
	'TMCCE6',
	'TMCCE7',
	'TMCCE8',
	'TMCCE9',
	'TMCCE10',
	'TMCFM1',
	'TMCFM2',
	'TMCFM3',
	'TMGCCE1',
	'TMGCCE2',
	'TMGCCE3',
	'TMGCCE4',
	'TMGCCE5',
	'TMGCCE6',
	'TMGCCE7',
	'TMGCCE8',
	'TMGCCE9',
	'TMGCCE10',
	'TMGCFM1',
	'TMGCFM2',
	'TMGCFM3',
	'TPCCE1',
	'TPCCE2',
	'TPCCE3',
	'TPCCE4',
	'TPCCE5',
	'TPCCE6',
	'TPCCE7',
	'TPCCE8',
	'TPCCE9',
	'TPCCE10',
	'TPCFM1',
	'TPCFM2',
	'TPCFM3',
	'TPGCCE1',
	'TPGCCE2',
	'TPGCCE3',
	'TPGCCE4',
	'TPGCCE5',
	'TPGCCE6',
	'TPGCCE7',
	'TPGCCE8',
	'TPGCCE9',
	'TPGCCE10',
	'TPGCFM1',
	'TPGCFM2',
	'TPGCFM3',
	'TCCCE1',
	'TCCCE2',
	'TCCCE3',
	'TCCCE4',
	'TCCCE5',
	'TCCCE6',
	'TCCCE7',
	'TCCCE8',
	'TCCCE9',
	'TCCCE10',
	'TCCCE11',
	'TCCFM1',
	'TCCFM2',
	'TCCFM3',
	'TCGCCE1',
	'TCGCCE2',
	'TCGCCE3',
	'TCGCCE4',
	'TCGCCE5',
	'TCGCCE6',
	'TCGCCE7',
	'TCGCCE8',
	'TCGCCE9',
	'TCGCCE10',
	'TCGCFM1',
	'TCGCFM2',
	'TCGCFM3',
	'TBGCCE1',
	'TBGCCE2',
	'TBGCCE3',
	'TBGCCE4',
	'TBGCCE5',
	'TBGCCE6',
	'TBGCCE7',
	'TBGCCE8',
	'TBGCCE9',
	'TBGCCE10',
	'TBGCFM1',
	'TBGCFM2',
	'TBGCFM3',
	'TBCCE1',
	'TBCCE2',
	'TBCCE3',
	'TBCCE4',
	'TBCCE5',
	'TBCCE6',
	'TBCCE7',
	'TBCCE8',
	'TBCCE9',
	'TBCCE10',
	'TBCFM1',
	'TBCFM2',
	'TBCFM3',
	'TSCCE1',
	'TSCCE2',
	'TSCCE3',
	'TSCCE4',
	'TSCCE5',
	'TSCCE6',
	'TSCCE7',
	'TSCCE8',
	'TSCCE9',
	'TSCCE10',
	'TSCFM1',
	'TSCFM2',
	'TSCFM3',
	'TSGCCE1',
	'TSGCCE2',
	'TSGCCE3',
	'TSGCCE4',
	'TSGCCE5',
	'TSGCCE6',
	'TSGCCE7',
	'TSGCCE8',
	'TSGCCE9',
	'TSGCCE10',
	'TSGCFM1',
	'TSGCFM2',
	'TSGCFM3'
]
export async function getHoneyTrapCaptionsFromDb(engageCaptions) {
	try {
		const honeyTrapCaptions = []
		await honeyTrapCaptionsPath.reduce(async (promise, docId) => {
			await promise
			const captionRef = doc(db, 'captions', docId)
			const captionSnap = await getDoc(captionRef)
			honeyTrapCaptions.push(captionSnap.data())
		}, Promise.resolve())
		// store.commit('app/setHoneyTrapCaptions', honeyTrapCaptions.concat(engageCaptions))
		store.commit('app/setEngageCaptions', engageCaptions.concat(honeyTrapCaptions))
	} catch (e) {
		console.error(e)
	}
}
