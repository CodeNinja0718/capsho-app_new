<script setup lang="ts">
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { htmlSanitizer } from 'src/utils'
import { debounce } from 'quasar'
import { useSubscription } from 'src/composables/useSubscription'
import type { ICaptionOption } from 'src/models/caption'
import OutputDraftsTabCaptionMessage from 'src/modules/podcast/components/OutputDraftsTabCaptionMessage.vue'

const { allowCaptions, interval } = useSubscription()

const store = useUploadPodcastStore()
const showSaveCaptionButton = ref(false)

const isBlogPostSeoQuestionPicked = computed(() => {
  if (store.blogTemplate) {
    return true
  }
  return store.isBlogPostSeoQuestionPicked
})

function delayOnBlur() {
  setTimeout(() => {
    showSaveCaptionButton.value = false
  }, 200)
}

const captionType = ref<ICaptionOption>({
  default: true,
  disable: false,
  label: 'Promotion',
  tooltip: '',
  value: 'promotion'
})
const pattern = /background-color: #e8e8e8; border: 1px solid #0000001f;/g
const captionTemplate = computed<string>({
  get() {
    const key = captionType.value.value
    if (store.allCaptionsGuest && store.allCaptionsGuest.twitter && Object.keys(store.allCaptionsGuest.twitter).length) {
      return store.allCaptionsGuest.twitter[key].replace(pattern, 'border: 1px solid #9e9e9e;')
    }
    return ''
  },
  set(value: string) {
    const key = captionType.value.value
    store.allCaptionsGuest.twitter[key] = htmlSanitizer(value)
  }
})

const updateCaptions = debounce(() => {
  const key = captionType.value.value
  const data = {
    allCaptionsGuest: {
      twitter: {
        [key]: captionTemplate.value
      }
    }
  }
  if (captionTemplate.value) {
    return Promise.resolve(store.updatePodcastEpisode(data))
  }
}, 500)

const updating = ref(false)

watch(captionType, (key) => {
  updating.value = true
  if (key) {
    updateCaptions()
  }
  const timer = setTimeout(() => {
    updating.value = false
    clearTimeout(timer)
  }, 500)
}, { immediate: true })

async function saveCaption() {
  await updateCaptions()
}

onBeforeUnmount(() => {
  Promise.resolve(saveCaption())
})

const getStyleForAppCard = computed<string>(() => {
  const background = true
  const border = true
  const minHeight = '200px'
  let properties = background ? 'background: #FCFCFC;' : 'background: none;'
  properties = properties + (border ? 'border: 3px solid #FBDFB3;' : 'border: none;') + (minHeight ? `min-height:${minHeight}` : '')
  return properties
})
const sampleCaption = 'Check out the new episode of featuring Chris Diaz discussing how he achieved success as a college graduate and entrepreneur!'
</script>

<template>
  <div class="">
    <div class="row justify-between q-pb-xs">
      <div class="col-11">
        <div>
          <label
            v-if="store.showSocialMediaSkeleton || updating"
            class="custom-label"
            for="twitterCaption"
          >
            <span>
              Twitter Caption is generating - Please wait
            </span>
            <q-spinner-dots
              color="grey-7"
              size="1.2em"
            />
          </label>
          <label
            v-else
            class="custom-label"
            for="twitterCaption"
          >
            Twitter Caption
          </label>
        </div>
      </div>
    </div>

    <div v-if="allowCaptions">
      <div
        v-if="!isBlogPostSeoQuestionPicked && captionType.value === 'educational'"
        class="row"
      >
        <OutputDraftsTabCaptionMessage />
      </div>
      <div
        v-else
        class="row"
      >
        <div class="col-11">
          <!-- <q-skeleton
            v-if="store.showSocialMediaSkeleton || updating"
            class="border-radius-6"
            height="63vh"
            square
            type="QInput"
          /> -->
          <AppSkeleton
            v-if="store.showSocialMediaSkeleton || updating"
            class="rounded-xl"
            height="63vh"
            width="100%"
          />
          <EditableContent
            v-else
            id="twitterCaption"
            v-model="captionTemplate"
            size="xll"
            @blur="delayOnBlur"
            @focus="showSaveCaptionButton = true"
            @update:modelValue="saveCaption"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <div class="upgrade-container row no-wrap">
        <div class="col-11">
          <EditableContent
            v-model="sampleCaption"
            mode="blur"
            readonly
            size="lg"
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
                  Unlock Social Media Captions for future episodes by<br>
                  upgrading to the Growth Plan, Pro Plan or Capsho Collective!
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
  </div>
</template>
