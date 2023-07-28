import store from '@/store'
import { computed, watch, ref } from 'vue'

export function usePagination() {
  const sets = computed(() => store.getters['profile/getSets'])

  const searchQuery = ref('')
  const selectQuery = ref('all')
  const total = ref(0)
  const getTotal = () => (total.value = sets.value.length)

  const itemsPerPage = ref(10)
  const currentPage = ref(1)
  const lastPage = computed(() => Math.ceil(total.value / itemsPerPage.value))
  const from = computed(() => total.value === 0 ? 0 : ((currentPage.value - 1) * itemsPerPage.value) + 1)
  const to = computed(() => {
    return currentPage.value * itemsPerPage.value < total.value ? currentPage.value * itemsPerPage.value : total.value
  })
  const setsPerPage = computed(() => store.state.profile.setsPerPage)

  const handleNext = () => {
    currentPage.value += 1
    if (currentPage.value > lastPage.value) {
      currentPage.value = lastPage.value
    }
  }
  const handlePrev = () => {
    currentPage.value -= 1
    if (currentPage.value < 1) {
      currentPage.value = 1
    }
  }

  const filterSets = (query) => {
    if (typeof query === 'object') {
      query = query.label
    }
    if (query && query !== 'all') {
      query = query.toLowerCase().split(' ').join('_')
      const result = sets.value.filter((set) => {
        if (set.customToolTitle) {
          return set.customToolTitle.toLowerCase().includes(query)
        } else {
          return set.tool.includes(query)
        }
      })
      store.commit('profile/updateSetsPerPage', result)
    } else {
      const val = sets.value.slice(from.value - 1, to.value)
      store.commit('profile/updateSetsPerPage', val)
    }
  }

  watch([searchQuery, selectQuery], () => {
    if (searchQuery.value) {
      filterSets(searchQuery.value)
    } else if (selectQuery.value) {
      filterSets(selectQuery.value)
    }
  })

  watch([currentPage, sets], ([newCurrentPage, updatedSets]) => {
    if (newCurrentPage || updatedSets) {
      getTotal()
      const val = sets.value.slice(from.value - 1, to.value)
      store.commit('profile/updateSetsPerPage', val)
    }
  }, { immediate: true })

  return {
    searchQuery,
    selectQuery,
    setsPerPage,
    filterSets,
    to,
    from,
    currentPage,
    total,
    lastPage,
    handlePrev,
    handleNext
  }
}
