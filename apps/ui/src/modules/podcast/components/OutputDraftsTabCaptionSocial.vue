<script setup lang="ts">
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { htmlSanitizer } from 'src/utils'
import { debounce } from 'quasar'
import { useSubscription } from 'src/composables/useSubscription'
import type { ICaptionOption } from 'src/models/caption'
import OutputDraftsTabCaptionMessage from 'src/modules/podcast/components/OutputDraftsTabCaptionMessage.vue'
import { useCaptionOption } from 'src/modules/podcast/components/captions/caption-options'

const { allowCaptions, interval } = useSubscription()

const { options } = useCaptionOption()

const store = useUploadPodcastStore()
const showSaveCaptionButton = ref(false)

const isBlogPostSeoQuestionPicked = computed(() => {
  if (store.blogTemplate) {
    return true
  }
  return store.isBlogPostSeoQuestionPicked
})

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
    if (store.allCaptions && store.allCaptions.facebook && Object.keys(store.allCaptions.facebook).length) {
      return store.allCaptions.facebook[key].replace(pattern, 'border: 1px solid #9e9e9e;')
    }
    return ''
  },
  set(value: string) {
    const key = captionType.value.value
    store.allCaptions.facebook[key] = htmlSanitizer(value)
  }
})

function delayOnBlur() {
  setTimeout(() => {
    showSaveCaptionButton.value = false
  }, 200)
}

const updateCaptions = debounce(() => {
  const key = captionType.value.value
  const data = {
    allCaptions: {
      facebook: {
        [key]: captionTemplate.value
      }
    }
  }
  if (captionTemplate.value) {
    store.selectedEpisode.allCaptions.facebook[key] = captionTemplate.value
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

const sampleCaption = 'Do you feel like you\'re not good enough for lasting, fulfilling relationships?' +
  'Maybe you\'ve been told to just "be yourself" or "work on yourself" and it\'s just not working.' +
  'If that sounds familiar, this episode is for you. Kimi Avery will show you how to<br/><br/>' +
  'In this week\'s episode featuring Kimi Avery, I cover:<br/>' +
  '1. The different ways that men and women are motivated<br>' +
  '2. The importance of communication in relationships<br>' +
  '3. The challenges faced by women in male-dominated industries<br><br/>' +
  'Listen at the link in bio / comments'
</script>

<template>
  <div class="">
    <div class="row justify-between q-pb-xs">
      <div class="col-11">
        <div>
          <label
            v-if="store.showSocialMediaSkeleton || updating"
            class="custom-label"
            for="socialCaption"
          >
            <span>
              Facebook/Instagram Caption is generating - Please wait
            </span>
            <q-spinner-dots
              color="grey-7"
              size="1.2em"
            />
          </label>
          <label
            v-else
            class="custom-label"
            for="socialCaption"
          >
            Facebook/Instagram Caption
          </label>
        </div>
        <div class="full-width">
          <q-select
            v-model="captionType"
            color="purple"
            dense
            filled
            :options="options"
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                class="bg-darkish text-grey-3"
              >
                <div class="row no-wrap items-center">
                  <span>{{ scope.opt.label }}</span>
                  <span class="q-pl-sm">
                    <q-badge
                      v-if="scope.opt.isPro"
                      color="green"
                      label="Pro"
                      rounded
                    />
                  </span>
                </div>
              </q-item>
            </template>
            <template v-slot:selected>
              <div class="row no-wrap items-center">
                <span class="text-grey-3">{{ captionType.label }}</span>
                <span class="q-pl-sm">
                  <q-badge
                    v-if="captionType.isBeta"
                    color="green"
                    label="Beta"
                    rounded
                  />
                </span>
              </div>
            </template>
          </q-select>
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
            id="socialCaption"
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
