<script setup lang="ts">
import { useUploadPodcastStore } from 'stores/upload-podcast'

const store = useUploadPodcastStore()
const refreshOptions = [
  {
    label: 'Previous Episode Summary',
    tooltip: [
      'Clicking this will take you to the previous option for your episode summary.',
      'For when you hit refresh too fast and want to go back'
    ],
    callFunction: store.getPrevStoryValue
  },
  {
    label: 'Previous Episode Takeaways',
    tooltip: [
      'Clicking this will take you to the previous option for your episode takeaways.',
      'For when you hit refresh too fast and want to go back'
    ],
    callFunction: store.getPrevFindingValue
  }
]
</script>

<template>
  <q-btn-dropdown
    aria-label="Previous"
    class="q-btn--round flip-horizontal"
    dense
    dropdown-icon="las la-share"
    flat
    no-icon-animation
    size="md"
    text-color="accent"
  >
    <q-list>
      <q-item
        v-for="(option) in refreshOptions"
        :key="option.label"
        v-close-popup
        clickable
        @click="option.callFunction"
      >
        <q-item-section>
          <q-item-label>
            {{ option.label }}
            <q-tooltip
              anchor="center start"
              class="text-body2 text-accent rounded-borders q-pa-md"
              max-width="15vw"
              self="center end"
              style="background-color: #EAE8FF;"
            >
              <span>
                {{ option.tooltip[0] }}<br>
                {{ option.tooltip[1] }}&#128521;
              </span>
            </q-tooltip>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
