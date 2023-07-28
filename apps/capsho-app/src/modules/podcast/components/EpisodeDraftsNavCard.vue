<script setup lang="ts">
import { computed, onMounted, reactive, ref, watchEffect } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { useQuasar } from 'quasar'
import BrandLogo from '../../../components/BrandLogo.vue'
import { useAuthStore } from 'src/stores/auth-store'
import OnboardTour from 'src/components/OnboardTour.vue'

const $q = useQuasar()

const getWidthStyle = computed<string>(() => {
  if ($q.screen.lt.lg) return '65vw'
  else return '55vw'
})

const styleObject = reactive<object>({
  width: getWidthStyle
})

const hasSeenOnBoardingTutorial = computed(() => auth.user.hasSeenOnboardingTutorial)
const auth = useAuthStore()
const store = useUploadPodcastStore()
const stepperOptions = [
  {
    title: 'Title & Description',
    name: 'title',
    content: '',
    id: 'step-1'
  },
  {
    title: 'Show notes',
    name: 'showNotes',
    content: ''
  },
  {
    title: 'Transcript',
    name: 'transcript',
    content: ''
  },
  {
    title: 'Captions',
    name: 'captions',
    isGrowth: true,
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
    content: ''
  },
  {
    title: 'Blog Post',
    isPro: true,
    name: 'blogPost',
    content: ''
  },
  {
    title: 'LinkedIn Article',
    isPro: true,
    name: 'linkedin_article',
    content: ''
  },
  {
    title: 'YouTube Description',
    isPro: true,
    name: 'youtube',
    content: ''
  }
]
const expanded = ref(false)

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

const stepOne = ref(
  {
    name: 'step-one',
    description: "Here's the full menu of outputs Capsho will create for you! Just click on what you want to view & edit. ",
    isFirst: true,
    id: 1,
    tooltipPosition: 'top-left-42'
  }
)

function nextStep() {
  store.showStepOne = false
  store.showStepTwo = true
}
</script>

<template>
  <q-drawer
    :breakpoint="500"
    show-if-above
    style="background:linear-gradient(321.86deg, #FFFFFF 37.07%, #F5F4FF 91.59%);border: 1px solid #F5F4FF;box-shadow: 0 12px 20px 6px rgba(0, 0, 0, 0.06);"
    :width="330"
  >
    <q-scroll-area class="fit">
      <q-list class="relative-position">
        <div
          class="row bg-transparent  mb-80"
          style="padding-inline: 54px;">
          <BrandLogo />
        </div>

        <div
          v-for="(step, index) in stepperOptions"
          :key="index"
        >
          <q-expansion-item
            v-if="step.content.length"
            v-model="expanded"
            class="expansion-item"
          >
            <q-item
              v-for="child in step.content"
              :id="step.id"
              :key="child.name"
              clickable
              style="margin-left: 68px; color: #14142B;"
              @click="store.outputEpisodeTab = child.name"
            >
              {{ child.title }}
            </q-item>
            <template #header>
              <q-item-section style="padding-left: 39px; font-size: 14px; color: #14142B;">
                {{ step.title }}
              </q-item-section>
              <q-item-section side>
                <q-badge
                  color="orange"
                  label="Growth"
                  rounded />
              </q-item-section>
            </template>
          </q-expansion-item>
          <q-item
            v-else
            :id="step.id"
            :class="step.name === store.outputEpisodeTab ? 'item-active' : 'item'"
            clickable
            @click="store.outputEpisodeTab = step.name"
          >
            <template v-if="index === 0">
              <OnboardTour
                v-if="!hasSeenOnBoardingTutorial && store.showStepOne"
                :step="stepOne"
                @next="nextStep"
              />
            </template>
            <q-item-section>
              <div class="text-capitalize">
                {{ step.title }}
              </div>
            </q-item-section>
            <q-item-section
              v-if="step.isGrowth"
              side>
              <q-badge
                color="orange"
                label="Growth"
                rounded />
            </q-item-section>
            <q-item-section
              v-if="step.isPro"
              side>
              <q-badge
                color="orange"
                label="Pro"
                rounded />
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-scroll-area>
  </q-drawer>
  <div class="q-px-xl">
    <slot name="body"></slot>
  </div>
  <!-- </div> -->
  <div
    class="row justify-between q-my-md"
    :style="styleObject">
    <slot name="actions"></slot>
  </div>
</template>

<style lang="scss" scoped>
.item {
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 40px;
  display: flex;
  align-items: center;
  letter-spacing: 0.75px;
  cursor: pointer;
  color: #14142B;
  padding-inline: 32px;

  &::before {
    content: "";
    width: 10px;
    border-radius: 8px;
    margin-right: 14px;
  }
}

.item-active {
  color: #6267DA;
  font-weight: 700;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  font-style: normal;

  line-height: 40px;
  display: flex;
  align-items: center;
  letter-spacing: 0.75px;
  cursor: pointer;

  padding-inline: 32px;

  &::before {
    content: "";
    border: 1px solid #6267DA;
    height: 40px;
    width: 10px;
    border-radius: 8px;
    background: #6267DA;
    margin-right: 14px;

  }
}
.expansion-item {
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 40px;
  letter-spacing: 0.75px;
  color: #14142B;
}
</style>
