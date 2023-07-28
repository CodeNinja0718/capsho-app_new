/**
 * Firebase composable for accessing tones
 */

import { ref, readonly, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/dbConfig'
import store from '@/store'

const selectedTone = ref(null)

export function useTones() {
  const aboutMeCollection = collection(db, 'about_me')
  const error = ref(null)
  const loading = ref(true)
  const tones = computed(() => store.state.profile.tones)

  const hasSelectedTone = computed(() => tones.value.find((tone) => selectedTone.value.name === tone.name))

  const activeClass = ref('bg-primaryDark text-white')
  const defaultClass = ref('bg-white text-primaryDark')

  const getTonesCollectionData = async () => {
    loading.value = true
    await getDocs(aboutMeCollection)
      .then((querySnapshot) => {
        const tonesArray = []
        querySnapshot.forEach((tone) => {
          let display = tone.id.replaceAll("_", " ")
          display = display[0].toUpperCase() + display.substring(1)
          tonesArray.push({
            name: display,
            db: tone.id,
            value: tone.id,
            isEnabled: false
          })
        })
        store.commit('profile/setTones', tonesArray)
      })
      .catch((e) => error.value = e)
      .finally(() => loading.value = !loading.value)
  }

  const selectTone = (selectedTone) => {
    const tone = getSelectedTone(selectedTone)

    store.commit('profile/setProfileCreatorsTone', tone)
  }

  const getSelectedTone = (selectedTone) => {
    return tones.value.find((tone) => selectedTone.name === tone.name)
  }

  onMounted(() => getTonesCollectionData())

  return {
    tones,
    activeClass: readonly(activeClass),
    defaultClass: readonly(defaultClass),
    getTonesCollectionData,
    selectTone,
    hasSelectedTone,
    error,
    loading
  }
}
