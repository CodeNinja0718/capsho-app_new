<template>
  <q-btn-dropdown
    :color="(hovering && hoverColor !== undefined ? hoverColor : $attrs.color)"
    :icon="(hovering && hoverIcon !== undefined ? hoverIcon : $attrs.icon)"
    v-bind="$attrs"
    no-icon
    :outline="(hovering)"
    @mouseout="setHovering(false)"
    @mouseover="setHovering(true)"
  >
    <slot></slot>
  </q-btn-dropdown>
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
    required: false
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
