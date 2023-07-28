<script setup>
import BrandLogo from 'src/components/BrandLogo.vue'
import OnboardTour from 'src/components/OnboardTour.vue'
import { ref, watchEffect, computed, onMounted } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { useAuthStore } from 'src/stores/auth-store'

defineEmits(['switchTab'])

const tabs = [
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
  },
  {
    title: 'Potent Quotables',
    isPro: true,
    name: 'potent_quotables',
    content: ''
  }
]

const auth = useAuthStore()
const store = useUploadPodcastStore()

const expanded = ref(null)
watchEffect(() => {
  expanded.value = ['social', 'linkedin', 'tiktok', 'twitter']
    .includes(store.outputEpisodeTab)
})

const hasSeenOnBoardingTutorial = computed(() => auth.user.hasSeenOnboardingTutorial)

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
    :width="340"
  >
    <q-scroll-area class="fit">
      <q-list class="relative-position poppins-regular">
        <div
          class="q-pt-lg bg-transparent mb-90"
          style="padding-inline: 54px;"
        >
          <BrandLogo />
        </div>

        <div
          v-for="(tab, index) in tabs"
          :key="index"
        >
          <q-expansion-item
            v-if="tab.content.length"
            v-model="expanded"
            class="expansion-item text-16"
            :content-inset-level="1.25"
            :header-inset-level="0.7"
            toggle-area-label="Captions"
          >
            <q-item
              v-for="child in tab.content"
              :id="tab.id"
              :key="child.name"
              clickable
              @click="$emit('switchTab', child.name)"
            >
              {{ child.title }}
            </q-item>
            <template #header>
              <q-item-section>
                {{ tab.title }}
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
            :id="tab.id"
            :class="tab.name === store.outputEpisodeTab ? 'item-active' : 'item'"
            clickable
            @click="$emit('switchTab', tab.name)"
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
                {{ tab.title }}
              </div>
            </q-item-section>
            <q-item-section
              v-if="tab.isGrowth"
              side>
              <q-badge
                color="orange"
                label="Growth"
                rounded />
            </q-item-section>
            <q-item-section
              v-if="tab.isPro"
              side>
              <q-badge
                color="orange"
                label="Pro"
                rounded />
            </q-item-section>
            <q-item-section
              v-if="tab.isBeta"
              side>
              <q-badge
                color="green"
                label="Beta"
                rounded />
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<style lang="scss" scoped>
.item {
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 2.5;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-inline: 32px;
  color: rgb(67, 56, 72);

  &::before {
    content: "";
    width: 10px;
    border-radius: 8px;
    margin-right: 14px;
  }
}

.item-active {
  font-weight: 700;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  line-height: 2.5;
  display: flex;
  align-items: center;
  color: $accent;
  cursor: pointer;
  padding-inline: 32px;
  transition: opacity 0.24s ease-in-out;

  &::before {
    content: "";
    border: 1px solid $accent;
    height: 30px;
    width: 7px;
    border-radius: 3px;
    background: $accent;
    margin-right: 14px;

  }
}
.expansion-item {
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px !important;
  line-height: 2.5;
  color: rgb(67, 56, 72);
}
</style>
