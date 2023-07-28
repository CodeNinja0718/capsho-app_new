<script setup lang="ts">
import OnboardTour from 'src/components/OnboardTour.vue'
import blackBackClosedEnvelopShape from 'src/assets/icons/black-back-closed-envelope-shape.svg'
import blackBackClosedEnvelopShapelight from 'src/assets/icons/black-back-closed-envelope-shapelight.svg'
import chat from 'src/assets/icons/chat.svg'
import chatlight from 'src/assets/icons/chatlight.svg'
import drawing from 'src/assets/icons/drawing.svg'
import drawinglight from 'src/assets/icons/drawinglight.svg'
import linkedin2 from 'src/assets/icons/linkedin (2).svg'
import linkedin2light from 'src/assets/icons/linkedin (2)light.svg'
import note from 'src/assets/icons/note.svg'
import notelight from 'src/assets/icons/notelight.svg'
import quoteLeft from 'src/assets/icons/quote-left.svg'
import quoteLeftlight from 'src/assets/icons/quote-leftlight.svg'
import title2 from 'src/assets/icons/title (2).svg'
import title2light from 'src/assets/icons/title (2)-light.svg'
import transcription from 'src/assets/icons/transcription.svg'
import transcriptionlight from 'src/assets/icons/transcriptionlight.svg'
import youtube1 from 'src/assets/icons/youtube (1).svg'
import youtube1light from 'src/assets/icons/youtube (1)light.svg'
import blackBackClosedEnvelopShapeActive from 'src/assets/icons/black-back-closed-envelope-shape-active.svg'
import blackBackClosedEnvelopShapelightActive from 'src/assets/icons/black-back-closed-envelope-shapelight-active.svg'
import chatActive from 'src/assets/icons/chat-active.svg'
import chatlightActive from 'src/assets/icons/chatlight-active.svg'
import drawingActive from 'src/assets/icons/drawing-active.svg'
import drawinglightActive from 'src/assets/icons/drawinglight-active.svg'
import linkedin2Active from 'src/assets/icons/linkedin (2)-active.svg'
import linkedin2lightActive from 'src/assets/icons/linkedin (2)light-active.svg'
import noteActive from 'src/assets/icons/note-active.svg'
import notelightActive from 'src/assets/icons/notelight-active.svg'
import quoteLeftActive from 'src/assets/icons/quote-left-active.svg'
import quoteLeftlightActive from 'src/assets/icons/quote-leftlight-active.svg'
import title2Active from 'src/assets/icons/title (2)-active.svg'
import title2lightActive from 'src/assets/icons/title (2)-light-active.svg'
import transcriptionActive from 'src/assets/icons/transcription-active.svg'
import transcriptionlightActive from 'src/assets/icons/transcriptionlight-active.svg'
import youtube1Active from 'src/assets/icons/youtube (1)-active.svg'
import youtube1lightActive from 'src/assets/icons/youtube (1)light-active.svg'
import { ref, watchEffect, computed, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
import { useQuasar } from 'quasar'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { OutputEpisodeDraftsTabs } from 'src/stores/upload-podcast-state-types'

const $q = useQuasar()

const props = defineProps({
  drawerState: {
    type: Boolean,
    required: false,
    default: true
  }
})

const emit = defineEmits<{(eventName: 'switchTab', tab: OutputEpisodeDraftsTabs): void}>()

const auth = useAuthStore()
const store = useUploadPodcastStore()

const tabs = [
  {
    title: 'Title & Description',
    name: 'title',
    content: [],
    id: 'step-1',
    icon: {
      dark: title2,
      light: title2light
    },
    iconActive: {
      dark: title2Active,
      light: title2lightActive
    }
  },
  {
    title: 'Podcast Website Content',
    name: 'showNotes',
    content: [],
    icon: {
      dark: note,
      light: notelight
    },
    iconActive: {
      dark: noteActive,
      light: notelightActive
    }
  },
  {
    title: 'Transcript',
    name: 'transcript',
    content: [],
    icon: {
      dark: transcription,
      light: transcriptionlight
    },
    iconActive: {
      dark: transcriptionActive,
      light: transcriptionlightActive
    }
  },
  {
    title: 'Captions',
    name: 'captions',
    isGrowth: true,
    icon: {
      dark: chat,
      light: chatlight
    },
    iconActive: {
      dark: chatActive,
      light: chatlightActive
    },
    content: [
      {
        title: 'Facebook/Instagram',
        name: 'social'
      },
      {
        title: 'LinkedIn',
        name: 'linkedin'
      },
      {
        title: 'TikTok',
        name: 'tiktok'
      },
      {
        title: 'Twitter',
        name: 'twitter'
      }
    ]
  },
  {
    title: 'Email',
    name: 'email',
    isGrowth: true,
    content: [],
    icon: {
      dark: blackBackClosedEnvelopShape,
      light: blackBackClosedEnvelopShapelight
    },
    iconActive: {
      dark: blackBackClosedEnvelopShapeActive,
      light: blackBackClosedEnvelopShapelightActive
    }
  },
  {
    title: 'Blog Post',
    isPro: true,
    name: 'blogPost',
    content: [],
    icon: {
      dark: drawing,
      light: drawinglight
    },
    iconActive: {
      dark: drawingActive,
      light: drawinglightActive
    }
  },
  {
    title: 'LinkedIn Article',
    isPro: true,
    name: 'linkedin_article',
    content: [],
    icon: {
      dark: linkedin2,
      light: linkedin2light
    },
    iconActive: {
      dark: linkedin2Active,
      light: linkedin2lightActive
    }
  },
  {
    title: 'YouTube Description',
    isPro: true,
    name: 'youtube',
    content: [],
    icon: {
      dark: youtube1,
      light: youtube1light
    },
    iconActive: {
      dark: youtube1Active,
      light: youtube1lightActive
    }
  },
  {
    title: 'Potent Quotables',
    isPro: true,
    name: 'potent_quotables',
    content: [],
    icon: {
      dark: quoteLeft,
      light: quoteLeftlight
    },
    iconActive: {
      dark: quoteLeftActive,
      light: quoteLeftlightActive
    }
  }
]
const expanded = ref<boolean>(false)
const miniState = ref(props.drawerState)
const stepOne = ref(
  {
    name: 'step-one',
    description: "Here's the full menu of outputs Capsho will create for you! Just click on what you want to view & edit. ",
    isFirst: true,
    id: 1,
    tooltipPosition: 'top-left-42'
  }
)

const darkMode = computed(() => $q.dark.isActive)
const hasSeenOnBoardingTutorial = computed(() => auth.user.hasSeenOnboardingTutorial)
const guestDrafts = computed(() => {
  return store.allCaptionsGuest &&
    store.allCaptionsGuest.facebook &&
    store.allCaptionsGuest.linkedin
})
const showGuestDrafts = computed(() => {
  return store.showGuestDrafts
})

function nextStep() {
  store.showStepOne = false
  store.showStepTwo = true
}

watchEffect(() => {
  expanded.value = ['social', 'linkedin', 'tiktok', 'twitter']
    .includes(store.outputEpisodeTab)
})
onMounted(() => {
  store.showStepOne = true
  store.showStepTwo = false
  store.showStepThree = false
  store.showStepFour = false
})
</script>

<template>
  <q-drawer
    :breakpoint="500"
    class="transition-all"
    show-if-above
    :width="miniState ? 60 : 280"
  >
    <div class="full-height">
      <q-scroll-area
        v-if="true"
        class="fit"
      >
        <q-list
          class="absolute top-1/2 poppins-regular bg-darkish rounded-r-2xl"
          style="transform: translateY(-50%);"
        >
          <template
            v-for="(tab, index) in tabs"
            :key="index"
          >
            <q-expansion-item
              v-if="tab.content.length"
              v-model="expanded"
              class="expansion-item text-16 text-text"
              :content-inset-level="miniState ? 0 : 0.5"
              :header-inset-level="0"
              :hide-expand-icon="miniState"
              toggle-area-label="Captions"
            >
              <q-item
                v-for="child in tab.content"
                :id="tab.id"
                :key="child.name"
                :class="{
                  'flex justify-center': miniState
                }"
                clickable
                @click="emit('switchTab', (child.title === 'Blog Post' ? `Blog Post(Listicle)` : child.title) as OutputEpisodeDraftsTabs)"
              >
                {{ miniState ? child.title.slice(0,2) : child.title }}
              </q-item>
              <template #header>
                <q-item-section style="padding-left: 0;">
                  <div class="flex items-center gap-4 flex-nowrap">
                    <img
                      alt=""
                      class="w-6 h-6"
                      :src="darkMode ? tab.icon['dark'] : tab.icon['light']"
                    >
                    <span v-if="!miniState">{{ tab.title }}</span>
                  </div>
                </q-item-section>
                <q-item-section
                  v-if="!miniState"
                  side
                >
                  <q-badge
                    color="orange"
                    label="Growth"
                    rounded />
                </q-item-section>
              </template>
            </q-expansion-item>
            <q-item
              v-else
              :id="tab.id"
              clickable
              @click="$emit('switchTab', (tab.title === 'Blog Post' ? `Blog Post(Listicle)` : tab.title) as OutputEpisodeDraftsTabs)"
            >
              <template v-if="index === 0">
                <OnboardTour
                  v-if="!hasSeenOnBoardingTutorial && store.showStepOne"
                  :step="stepOne"
                  @next="nextStep"
                />
              </template>
              <q-item-section>
                <div class="text-capitalize flex items-center gap-4 flex-nowrap">
                  <img
                    v-if="tab.title === store.outputEpisodeTab"
                    alt=""
                    class="w-6 h-6"
                    :src="darkMode ? tab.iconActive['dark'] : tab.iconActive['light']"
                  />
                  <img
                    v-else
                    alt=""
                    class="w-6 h-6"
                    :src="darkMode ? tab.icon['dark'] : tab.icon['light']"
                  />
                  <span v-if="!miniState">{{ tab.title }}</span>
                </div>
              </q-item-section>
              <q-item-section
                v-if="!miniState && tab.isGrowth"
                side>
                <q-badge
                  color="orange"
                  label="Growth"
                  rounded />
              </q-item-section>
              <q-item-section
                v-if="!miniState && tab.isPro"
                side>
                <q-badge
                  color="orange"
                  label="Pro"
                  rounded />
              </q-item-section>
              <q-item-section
                v-if="!miniState && tab.isBeta"
                side>
                <q-badge
                  color="green"
                  label="Beta"
                  rounded />
              </q-item-section>
            </q-item>
          </template>
          <div
            v-if="showGuestDrafts && !miniState"
            class="flex flex-center q-mt-none q-py-md"
          >
            <app-button
              v-if="guestDrafts"
              clickable
              color="secondary"
              label="Guest Promotional Assets"
              no-caps
              rounded
              @click="$router.push({ name: 'GuestEpisodeDrafts' })"
            />
            <app-button
              v-else
              color="accent"
              label="Create Guest Promotional Assets"
              no-caps
              rounded
              @click="store.createGuestPromoDrafts"
            />
          </div>
        </q-list>
      </q-scroll-area>
      <!--
        in this case, we use a button (can be anything)
        so that user can switch back
        to mini-mode
      -->
      <!-- <div class="absolute bottom-2 -right-4">
        <q-btn
          color="accent-custom"
          dense
          :icon="miniState ? 'chevron_right' : 'chevron_left'"
          round
          unelevated
          @click="miniState = !miniState"
        />
      </div> -->
    </div>
  </q-drawer>
</template>
