import { getUserData } from '@/services/usersData'
import { ref, readonly, watch, computed } from 'vue'
import { useUser } from '@/composables/useUser'
import store from '@/store'

/**
 *
 * @returns {{emails: *, sets: *, emailSubjectLines: *, loading: *, error, captions: *}}
 */
export function useUsersData() {
	const sets = computed(() => store.getters['app/getUserSets'])
	const captions = computed(() => store.getters['app/getCaptions'])
	const emailSubjectLines = computed(() => store.getters['app/getUserEmailSubjectLines'])
	const emails = computed(() => store.getters['app/getUserEmails'])
	const error = ref(null)
	const loading = ref(true)

	const { userData } = useUser()

	const getUserCollectionData = () => {
		loading.value = true
		getUserData(userData.value.id)
			.then((data) => {
				store.commit('app/setUsersData', data)
			})
			.catch((e) => error.value = e)
			.finally(() => loading.value = !loading.value)
	}

	watch(userData, (newUserData) => {
		if (newUserData !== null) {
			getUserCollectionData()
		}
	})

	return {
		sets,
		captions,
		emailSubjectLines,
		emails,
		loading: readonly(loading),
		error: readonly(error),
		getUserCollectionData
	}
}
