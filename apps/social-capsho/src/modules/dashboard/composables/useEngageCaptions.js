import store from '../../../store'
import { computed } from 'vue'

export function useEngageCaptions() {
	const engageCaptions = computed(() => store.getters['app/getEngageCaptions'])
	return {
		engageCaptions
	}
}