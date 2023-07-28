/**
 * Firebase composable for accessing themes
 */

import { ref, readonly, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/dbConfig'
import store from '@/store'

const themesPage = ref(0)

export function useThemes() {
  const themesCollection = collection(db, 'themes')
  const error = ref(null)
  const loading = ref(true)
  const themes = computed (() => store.state.profile.themes)
  const selectedThemes = computed(() => store.state.profile.selectedThemes)
  const themeSections = computed(() => Math.ceil(themes.value.length / 6))

  const getCollectionData = async () => {
    loading.value = true
    await getDocs(themesCollection)
      .then((querySnapshot) => {
        const themesArray = []
        querySnapshot.forEach((theme) => {
          let themeName = theme.id.replaceAll("_", " & ")
          themesArray.push({
            name: themeName,
            img: theme.data().img,
            id: theme.id
          })
        })
        store.commit('profile/setThemes', themesArray)
      })
      .catch((e) => error.value = e)
      .finally(() => loading.value = !loading.value)
  }

  const selectTheme = (i) => {
    if (selectedThemes.value.length < 5) {
      let obj = {
        id: themes.value[i + themesPage.value - 1].id,
        name: themes.value[i + themesPage.value - 1].name
      }
      let isIncluded = selectedThemes.value.some((theme) => theme.name === obj.name)
      if (!isIncluded) {
        store.commit('profile/setProfileCreatorsTheme', obj)
      }
    }
  }

  const unselectTheme = (i) => {
    store.commit('profile/removeProfileCreatorsTheme', i)
  }

  function nextPage() {
    let sum = themesPage.value + themeSections.value
    if (sum <= themes.value.length) {
      themesPage.value = sum
    }
  }

  function previousPage() {
    let sub = themesPage.value - themeSections.value
    if (sub >= 0) {
      themesPage.value = sub
    } else {
      themesPage.value = 0
    }
  }
  onMounted(() => getCollectionData())

  return {
    themes,
    themesPage: readonly(themesPage),
    selectedThemes,
    error: readonly(error),
    loading: readonly(loading),
    themeSections,
    previousPage,
    nextPage,
    selectTheme,
    unselectTheme,
    getCollectionData
  }
}
