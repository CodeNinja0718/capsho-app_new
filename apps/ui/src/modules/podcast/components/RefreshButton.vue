<template>
  <q-btn
    class="text-weight-bold refresh-button"
    :color="color"
    flat
    :icon="(hovering && hoverIcon !== undefined ? hoverIcon : $attrs.icon)"
    size="md"
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
import { computed, ref } from 'vue'

const hovering = ref(false)
defineProps({
  tooltip: {
    type: Boolean,
    default: false
  },
  hoverIcon: {
    type: String,
    required: false
  }
})
const color = computed(() => hovering.value ? 'orange' : 'grey')
function setHovering (tf: boolean) {
  hovering.value = tf
}
</script>
