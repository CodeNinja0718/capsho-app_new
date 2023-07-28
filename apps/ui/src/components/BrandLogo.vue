<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { useAuthStore } from 'stores/auth-store'

const router = useRouter()
const authStore = useAuthStore()
const uploadPodcastStore = useUploadPodcastStore()

const routeName = computed(() => {
  if (authStore.user && authStore.user.isLoggedIn) {
    return authStore.userType === 'guest' ? 'DefaultPodcastGuest' : 'PodcastFolders'
  }
  return 'Home'
})

const props = defineProps({
  size: {
    type: String,
    required: false,
    default: 'xl',
    validator (value: string) {
      return [
        'sm',
        'md',
        'lg',
        'xl'
      ].includes(value)
    }
  },
  color: {
    type: String,
    required: false,
    default: 'white',
    validator (value: string) {
      return [
        'purple',
        'white'
      ].includes(value)
    }
  },
  label: {
    type: String,
    required: false,
    default: ''
  }
})

const logoSizeClass = computed(() => {
  switch (props.size) {
  case 'sm':
    return 'w-12 h-8'
  case 'md':
    return 'w-16 h-12'
  case 'lg':
    return 'w-20 h-16'
  case 'xl':
    return 'w-24 h-20'
  default:
    return 'w-28 h-24'
  }
})

const labelSizeClass = computed(() => {
  switch (props.size) {
  case 'sm':
    return 'text-lg'
  case 'md':
    return 'text-xl'
  case 'lg':
    return 'text-2xl'
  case 'xl':
    return 'text-3xl'
  default:
    return 'text-xl'
  }
})

const logoClickHandler = () => {
  router.push({ name: routeName.value })
  uploadPodcastStore.resetProcessStep()
}
</script>

<template>
  <div
    class="flex items-center justify-center cursor-pointer gap-4"
    @click="logoClickHandler"
  >
    <q-img
      v-if="props.color === 'white'"
      :class="logoSizeClass"
      fit="scale-down"
      src="~assets/logo/capsho-logo.png"
    >
      <template #loading>
      </template>
    </q-img>
    <q-img
      v-else-if="props.color === 'purple'"
      :class="logoSizeClass"
      fit="scale-down"
      src="~assets/logo/capsho-logo.png"
    >
      <template #loading>
      </template>
    </q-img>
    <span
      v-if="label"
      :class="labelSizeClass"
    >{{ label }}</span>
  </div>
</template>
