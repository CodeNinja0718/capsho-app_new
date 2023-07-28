import { readonly, ref, computed } from 'vue'
import { setFirstLogin } from '@/services/dbService'
import { useUser } from '@/composables/useUser'
import { useNotification } from '@/composables/useNotification'

const onboarding1 = ref(false)
const onboarding2 = ref(false)
const tooltipStep = ref(0)

export function useOnboarding() {
	const { isSubscribed, isFirstLogin, userData } = useUser()
	const paid = computed(() => isSubscribed.value)

	const increaseTooltipStepBy = (n) => tooltipStep.value += n
	const decreaseTooltipStepBy = (n) => tooltipStep.value -= n

	function hasDoneOnboarding() {
		onboarding1.value = isFirstLogin.value
	}

	function nextOnboarding() {
		tooltipStep.value = 0
		onboarding1.value = false
		onboarding2.value = true
	}

	const { alertDanger } = useNotification()

	function finishOnboarding() {
		let id = userData.value.id

		tooltipStep.value = 0
		onboarding1.value = false
		onboarding2.value = false

		setFirstLogin(id)
			.catch((e) => alertDanger(e))
	}

	return {
		tooltipStep: readonly(tooltipStep),
		onboarding1: readonly(onboarding1),
		onboarding2: readonly(onboarding2),
		hasDoneOnboarding,
		nextOnboarding,
		finishOnboarding,
		paid,
		increaseTooltipStepBy,
		decreaseTooltipStepBy
	}
}
