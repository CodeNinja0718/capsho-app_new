import { getUsersSubCollectionData, deleteUsersSetDoc, updateUsersSetsData } from '@/services/usersData'
import { getSet } from '@/services/sets'
import { ref, readonly, watch, computed } from 'vue'
import { useUser } from '@/composables/useUser'
import store from '@/store'
import { useNotification } from '@/composables/useNotification'

const selectedSet = ref(null)

export function useSets() {
  const answers = computed(() => store.getters['profile/getAnswers'])
  const questions = computed(() => store.getters['profile/getQuestions'])
  const sets = computed(() => store.getters['profile/getSets'])

  const cleanQuestions = computed(() => {
    return questions.value.map((question) => {
      return {
        display: question.match(/<br \/>/g) ? question.split('<br />') : question.split('<br>')
      }
    })
  })

  const success = ref(false)
  const loading = ref(false)
  const error = ref(null)

  const { userData } = useUser()

  const makeHumanFriendlyDate = (set) => {
    const createdAt = new Date(set?.createdAt.seconds * 1000)
    return `${createdAt.getMonth() + 1}/${createdAt.getDate()}/${createdAt.getFullYear()}`
  }

  const makeHumanFriendlyToolName = (set) => {
    return set.customToolTitle ? set.customToolTitle : set?.tool.match(/_/gm) ? set?.tool.replaceAll("_", " ") : set.tool
  }

  const getSets = async () => {
    try {
      loading.value = true
      const setsData = await getUsersSubCollectionData('sets', userData.value.id)
      const cleanSets = setsData.map((set) => {
        return {
          ...set,
          label: makeHumanFriendlyToolName(set),
          value: set.tool,
          title: makeHumanFriendlyToolName(set),
          createdAt: makeHumanFriendlyDate(set)
        }
      })
      await store.commit('profile/setSets', cleanSets)
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = !loading.value
    }
  }

  const updateSets = async (name) => {
    const { alertPrimary, alertDanger } = useNotification()
    success.value = false
    try {
      const set = {
        ...sets.value.find((set) => set.name === name)
      }
      if (set) {
        set.enabled = !set.enabled
      }
      await updateUsersSetsData({ subCollectionName: 'sets', set })
      // await updateUserSets({ id: userData.value.id, sets: sets.value })
      alertPrimary('Preferences updated')
      await getSets()
    } catch (e) {
      alertDanger(e.message)
    } finally {
      success.value = !success.value
    }
  }

  const getSingleSet = (set) => {
    selectedSet.value = set
    getSet(set.name)
      .then((doc) => {
        store.commit('profile/setAnswers', doc.answers)
        store.commit('profile/setQuestions', doc.questions)
      })
      .catch((e) => error.value = e)
  }

  const setIsEnabled = async (name) => {
    await updateSets(name)
    // await store.commit('profile/updateSet', name)
  }

  const removeSet = async (name) => {
    const { alertDanger } = useNotification()
    try {
      const set = sets.value.find((set) => set.name === name)
      await deleteUsersSetDoc({ set })
      await getSets()
    } catch (e) {
      alertDanger(e.message)
    }
  }

  const resetSelectedSet = () => selectedSet.value = null

  watch(userData, (newUserData) => {
    if (newUserData) getSets(newUserData.id)
  }, { immediate: true })

  return {
    sets,
    questions,
    cleanQuestions,
    answers,
    success: readonly(success),
    loading: readonly(loading),
    error: readonly(error),
    selectedSet: readonly(selectedSet),
    getSets,
    updateSets,
    makeHumanFriendlyToolName,
    makeHumanFriendlyDate,
    getSingleSet,
    setIsEnabled,
    removeSet,
    resetSelectedSet
  }
}
