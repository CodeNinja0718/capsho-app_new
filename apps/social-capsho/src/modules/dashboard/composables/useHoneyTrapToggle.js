import { ref, readonly } from 'vue'

const tabs = ref([
	{ name: 'Guest', isSelected: true, color: 'primaryDark', weight: 'bold' },
	{ name: 'No Guest', isSelected: false, color: 'gray-800', weight: 'normal' }
])

const tabIndex = ref(0)

export function useHoneyTrapToggle() {
	const changeTabs = (tab) => {
		if (!tab.isSelected) {
			tabIndex.value = tabs.value.indexOf(tab)
			tabs.value.forEach((item) => {
				item.isSelected = item.name === tab.name
			})
		}
	}
	const activeClass = ref('text-primaryDark border-indigo-200 dark:border-indigo-700 hover:text-indigo-600 hover:border-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300')
	const defaultClass = ref('text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300')

	return {
		tabs: readonly(tabs),
		tabIndex: readonly(tabIndex),
		activeClass: readonly(activeClass),
		defaultClass: readonly(defaultClass),
		changeTabs
	}
}
