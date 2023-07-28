<script setup>
  import { usePagination } from '../../composables/usePagination'

  const { from, to, total, handleNext, handlePrev } = usePagination()
</script>

<template>
  <div class="flex flex-row w-full justify-between items-center">
    <!-- Help text -->
    <span class="text-sm text-gray-700 dark:text-gray-400">
      Showing
      <span class="font-semibold text-gray-900 dark:text-white">{{ from }}</span>
      to <span class="font-semibold text-gray-900 dark:text-white">{{ to }}</span>
      of <span class="font-semibold text-gray-900 dark:text-white">{{ total }}</span> Entries
    </span>
    <div class="inline-flex xs:mt-0">
      <!-- Buttons -->
      <button
        class="inline-flex items-center py-2 px-4 rounded-l text-sm font-medium hover:bg-indigo-50"
        @click="handlePrev"
      >
        <svg
          class="mr-2 w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
          clip-rule="evenodd"
        /></svg>
        Prev
      </button>
      <button
        class="inline-flex items-center py-2 px-4 rounded-r text-sm font-medium hover:bg-indigo-50"
        @click="handleNext"
      >
        Next
        <svg
          class="ml-2 w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
          clip-rule="evenodd"
        /></svg>
      </button>
    </div>
  </div>
</template>
