<template>
  <q-btn
    :color="(hovering && hoverColor !== undefined ? hoverColor : $attrs.color)"
    :icon="(hovering && hoverIcon !== undefined ? hoverIcon : $attrs.icon)"
    :outline="(hovering)"
    v-bind="$attrs"
    @mouseout="setHovering(false)"
    @mouseover="setHovering(true)"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hovering = ref(false)
function setHovering (tf: boolean) {
  hovering.value = tf
}
defineProps({
  hoverColor: {
    type: String,
    required: false,
    default: 'accent-custom'
  },
  hoverIcon: {
    type: String,
    required: false
  }
})
</script>

<style lang="css">
body.desktop .q-hoverable:hover .q-focus-helper {
  background: inherit;
  opacity: 0;
}
</style>
