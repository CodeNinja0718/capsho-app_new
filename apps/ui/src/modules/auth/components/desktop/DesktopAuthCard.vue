<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  class: {
    type: String,
    required: false,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: false,
    default: 'sm',
    validator (value: string) {
      return [
        'sm',
        'md',
        'lg',
        'xl'
      ].includes(value)
    }
  },
  innerSize: {
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
  }
})
interface ContainerSize {
  [key: string]: string,
}
// const containerSizes: ContainerSize = {
//   sm: 'max-height: 60vh; width: 40vw;',
//   md: 'max-height: 80vh; width: 60vw; ',
//   lg: 'max-height: 80vh; width: 80vw;',
//   xl: 'max-height: 80vh; width: 90vw;'
// }
// const getStyle = computed<string>(() => {
//   const size: string = props.size
//   return containerSizes[size]
// })
const getInnerStyle = computed<string>(() => {
  const styles: ContainerSize = {
    md: 'max-width: 768px',
    lg: 'max-width: 1024px',
    xl: 'max-width: 1440px;'
  }
  const innerSize: string = props.innerSize
  return styles[innerSize]
})
</script>

<template>
  <q-card
    class="row items-center inter-regular full-width bg-dialog-dark rounded-[40px] py-4 md:py-6 lg:py-8 xl:py-10 px-4 md:px-8 lg:px-12 xl:px-16"
    :class="props.class"
    flat
  >
    <q-card-section class="col-12">
      <div class="q-px-md auth-card__actions">
        <slot name="actions"></slot>
      </div>
      <div class="pb-10">
        <slot name="header"></slot>
        <h1 class="font-semibold  text-left text-4xl">{{ title }}</h1>
      </div>
      <div
        class="w-full grid grid-cols-12"
        :style="getInnerStyle">
        <slot name="body"></slot>
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
</style>
