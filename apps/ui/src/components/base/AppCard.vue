<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  title: String,
  size: {
    type: String,
    required: false,
    default: 'md',
    validator (value: string) {
      return [
        'xs',
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
  },
  background: {
    type: Boolean,
    required: false,
    default: true
  },
  border: {
    type: Boolean,
    required: false,
    default: true
  },
  minHeight: {
    required: false
  }
})
interface ContainerSize {
  [key: string]: string,
}

const containerSizes: ContainerSize = {
  xs: 'max-height: 292px; width: 359px;',
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
    sm: 'max-width: 218px;',
    md: 'max-width: 417px;',
    lg: 'max-width: 638px;',
    xl: 'max-width: 835px;'
  }
  const innerSize: string = props.innerSize
  return styles[innerSize]
})
</script>

<template>
  <div
    :class="background ? 'flex flex-center q-pa-lg bg-background-any-box-popup text-text' : 'flex flex-center q-pa-lg bg-background-any-box-popup text-text'"
    :style="getStyle"
  >
    <q-card
      class="row items-center poppins-regular full-width bg-background-any-box-popup"
      flat>
      <q-card-section class="col-12">
        <div class="q-px-md app-card__actions">
          <slot name="actions"></slot>
        </div>
        <div class="q-pb-md">
          <slot name="header"></slot>
          <h1 class="text-h4 text-weight-medium text-center text-capitalize">{{ title }}</h1>
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
.background {
    background: #FCFCFC;
  //background-color: #dbc9ea;
}
.inner {
  margin: 0 auto;
}
.app-card {
  border-radius: 34px;
  margin: 0 auto;
  min-height: 50vh;
  max-height: 80vh;
  //background-color: #dbc9ea;
  &__actions {
    position: absolute;
    left: 0;
    top: -136px;
  }
}
</style>
