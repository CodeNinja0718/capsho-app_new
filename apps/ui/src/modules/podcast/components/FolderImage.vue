<script setup lang="ts">
import { computed, ref } from 'vue'

defineProps({
  element: {
    type: Object
  }
})
const hover = ref(true)
const episodeProcessingCount = computed(() => {
  return 4
})
</script>

<template>
  <q-img
    alt=""
    class="cursor-pointer folder-img w-full h-[240px]"
    loading="lazy"
    :src="element?.folderFileUrl ? element.folderFileUrl : '~assets/logo.png'"
    @click="$emit('gotoEpisodes')"
    @mouseleave="hover = false"
    @mouseover="hover = true"
  >
    <q-badge
      class="badge-number"
      :class="episodeProcessingCount > 0 ? 'invisible' : 'invisible'"
      color="red"
      rounded
    >{{ episodeProcessingCount }}</q-badge>
    <div class="folder-caption flex items-center gap-2">
      <p class="text-xl font-semibold mb-0">{{ element?.podcastName }}</p>
      <q-img
        alt=""
        class="w-5"
        src="~src/assets/icons/edit.svg"
        @click.stop="$emit('editFolder')"
      />
    </div>
  </q-img>
</template>

<style lang="scss" scoped>
.q-img__content>div {
    padding: 4px !important;
}
.folder-img{
  border-radius: 15px;
  box-shadow: 0 0 10px transparent;
  transition: 0.3s;
  overflow: hidden;
  cursor: pointer;
  &:hover{
    box-shadow: 0 0 10px grey;
  }
  .badge-number{
    top: -20px;
    right: -20px;
    font-size: 30px;
    padding: 10px;
    width: 55px;
    height: 55px;
    justify-content: center;
    border: 6px solid $dark;
  }
  .folder-caption{
    width:100%;
    height: 50px;
    bottom: 0;
    padding: 0 10px;
    background: $secondary-dark;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    border-radius: 0 0 15px 15px;
  }
  .folder-action{
    bottom: 5px;
    right: 5px;
    background: transparent !important;
  }
}
</style>
