import { readonly, ref, onUnmounted } from 'vue'

const optionIndex = ref(0)

export function useToggleMenu() {
  const menu = ref([
    { name: 'Profile', isSelected: true, color: 'primaryDark', weight: 'bold' },
    { name: 'Saved inputs', isSelected: false, color: 'gray-800', weight: 'normal' }
  ])

  function changeMenu(option) {
    if (!option.isSelected) {
      optionIndex.value = menu.value.indexOf(option)
      menu.value.forEach((item) => {
        item.isSelected = item.name === option.name
      })
    }
  }

  onUnmounted(() => optionIndex.value = 0)
  return {
    optionIndex: readonly(optionIndex),
    menu: readonly(menu),
    changeMenu
  }
}
