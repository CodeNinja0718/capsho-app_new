<script setup>
  import { computed, onBeforeUnmount, ref } from 'vue'
  import UniqueID from '@/utils/uniqueID'
  import { useStore } from 'vuex'

  const $store = useStore()

  const props = defineProps({
    notification: {
      type: Object,
      required: true
    }
  })
  const alertClassType = computed(() => `alert-${props.notification.type}`)


  const timeOutSec = computed(() => {
    if (alertClassType.value !== 'alert-primary') return 3000
    else return 30000
  })

  const timeout = setTimeout(() => {
    $store.dispatch('notifications/removeNotification', props.notification)
  }, timeOutSec.value)

  onBeforeUnmount(() => clearTimeout(timeout))

  const uuid = UniqueID().getID()
  const alertTypes = {
    'alert-primary': {
      container: 'bg-blue-100 dark:bg-blue-200',
      icon: 'text-blue-700 dark:text-blue-800',
      message: 'text-blue-700 dark:text-blue-800',
      button: 'bg-blue-100 text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:bg-blue-200 dark:text-blue-600 dark:hover:bg-blue-300'
    },
    'alert-success': {
      container: 'bg-green-100 dark:bg-green-200',
      icon: 'text-green-700 dark:text-green-800',
      message: 'text-green-700 dark:text-green-800',
      button: 'bg-green-100 text-green-500 focus:ring-green-400 hover:bg-green-200 dark:bg-green-200 dark:text-green-600 dark:hover:bg-green-300'
    },
    'alert-danger': {
      container: 'bg-red-100 dark:bg-red-200',
      icon: 'text-red-700 dark:text-red-800',
      message: 'text-red-700 dark:text-red-800',
      button: 'bg-red-100 text-red-500 focus:ring-red-400 hover:bg-red-200 dark:bg-red-200 dark:text-red-600 dark:hover:bg-red-300'
    },
    'alert-warning': {
      container: 'bg-yellow-100 dark:bg-yellow-200',
      icon: 'text-yellow-700 dark:text-yellow-800',
      message: 'text-yellow-700 dark:text-yellow-800',
      button: 'bg-yellow-100 text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200 dark:bg-yellow-200 dark:text-yellow-600 dark:hover:bg-yellow-300'
    },
    'alert-dark': {
      container: 'bg-gray-100 dark:bg-gray-700',
      icon: 'text-gray-700 dark:text-gray-300',
      message: 'text-gray-700 dark:text-gray-300',
      button: 'bg-gray-100 text-gray-500 focus:ring-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
    }
  }
  let alertState = ref(true)
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="alertState"
      :id="`alert-${uuid}`"
      class="flex mx-2 p-4 mb-4 rounded-lg z-50"
      :class="alertTypes[alertClassType].container"
      role="alert"
    >
      <svg
        class="animate-pulse flex-shrink-0 w-5 h-5"
        :class="alertTypes[alertClassType].icon"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      ><path
        fill-rule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clip-rule="evenodd"
      /></svg>
      <div
        :class="alertTypes[alertClassType].message"
        class="ml-3 text-sm font-medium"
      >
        {{ notification.message }}
      </div>
      <button
        type="button"
        class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8"
        :class="alertTypes[alertClassType].button"
        aria-label="Close"
        @click="alertState = !alertState"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        /></svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
