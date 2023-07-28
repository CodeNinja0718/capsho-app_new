<script setup lang="ts">
import { useUploadPodcastStore } from 'src/stores/upload-podcast'

const store = useUploadPodcastStore()
</script>

<template>
  <q-btn-dropdown
    aria-label="Refresh"
    class="q-btn--round"
    dense
    dropdown-icon="las la-redo-alt"
    flat
    no-icon-animation
    size="md"
    text-color="accent"
  >
    <q-list>
      <q-item
        v-close-popup
        :class="{ 'disabled': !store.story.isRefreshAllowed }"
        clickable
        @click="store.refreshStory()"
      >
        <q-item-section>
          <q-item-label>
            Refresh Episode Summary
            <q-tooltip
              anchor="center start"
              class="text-body2 q-pa-md text-accent rounded-borders"
              max-width="15vw"
              self="center end"
              style="background-color: #EAE8FF;"
            >
              Clicking this will generate a new option for your episode summary.
            </q-tooltip>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        v-close-popup
        :class="{ 'disabled': !store.findings.isRefreshAllowed }"
        clickable
        @click="store.refreshFindings()"
      >
        <q-item-section>
          <q-item-label>
            Refresh Episode Takeaways
            <q-tooltip
              anchor="center start"
              class="text-body2 q-pa-md text-accent rounded-borders"
              max-width="15vw"
              self="center end"
              style="background-color: #EAE8FF;"
            >
              Clicking this will generate a new option for your episode takeaways.
            </q-tooltip>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
