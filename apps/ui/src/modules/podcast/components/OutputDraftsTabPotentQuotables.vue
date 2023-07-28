<script setup lang="ts">
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { computed, onUnmounted, ref, watch } from 'vue'
import { debounce } from 'quasar'
import { htmlSanitizer } from 'src/utils'
import { useSubscription } from 'src/composables/useSubscription'

const store = useUploadPodcastStore()
const { allowPotentQuotables, interval } = useSubscription()

const potentQuotable = ref({
  label: 'Motivational',
  value: 'motivation',
  show: true
})

const options = [
  {
    label: 'Motivational',
    value: 'motivation',
    tooltip: 'A selection of quotes that will motivate your audience',
    show: true
  },
  {
    label: 'Story',
    value: 'story',
    tooltip: 'A selection of quotes from the story you or your podcast-guest shared in the episode',
    show: true
  },
  {
    label: 'Epiphany',
    value: 'epiphany',
    tooltip: 'A selection of quotes that shares an epiphany with your audience',
    show: true
  },
  {
    label: 'Promotional',
    value: 'sales',
    tooltip: 'A selection of quotes that promotes your or your podcast-guest\'s product / service',
    show: true
  },
  {
    label: 'Topic',
    value: 'topic',
    tooltip: 'A selection of insightful quotes about the topic covered in the episode',
    show: true
  }
]
const updating = ref(false)

const validTemplate = computed({
  get () {
    const key = potentQuotable.value.value
    return store.potentQuotables[key]
  },
  set (val: string) {
    const key = potentQuotable.value.value
    store.potentQuotables[key] = val
  }
})

const updatePotentQuotables = debounce(() => {
  if (!allowPotentQuotables.value) {
    return null
  }
  const getTemplate = () => {
    if (validTemplate.value) {
      return htmlSanitizer(validTemplate.value)
    } else {
      return ''
    }
  }
  const template = getTemplate()
  const key = potentQuotable.value.value
  const data = {
    potentQuotables: {
      [key]: template
    }
  }
  if (template === '') {
    return null
  } else {
    if (store.selectedEpisode.potentQuotables) {
      store.selectedEpisode.potentQuotables[key] = template
    }
    return Promise.resolve(store.updatePodcastEpisode(data))
  }
}, 1000)

watch(potentQuotable, (key) => {
  if (!allowPotentQuotables.value) {
    return null
  }
  updating.value = true
  if (key) {
    updatePotentQuotables()
  }
  const timer = setTimeout(() => {
    updating.value = false
    clearTimeout(timer)
  }, 500)
}, { immediate: true })

function moveToTheNext () {
  updatePotentQuotables()
}

onUnmounted(() => {
  moveToTheNext()
})

const getStyleForAppCard = computed<string>(() => {
  const background = true
  const border = true
  const minHeight = '200px'
  let properties = background ? 'background: #FCFCFC;' : 'background: none;'
  properties = properties + (border ? 'border: 3px solid #FBDFB3;' : 'border: none;') + (minHeight ? `min-height:${minHeight}` : '')
  return properties
})

const sampleTemplate = `
"To not be reduced by the things that happen to us and to use them to propel us to greatness.
That has been my whole entire life."<br><br>

"I think so often as coaches or people that run businesses online, when someone doesn't decide to work with you,
you get in your fields and you think about whatever money you didn't get."<br><br>

"I love recruiting. Like I said, I was in HR for about 17 years before I branched out into recruiting."<br><br>

"I just got home and you started 75 hard, what, a couple of weeks after you got home? April 4."<br><br>

"I was like, okay, I'll go to the gym with you one or two days a week, and
I'll help you get acclimated and get comfortable in the gym."<br><br>

"The belief that I have is what I'm telling myself in the stillness, because I think there's so much
noise in the world, whether it's social media, whether it's media in general,
there's other people's opinions, everything else that they say."<br><br>

"And part of healing for me was silencing having the stillness of my own belief system to really take
root and letting go of what everybody else had always told me I was or told me that
I believed or told me that I was capable of, and all those pieces"<br><br>

"I remember writing that quote within that time frame and being like, no, this belief is who I am in my stillness."<br><br>

"And that was a shift for me because I was definitely getting to the store point.I was definitely pushing myself.
I had really understood that I had bitched about working out at home, and then I became to love it."<br><br>

"And I think it's just what you feel.  Like, everybody needs to feel like this."<br><br>
`
</script>

<template>
  <div class="">
    <div class="row justify-between q-pb-sm">
      <div class="col-11">
        <div class="full-width">
          <q-select
            v-model="potentQuotable"
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
                <q-item-section>
                  <q-item-label>
                    {{ scope.opt.label }}
                    <q-tooltip
                      anchor="center middle"
                      class="rounded-borders tooltip-text"
                      max-width="20vw"
                      self="center right"
                    >
                      {{ scope.opt.tooltip }}
                    </q-tooltip>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <div class="row no-wrap items-center">
                <span class="text-grey-3">{{ potentQuotable.label }}</span>
              </div>
            </template>
          </q-select>
        </div>
      </div>
      <q-space/>
    </div>
    <div v-if="allowPotentQuotables">
      <div class="row no-wrap">
        <div class="col-11">
          <!-- <q-skeleton
            v-if="store.showPotentQuotablesSkeleton || updating"
            class="border-radius-6"
            height="63vh"
            square
            type="QInput"
          /> -->
          <AppSkeleton
            v-if="store.showPotentQuotablesSkeleton || updating"
            class="rounded-xl"
            height="63vh"
            width="100%"
          />
          <EditableContent
            v-else
            id="potentQuotable"
            v-model="validTemplate"
            size="xll"
            @update:modelValue="moveToTheNext"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <div class="upgrade-container row no-wrap">
        <div class="col-11">
          <EditableContent
            id="potentQuotable"
            v-model="sampleTemplate"
            mode="blur"
            readonly
            size="xll"
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
                  Unlock Potent Quotables for future episodes by<br>
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

.potent-quotable {
  font-size: 20px !important;
  font-weight: 600;
}
</style>
