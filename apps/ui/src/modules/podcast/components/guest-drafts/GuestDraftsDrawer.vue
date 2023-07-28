<script setup>
import OnboardTour from 'src/components/OnboardTour.vue'
import { ref, watchEffect, computed, onMounted } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { useAuthStore } from 'src/stores/auth-store'

defineEmits(['switchTab'])

const tabs = [
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
    title: 'Creative Assets',
    name: 'assets',
    isGrowth: true,
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
    class="pt-24"
    show-if-above
    :width="340"
  >
    <div class="h-full px-8 py-8">
      <q-scroll-area class="fit">
        <q-list class="relative-position poppins-regular">
          <div class="row items-center gap-2 mb-8">
            <span class="text-lg font-extrabold text-text">capsho</span>
            <q-btn
              class="text-weight-bold"
              color="accent-custom"
              dense
              label="guest"
              no-caps
              padding="4px 13px"
              rounded
            />
          </div>

          <div
            v-for="(tab, index) in tabs"
            :key="index"
          >
            <q-expansion-item
              v-if="tab.content.length"
              v-model="expanded"
              class="expansion-item text-16 text-text"
              :content-inset-level="0.5"
              :header-inset-level="0"
              toggle-area-label="Captions"
            >
              <q-item
                v-for="child in tab.content"
                :id="tab.id"
                :key="child.name"
                :class="child.name === store.outputEpisodeTab ? 'item-active text-text' : 'item text-text'"
                clickable
                @click="$emit('switchTab', child.name)"
              >
                {{ child.title }}
              </q-item>
              <template #header>
                <q-item-section>
                  {{ tab.title }}
                </q-item-section>
              </template>
            </q-expansion-item>
            <q-item
              v-else
              :id="tab.id"
              :class="tab.name === store.outputEpisodeTab ? 'item-active text-text' : 'item text-text'"
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
            </q-item>
          </div>
          <q-item class="flex flex-center">
            <app-button
              color="accent-custom"
              label="Ready to send to your guest"
              no-caps
              rounded
              @click="$emit('switchTab', 'invite')"
            />
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>
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
}

.item-active {
  font-weight: 700;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  line-height: 2.5;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.24s ease-in-out;
  position: relative;

  &::before {
    content: "";
    border: 1px solid $accent;
    height: 30px;
    width: 7px;
    border-radius: 3px;
    background: $accent;
    position: absolute;
    left: 0;
  }
}
.expansion-item {
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px !important;
  line-height: 2.5;
}
</style>
