<script setup>
import OnboardTour from 'src/components/OnboardTour.vue'
import { ref, watchEffect, computed, onMounted } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { useAuthStore } from 'src/stores/auth-store'
import { useGuestTabs } from 'src/modules/podcast-guest/composables/use-guest-tabs'

const { hideActionButton, guestTabs } = useGuestTabs()

defineEmits(['switchTab'])

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

function createDrafts() {
  if (store.topicCG1) {
    store.createGuestEngagementDrafts()
  } else {
    store.createGuestInitialDraftsOne()
  }
}
</script>

<template>
  <q-drawer
    :breakpoint="500"
    class="pt-20 bg-darkish h-full px-8 py-8"
    show-if-above
    :width="340"
  >
    <div class="flex items-center gap-2 my-8">
      <span class="text-lg font-extrabold text-white">capsho</span>
      <q-btn
        class="text-weight-bold"
        color="secondary"
        dense
        label="guest"
        no-caps
        padding="4px 13px"
        rounded
        text-color="darkish"
      />
    </div>
    <div
      v-if="store.loading"
      class="py-8"
    >
      <q-list
        class="q-gutter-y-lg"
        dark
      >
        <app-skeleton
          animation="pulse"
          height="30px"
          type="text"
          width="100%" />
        <app-skeleton
          animation="pulse"
          height="30px"
          type="text"
          width="100%" />
        <app-skeleton
          animation="pulse"
          height="30px"
          type="text"
          width="100%" />
        <app-skeleton
          animation="pulse"
          height="30px"
          type="text"
          width="100%" />
        <app-skeleton
          animation="pulse"
          height="30px"
          type="text"
          width="100%" />
      </q-list>
    </div>
    <div v-else>
      <q-list class="poppins-regular">
        <div
          v-for="(tab, index) in guestTabs"
          :key="index"
        >
          <q-expansion-item
            v-if="tab.content.length"
            v-model="expanded"
            class="expansion-item text-16 text-white"
            :content-inset-level="0.5"
            :header-inset-level="0"
            toggle-area-label="Captions"
          >
            <q-item
              v-for="child in tab.content"
              :id="tab.id"
              :key="child.name"
              :class="child.name === store.outputEpisodeTab ? 'item-active text-white' : 'item text-white'"
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
            :class="tab.name === store.outputEpisodeTab ? 'item-active text-white' : 'item text-white'"
            clickable
            :disable="tab.disable"
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
        <q-item
          class="text-grey-3 bg-accent text-16 rounded-borders q-py-md"
          :class="{ 'hidden': hideActionButton }"
          clickable
          @click="createDrafts"
        >
          <q-item-section class="text-center">
            Get a month of content created for you from this episode
          </q-item-section>
        </q-item>
      </q-list>
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
  // padding-inline: 32px;
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
    left: 0px;
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
