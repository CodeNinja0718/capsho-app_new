<script setup lang="ts">
import { computed } from 'vue'
import { useUploadPodcastStore } from '../stores/upload-podcast'
import { useAuthStore } from 'stores/auth-store'

const authStore = useAuthStore()
const store = useUploadPodcastStore()

const routeName = computed(() => {
  return authStore.user?.isLoggedIn ? 'PodcastFolders' : 'Home'
})

const props = defineProps({
  size: {
    type: String,
    required: false,
    default: 'md',
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
    default: 'purple',
    validator (value: string) {
      return [
        'purple',
        'white'
      ].includes(value)
    }
  }
})

interface LogoSize {
  [key: string]: string,
}
const logoSizes: LogoSize = {
  sm: 'height: 40px; width: 80px',
  md: 'height: 50px; width: 110px',
  lg: 'height: 80px; width: 160px',
  xl: 'height: 100px; width: 220px'
}
interface LogoColor {
  [key: string]: string,
}
const logoColors: LogoColor = {
  purple: require('../assets/logo/logo-purple.png'),
  white: require('../assets/logo/logo-white.svg')
}
const getStyle = computed<string>(() => {
  const size: string = props.size
  return logoSizes[size]
})
const getLogo = computed<string>(() => {
  const size: string = props.color
  return logoColors[size]
})
</script>

<template>
  <div class="full-width">
    <router-link
      :to="{ name: routeName }"
      @click="store.resetProcessStep">
      <q-img
        fit="scale-down"
        :src="getLogo"
        :style="getStyle"
      >
        <template #loading>
        </template>
      </q-img>
    </router-link>
  </div>
</template>
