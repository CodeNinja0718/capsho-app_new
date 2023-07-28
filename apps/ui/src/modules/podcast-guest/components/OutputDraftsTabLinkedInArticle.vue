<script setup lang="ts">
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { computed, onUnmounted } from 'vue'
import { debounce } from 'quasar'
import { htmlSanitizer } from 'src/utils'

const store = useUploadPodcastStore()

const linkedinInArticle = computed({
  get () {
    return store.linkedinTemplate
  },
  set (value: string) {
    store.linkedinTemplate = value
  }
})

const updateLinkedInArticle = debounce(() => {
  const normalArticle = htmlSanitizer(store.linkedinTemplate)
  const data = Object.freeze({
    linkedinTemplate: normalArticle
  })
  if (normalArticle) {
    store.selectedEpisode.linkedinTemplate = normalArticle
    return Promise.resolve(store.updateGuestPodcastEpisode(data))
  }
}, 1000)

async function moveToTheNext () {
  store.linkedinTemplate = linkedinInArticle.value
  await updateLinkedInArticle()
}

onUnmounted(() => {
  Promise.resolve(moveToTheNext())
})
</script>

<template>
  <div>
    <div class="row justify-between q-pb-xs">
      <div class="col-10">
        <label
          v-if="store.showLinkedinArticleSkeleton"
          class="custom-label"
          for="linkedinArticle"
        >
          <span>
            LinkedIn Article is generating - Please wait
          </span>
          <q-spinner-dots
            color="grey-7"
            size="1.2em"
          />
        </label>
        <label
          v-else
          class="custom-label"
          for="linkedinArticle"
        >
          LinkedIn Article
        </label>
      </div>
      <q-space/>
    </div>
    <div>
      <div class="row no-wrap">
        <div class="col-11">
          <!-- <q-skeleton
            v-if="store.showLinkedinArticleSkeleton"
            class="border-radius-6"
            height="70vh"
            square
            type="QInput"
          /> -->
          <AppSkeleton
            v-if="store.showLinkedinArticleSkeleton"
            class="rounded-xl"
            height="70vh"
            width="100%"
          />
          <EditableContent
            v-else
            id="linkedinArticle"
            v-model="linkedinInArticle"
            size="xxl"
            @update:modelValue="moveToTheNext"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.apply-border {
  border: 1px solid rgba(20, 20, 43, 0.3);
  border-radius: 20px;
}
.upgrade-container {
  position: relative;
}
.card-wrapper {
  position: absolute;
  border-radius: 50px;
  width: 100%;
  max-width: 659px;
  margin: 0 auto;
}
.upgrade-card {
  border-radius: 34px;
  margin: 0 auto;
  min-height: 50vh;
  max-height: 80vh;
  &__actions {
    position: absolute;
    left: 0;
    top: -136px;
  }
}
</style>
