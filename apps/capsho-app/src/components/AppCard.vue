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
const getStyleForAppCard = computed<string>(() => {
  const background = props.background
  const border = props.border
  const minHeight = props.minHeight
  let properties = background ? 'background: #FCFCFC;' : 'background: none;'
  properties = properties + (border ? 'border: 3px solid #FBDFB3;' : 'border: none;') + (minHeight ? `min-height:${minHeight}` : '')
  return properties
})
</script>

<template>
  <div
    :class="background ? 'outer flex flex-center q-pa-lg background' : 'outer flex flex-center q-pa-lg'"
    :style="getStyle"
  >
    <q-card
      class="app-card row items-center poppins-regular text-darkish full-width"
      flat
      :style="getStyleForAppCard">
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
.outer {
  border-radius: 50px;
  width: 100%;
  margin: 0 auto;
}
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
  background-color: #dbc9ea;
  &__actions {
    position: absolute;
    left: 0;
    top: -136px;
  }
}
</style>
