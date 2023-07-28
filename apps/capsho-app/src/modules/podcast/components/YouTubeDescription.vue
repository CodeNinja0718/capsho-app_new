<script setup lang="ts">
import ContentGenerationCard from 'src/modules/podcast/components/EpisodeDraftsNavCard.vue'
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { computed, onUnmounted } from 'vue'
import { debounce } from 'quasar'
import { htmlSanitizer } from 'src/utils'
import { useSubscription } from 'src/composables/useSubscription'

const store = useUploadPodcastStore()
const { allowYouTubeDescription, interval } = useSubscription()

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
    return Promise.resolve(store.updatePodcastEpisode(data))
  }
}, 1000)

async function moveToTheNext () {
  store.youtubeTemplate = youtubeTemplate.value
  await updateYouTubeDescription()
}

onUnmounted(() => {
  Promise.resolve(moveToTheNext())
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
</script>

<template>
  <ContentGenerationCard>
    <template #body>
      <div>
        <div class="row justify-between  mt-58">
          <div class="col-10">
            <div
              v-if="store.showYoutubeDescriptionSkeleton"
              class="custom-label"
            >
              <span>
                YouTube Description is generating - Please wait
              </span>
              <q-spinner-dots
                color="grey-7"
                size="1.2em"
              />
            </div>
            <label
              v-else
              class="custom-label"
            >
              YouTube Description
            </label>
          </div>
          <q-space/>
        </div>
        <div v-if="allowYouTubeDescription">
          <div class="row no-wrap">
            <div class="col-11">
              <q-skeleton
                v-if="store.showYoutubeDescriptionSkeleton"
                height="75vh"
                square
                type="QInput"
              />
              <EditableContent
                v-else
                v-model="youtubeTemplate"
                content-class="monserrat-regular text-body1"
                size="xxl"
                @update:modelValue="moveToTheNext"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="upgrade-container">
            <EditableContent
              v-model="sampleTemplate"
              content-class="monserrat-regular text-body1 blurred-text non-selectable"
              readonly
              size="xxl"
            />
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
                      class="text-accent lexend-deca-bold"
                      flat
                      label="Upgrade Now"
                      no-caps
                      :to="{ name: 'PickAPlan' }"
                    />
                    <a
                      v-else
                      class="q-btn q-btn-item non-selectable q-btn--no-uppercase q-btn--flat no-outline cursor-pointer border-radius-10 text-accent lexend-deca-bold"
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
  </ContentGenerationCard>
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
