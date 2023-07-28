/**
 * composable for managing profile creation steps state
 */
import store from '@/store'
import { computed  } from 'vue'

export function useSteps() {
  const step = computed(() => store.state.profile.profileCreationStep)
  const isFinalStep = computed(() => step.value === 4)
  const increaseStepBy = (n) => store.commit('profile/increaseStepBy', n)
  const decreaseStepBy = (n) => store.commit('profile/decreaseStepBy', n)

  const resetSteps = () => store.commit('profile/resetSteps')
  return {
    step,
    isFinalStep,
    increaseStepBy,
    decreaseStepBy,
    resetSteps
  }
}
