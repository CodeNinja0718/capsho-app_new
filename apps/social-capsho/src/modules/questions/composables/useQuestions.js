import { ref } from 'vue/dist/vue'
import { readonly } from 'vue'
import { getToolByDocId } from '@/services/dbService'
import { getDoc } from 'firebase/firestore'
import { backticksTemplate } from '@/utils'

export function useQuestions() {
	const questions = ref([])
	const progressbar = ref('')
	const captionAnswers = ref([])
	const arrCaptions = ref([])
	const arrEmails = ref([])
	const arrSubjectLines = ref([])

	function getQuestions({ toolFromRoute, toneOfVoice }) {
		const tool = toolFromRoute.replaceAll("-", "_")
		const tone = toneOfVoice.replaceAll("-", "_")
		let globalData = null

		getToolByDocId(tool, tone)
			.then(async (data) => {
				globalData = data
				progressbar.value = data.progressbar

				for (const questionRef of globalData.questions) {
					const questionSnap = await getDoc(questionRef)
					if (questionSnap.exists()) {
						const {
							examples,
							dropdown,
							question,
							order,
							lead_in,
							video
						} = questionSnap.data()
						const rand = Math.floor(Math.random() * examples.length)
						let isDropdown = !!dropdown
						const temp = backticksTemplate(question)
						questions.value.push({
							question: temp,
							order: order,
							dropdown: isDropdown,
							narrative: lead_in,
							placeholder: examples[rand],
							video: video
						})
						captionAnswers.value.push('')
					}
				}
			})
			.then(async () => {
				for (const captionRef of globalData.captions) {
					const captionSnap = await getDoc(captionRef)
					if (captionSnap.exists()) {
						arrCaptions.value.push(captionSnap.data())
					}
				}
			})
			.then(async () => {
				if (globalData.emails) {
					for (const emailRef of globalData.emails) {
						const emailSnap = await getDoc(emailRef)
						if (emailSnap.exists()) {
							arrEmails.value.push(emailSnap.data())
						}
					}
				} else {
					return null
				}
			})
			.then(async () => {
				if (globalData.email_subject_lines) {
					for (const eslRef of globalData.email_subject_lines) {
						const eslSnap = await getDoc(eslRef)
						if (eslSnap.exists()) {
							arrSubjectLines.value.push(eslSnap.data())
						}
					}
				}
			})
	}

	return {
		questions: readonly(questions),
		getQuestions
	}
}