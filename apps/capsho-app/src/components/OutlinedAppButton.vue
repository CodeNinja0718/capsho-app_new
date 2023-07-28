<template>
  <q-btn
    :color="(hovering && hoverColor !== undefined ? hoverColor : $attrs.color)"
    :icon="(hovering && hoverIcon !== undefined ? hoverIcon : $attrs.icon)"
    :outline="!(hovering)"
    v-bind="$attrs"
    @mouseout="setHovering(false)"
    @mouseover="setHovering(true)"
  >
    <q-tooltip
      v-if="tooltip"
      class="text-body2 q-pa-md text-accent rounded-borders"
      max-width="15vw"
      style="background-color: #EAE8FF;"
    >
      <slot name="tooltip"></slot>
    </q-tooltip>
  </q-btn>
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
  },
  tooltip: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="css">
body.desktop .q-hoverable:hover .q-focus-helper {
  background: inherit;
  opacity: 0;
}
</style>
