<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
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
const containerSizes: ContainerSize = {
  sm: 'max-height: 60vh; width: 40vw;',
  md: 'max-height: 80vh; width: 60vw; ',
  lg: 'max-height: 80vh; width: 80vw;',
  xl: 'max-height: 80vh; width: 90vw;'
}
const getStyle = computed<string>(() => {
  const size: string = props.size
  return containerSizes[size]
})
const getInnerStyle = computed<string>(() => {
  const styles: ContainerSize = {
    md: 'max-width:417px',
    lg: 'max-width:730px',
    xl: 'max-width: 835px;'
  }
  const innerSize: string = props.innerSize
  return styles[innerSize]
})
</script>

<template>
  <div
    class="outer q-pa-lg flex flex-center"
    :style="getStyle">
    <q-card
      class="auth-card row items-center inter-regular full-width"
      flat>
      <q-card-section class="col-12">
        <div class="q-px-md auth-card__actions">
          <slot name="actions"></slot>
        </div>
        <div class="q-pb-lg">
          <slot name="header"></slot>
          <h1 class="text-h5 text-weight-bold text-center">{{ title }}</h1>
        </div>
        <div
          class="inner"
          :style="getInnerStyle">
          <slot name="body"></slot>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.outer {
  background: #FCFCFC;
  border-radius: 50px;
  width: 100%;
  margin: 0 auto;
}

.inner {
  margin: 0 auto;
}

.auth-card {
  border: 3px solid #FBDFB3;
  border-radius: 34px;
  margin: 0 auto;
  min-height: 60vh;
  &__actions {
    position: absolute;
    left: 0;
    top: -136px;
  }
}
</style>
