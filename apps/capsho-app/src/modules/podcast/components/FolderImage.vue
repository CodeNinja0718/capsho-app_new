<script setup lang="ts">
import { ref } from 'vue'
import RefreshButton from './RefreshButton.vue'

defineProps({
  element: {
    type: Object
  }
})
const hover = ref(true)
</script>

<template>
  <q-img
    alt=""
    class="cursor-pointer"
    height="200px"
    loading="lazy"
    :src="element?.folderFileUrl ? element.folderFileUrl : 'https://placeimg.com/500/300/nature'"
    width="200px"
    @click="$emit('gotoEpisodes')"
    @mouseleave="hover = false"
    @mouseover="hover = true"
  >
    <div
      class="absolute-top-right"
      :style="`${hover === true ? 'display: block' : 'display: none'}`">
      <RefreshButton
        aria-label="Edit"
        dense
        icon="las la-pen"
        round
        :tooltip="false"
        @click.stop="$emit('editFolder')" />
      <RefreshButton
        aria-label="Delete"
        dense
        icon="las la-trash"
        round
        :tooltip="false"
        @click.stop="$emit('handleDelete')" />
    </div>
    <div
      v-if="element?.placeHolderImg"
      class="absolute-bottom text-caption">
      Placeholder image
    </div>
  </q-img>
</template>

<style lang="scss" scoped>
.q-img__content>div {
    padding: 4px !important;
}
</style>
