/**
 * composable for accessing types
 */

import { readonly, ref } from 'vue'
import store from '@/store'

export function useTypes() {
  const types = ref([
    { name: 'Product', db: 'product', color: 'white', text: 'primaryDark', isEnabled: false },
    { name: 'Service/Coach', db: 'service', color: 'white', text: 'primaryDark', isEnabled: false }
  ])

  const activeClass = ref('bg-primaryDark text-white')
  const defaultClass = ref('bg-white text-primaryDark')

  const selectType = (selectedType) => {
    types.value.forEach((type) => {
      type.isEnabled = selectedType.name === type.name
    })
    const type = getSelectedType(selectedType)
    store.commit('profile/setProfileCreatorsType', type.db)
  }

  const getSelectedType = (selectedType) => {
    return types.value.find((type) => selectedType.name === type.name)
  }

  return {
    types: readonly(types),
    selectType,
    activeClass: readonly(activeClass),
    defaultClass: readonly(defaultClass)
  }
}
