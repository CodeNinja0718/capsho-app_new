import { ref, computed } from 'vue'
import store from '@/store'
import { saveImage } from '@/services/storageService'

export function useBrandLogo() {
	const error = ref(null)

	const logotype = ref(null)

	const imgData = computed(() => store.state.profile.newUserProfile.photo)

	async function handleSelectedImage(e) {
		const file = takeFile(e)
		if (isValidImage(file)) {
			saveImage(file)
			store.commit('profile/setProfileCreatorsPhoto', file)
		} else {
			error.value = new Error('Invalid file type. Please try again!')
		}
	}

	function takeFile(e) {
		return e.target.files[0]
	}

	function isValidImage(file) {
		// needs to check if file is image and under a certain size
		return !!file
	}

	function selectImage() {
		logotype.value.click()
	}

	return {
		imgData,
		selectImage,
		handleSelectedImage,
		logotype
	}
}