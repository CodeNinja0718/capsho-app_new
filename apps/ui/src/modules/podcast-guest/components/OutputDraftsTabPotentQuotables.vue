<script setup lang="ts">
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { computed, onUnmounted, ref, watch } from 'vue'
import { debounce } from 'quasar'
import { htmlSanitizer } from 'src/utils'

const store = useUploadPodcastStore()

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
    value: 'promotional',
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
    return Promise.resolve(store.updateGuestPodcastEpisode(data))
  }
}, 1000)

watch(potentQuotable, (key) => {
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
</script>

<template>
  <div>
    <div class="row justify-between q-pb-sm">
      <div class="col-11">
        <div class="">
          <label
            v-if="store.showPotentQuotablesSkeleton || updating"
            class="custom-label"
            for="potentQuotable"
          >
            <span>
              Potent Quotables are generating - Please wait
            </span>
            <q-spinner-dots
              color="grey-7"
              size="1.2em"
            />
          </label>
          <label
            v-else
            class="custom-label"
            for="potentQuotable"
          >
            Potent Quotables
          </label>
        </div>
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
    <div>
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
