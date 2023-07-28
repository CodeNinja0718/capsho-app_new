<script setup>
import { RouterLink } from 'vue-router'
import { useAttrs } from 'vue'

const props = defineProps({
  ...RouterLink.props
})

const attrs = useAttrs()
</script>

<template>
  <router-link
    :aria-label="props.name"
    :to="props"
    v-bind="attrs"
  >
    <slot />
  </router-link>
</template>
