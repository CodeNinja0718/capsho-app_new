import { getTemplateByType } from '@/modules/dashboard/services/templates'
import { ref, readonly, computed } from 'vue'
// import { backticksTemplate } from '@/utils'
import store from '@/store'

/**
 *
 * @returns {{template: *, error: *, loading: *}}
 */
export function useTemplate() {
	const error = ref(null)
	const loading = ref(true)
	// const honeyTrapCaptions = computed(() => store.getters['app/getHoneyTrapCaptions'])
	const setNames = computed(() => store.getters['app/getEnabledSetNames'])
	const getTemplates = ({ templateName, type }) => {
		loading.value = true
		getTemplateByType({ template: templateName, type })
			.then(async ({outputs}) => {
				store.commit('app/setTemplates', outputs)
			})
			.then(() => setTemplatesText())
			.catch((e) => error.value = e)
			.finally(() => loading.value = !loading.value)
	}

	const setTemplatesText = () => {
		const templates = computed(() => store.getters['app/getTemplates'])
		const captions = computed(() => store.getters['app/getCaptions'])
		if (templates.value.length) {
			try {
				for (let i = 0; i < templates.value.length; i++) {
					const possibles = []
					captions.value.forEach((caption) => {
						if (templates.value[i].type === caption.type || templates.value[i].tool === caption.tool) {
							if (setNames.value.includes(caption.set)) {
								possibles.push(caption.text)
							} else if (caption.tool === 'engage') {
								const temp = eval("`" + caption.text + "`")
								possibles.push(temp)
							}
						}
					})
					if (possibles.length > 0) {
						const rand = Math.floor(Math.random() * possibles.length)
						store.commit('app/updateTemplateText', { pos: i, value: possibles[rand] })
					}
				}
			} catch (e) {
				console.error(e)
			}
		}
	}

	return {
		error: readonly(error),
		loading: readonly(loading),
		getTemplates,
		setTemplatesText
	}
}
