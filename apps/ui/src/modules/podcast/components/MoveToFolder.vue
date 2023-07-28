<template>
  <AppCard
    inner-size="sm"
    minHeight="20vh"
    size="sm">
    <template #body>
      <div class="text text-text">
        Where do you want to move this episode to?
      </div>
      <div class="q-mt-md">
        <q-select
          v-model="folder"
          class="border-radius-10 q-mb-sm"
          dense
          label="Save to folder..."
          name="podcastName"
          option-label="podcastName"
          option-value="id"
          :options="folderStore.documents"
          outlined
          @update:modelValue="selectFolder"
        />
      </div>
      <div style="display: flex;justify-content: center;margin-top: 40px;">
        <AppButton
          v-close-popup
          color="accent-custom"
          hoverColor="white"
          label="Move"
          padding="6px 36px"
          rounded
          style="font-size: 12px;"
          @click="$emit('confirmMove',store.folder)"
        />
      </div>
    </template>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from 'components/base/AppCard.vue'
import AppButton from 'components/base/AppButton.vue'
import { useFolderStore } from 'src/stores/folder-store'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { ref } from 'vue'

const folder = ref(null)
const folderStore = useFolderStore()
const store = useUploadPodcastStore()

function selectFolder({ id }: { id: string }) {
  store.folder = id
}
</script>
<style lang="scss" scoped>
.text{
  font-family: 'Inter',sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  text-align: center;
  font-feature-settings: 'salt' on, 'liga' off;
}
</style>
