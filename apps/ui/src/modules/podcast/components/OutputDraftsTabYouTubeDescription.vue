<script setup lang="ts">
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import TheEditor from 'src/modules/editor/TheEditor.vue'
import { computed, onUnmounted, ref } from 'vue'
import { debounce } from 'quasar'
import { htmlSanitizer } from 'src/utils'
import { useContentFiller } from 'src/composables/useContentFiller'
import { useSubscription } from 'src/composables/useSubscription'
import { useTemplatesStore } from 'src/stores/templates'
import { useUploadPodcastStore } from 'stores/upload-podcast'

const store = useUploadPodcastStore()
const { allowYouTubeDescription, interval } = useSubscription()

const templatesStore = useTemplatesStore()
const templates = computed(() => templatesStore.templates.filter((template) => template.type === 'ytDescriptionLayout'))

const pickedTemplateIndex = ref(-2)
const { setContentChooser } = useContentFiller()

const isYtLayoutPicked = computed(() => {
  if (store.selectedEpisode.layouts) {
    return store.selectedEpisode.layouts.isYtPicked
  }
  return false
})

const youtubeTemplate = computed({
  get () {
    return store.youtubeTemplate || store.selectedEpisode.youtubeTemplate || ''
  },
  set (value: string) {
    store.youtubeTemplate = value
  }
})

const updateYouTubeDescription = debounce(() => {
  const getTemplate = () => {
    if (youtubeTemplate.value) {
      return htmlSanitizer(youtubeTemplate.value)
    } else {
      return ''
    }
  }
  const template = getTemplate()
  const data = {
    youtubeTemplate: template
  }
  if (template === '') {
    return null
  } else {
    store.selectedEpisode.youtubeTemplate = template
    return Promise.resolve(store.updatePodcastEpisode(data))
  }
}, 1000)

async function moveToNextTab () {
  store.youtubeTemplate = youtubeTemplate.value
  await updateYouTubeDescription()
}

onUnmounted(() => {
  Promise.resolve(moveToNextTab())
})

const getStyleForAppCard = computed<string>(() => {
  const background = true
  const border = true
  const minHeight = '200px'
  let properties = background ? 'background: #FCFCFC;' : 'background: none;'
  properties = properties + (border ? 'border: 3px solid #FBDFB3;' : 'border: none;') + (minHeight ? `min-height:${minHeight}` : '')
  return properties
})

const sampleTemplate = 'Marco Phila, a professor of advanced programming, explains the difference between functional and nonfunctional requirements of good software on the Codish podcast, hosted by Heroic Heroku.<br />  <br />  <strong>In this video, you will learn:</strong><br />  1. The difference between functional and nonfunctional requirements of good software, and the trade-offs between different code qualities.<br />2. How to refactor code according to different qualities (e.g. performance, memory footprint, readability).<br />3. How to stay flexible and relevant in the industry, and how to read good code.<br /><br />  <strong>Resources:</strong><br />  [Insert any lead magnet/CTA links here]  <br /><br />  <strong>Connect with me:</strong><br />  <br />Loved this episode? Leave us a review and rating here: {LINK}<br /><br />  <strong>Here is an overview of everything in this video:</strong><br />  [00:00:02] - Marco Phila is a professor of advanced programming and author of Seriously Good Software.<br /><br />[00:05:34] - Professor of advanced programming mixes and matches different topics to give students a broader perspective on different topics.<br /><br />[00:11:55] - Marco has written a book about his experience teaching computer science and engineering students.<br /><br />'

const buildFromTemplate = (tempIndex: number) => {
  pickedTemplateIndex.value = tempIndex
  store.selectedEpisode.layouts.isYtPicked = true
  store.updatePodcastEpisode({
    layouts: {
      isYtPicked: true
    }
  })
  setContentChooser('YouTube Description')
}
</script>

<template>
  <div v-if="allowYouTubeDescription">
    <div
      v-if="isYtLayoutPicked"
      class="row no-wrap"
    >
      <div class="col-11">
        <app-skeleton
          v-if="store.showYoutubeDescriptionSkeleton"
          class="rounded-xl"
          height="70vh"
          width="100%"
        />
        <the-editor
          v-model="youtubeTemplate"
          @update:modelValue="moveToNextTab"
        />
      </div>
    </div>
    <div v-else>
      <div
        v-if="pickedTemplateIndex === -2"
        class="flex justify-center items-center full-height pb-24 overflow-y-auto"
      >
        <div class="w-full grid grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-24 gap-y-12 px-6 lg:px-12">
          <p class="col-span-3 text-white text-h4 font-black text-center">Choose a template or build your YouTube Description from scratch</p>
          <div
            class="col-span-1 flex flex-col items-center gap-4"
            @click="buildFromTemplate(-1)"
          >
            <q-card class="rounded-xl w-full h-44 bg-darkish cursor-pointer">
              <div class="w-full h-full flex justify-center items-center">
                <q-icon
                  color="black"
                  name="add"
                  size="4rem"
                />
              </div>
            </q-card>
            <p class="text-white text-lg font-bold text-center">Build from scratch</p>
          </div>
          <div
            v-for="(blogTemplate, id) in templates"
            v-bind:key="id"
            class="col-span-1 flex flex-col items-center"
            @click="buildFromTemplate(id)"
          >
            <q-card
              class="rounded-xl w-full h-44 cursor-pointer"
              :class="blogTemplate.createdAt"
            />
            <p class="text-white text-lg font-bold mt-4 text-center">{{ blogTemplate.title }}</p>
            <p class="text-white text-sm text-center">Used by us, created by {{ blogTemplate.creator.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="upgrade-container row no-wrap">
      <div class="col-11">
        <editable-content
          id="youtube"
          v-model="sampleTemplate"
          mode="blur"
          readonly
          size="xxl"
        />
      </div>
      <div class="card-wrapper absolute-center bg-white q-pa-lg">
        <q-card
          class="upgrade-card row items-center inter-regular full-width"
          flat
          :style="getStyleForAppCard"
        >
          <q-card-section class="col-12">
            <div class="column items-center q-gutter-y-md">
              <div class="text-center inter-medium text-weight-medium text-body1">
                Unlock YouTube Descriptions for future episodes by<br>
                upgrading to the Pro Plan or Capsho Collective!
              </div>
              <q-btn
                v-if="interval === 'month'"
                class="text-accent lexend-bold"
                flat
                label="Upgrade Now"
                no-caps
                :to="{ name: 'PickAPlan' }"
              />
              <a
                v-else
                class="q-btn q-btn-item non-selectable q-btn--no-uppercase q-btn--flat no-outline cursor-pointer border-radius-10 text-accent lexend-bold"
                href="https://direct.lc.chat/14490672/"
                style="padding: 10px 38px; text-decoration: none;"
                target="_blank"
              >
                Chat With Us To Upgrade Now
              </a>
            </div>
          </q-card-section>
        </q-card>
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
