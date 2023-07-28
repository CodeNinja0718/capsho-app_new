<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  dark: {
    type: Boolean,
    required: false,
    default: true
  },
  width: {
    type: String,
    required: false,
    default: '10rem',
    validator (value: string) {
      const cssUnitPattern = /^(-?(\d*\.)?\d+)((px)|(em)|(%)|(rem)|(vw)|(vh)|(vmin)|(vmax))$/gm
      return cssUnitPattern.test(value)
    }
  },
  height: {
    type: String,
    required: false,
    default: '10rem',
    validator (value: string) {
      const cssUnitPattern = /^(-?(\d*\.)?\d+)((px)|(em)|(%)|(rem)|(vw)|(vh)|(vmin)|(vmax))$/gm
      return cssUnitPattern.test(value)
    }
  },
  class: {
    type: String,
    required: false,
    default: ''
  },
  type: {
    type: String as PropType<'text' | 'rect' | 'circle' | 'QBtn' | 'QBadge' | 'QChip' | 'QToolbar' | 'QCheckbox' | 'QRadio' | 'QToggle' | 'QSlider' | 'QRange' | 'QInput' | 'QAvatar'>,
    required: false,
    default: 'rect',
    validator (value: string) {
      return [
        'text',
        'rect',
        'circle',
        'QBtn',
        'QBadge',
        'QChip',
        'QToolbar',
        'QCheckbox',
        'QRadio',
        'QToggle',
        'QSlider',
        'QRange',
        'QInput',
        'QAvatar'
      ].includes(value)
    }
  }
})
</script>

<template>
  <q-skeleton
    v-bind="$attrs"
    class="bg-gray-50 bg-opacity-10"
    :class="props.class"
    :dark="props.dark"
    :height="props.height"
    :type="props.type"
    :width="props.width"
  />
</template>
