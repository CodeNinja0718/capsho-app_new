<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { useUploadPodcastStore } from 'stores/upload-podcast'

const store = useUploadPodcastStore()

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const isLoading = computed(() => store.generatingInitialDrafts)
const data = computed(() => store.topic1List)
// const data = computed(() => [
//   '1. Technical difficulties at the start of the show. The podcast-guest\'s background and what they have to share on the show',
//   '2. The host\'s excitement at meeting the podcast-guest. The podcast-guest\'s background and what they have to share on the show',
//   '3. The podcast-guest\'s background and what they have to share on the show. The podcast-guest\'s background and what they have to share on the show. The podcast-guest\'s background and what they have to share on the show'
// ])
const choosenTopic = ref('')
function pickTopic (idx: number) {
  if (!Object.keys(data.value).includes(String(idx))) {
    throw new Error('Index is missing!')
  }
  const topic = data.value[idx]
  choosenTopic.value = topic.replace(/\d./, '').replace(/^-/, '').trim()
}
const disable = computed(() => !choosenTopic.value.length)
function onOKClick () {
  store.processStep = 'submitFiles'
  store.topic1 = choosenTopic.value
  store.createInitialDraftsTwo()
  onDialogOK()
}
</script>

<template>
  <q-dialog
    ref="dialogRef"
    persistent
    @hide="onDialogHide"
  >
    <q-card class="topic-chooser-card q-pa-md">
      <q-card-section>
        <h1 class="text-16 q-my-none q-py-none">What is the topic for this episode?</h1>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-banner
          class="q-px-md"
          rounded
          style="background-color: #FFF3C8;"
        >
          <template v-slot:avatar>
            <q-img
              src="icons/idea_icon.png"
              style="width: 50px; height: 50px"
            />
          </template>
          <p class="line-height-18 q-ma-none">
            Here are the topics Capsho picked up for this episode.
            Please choose which topic you would like us to focus on
            <b>(you can only choose one. Beware: no backsies!)</b>
          </p>
        </q-banner>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-list>
          <q-item
            v-for="(topic, idx) in data"
            :key="idx"
            class="full-width q-px-none"
          >
            <q-input
              autogrow
              class="full-width"
              :model-value="topic"
              outlined
              readonly
            >
              <template #append>
                <q-btn
                  class="text-underline"
                  flat
                  label="Select"
                  no-caps
                  @click="pickTopic(idx)" />
              </template>
            </q-input>
          </q-item>
          <q-item class="q-px-none column q-gutter-y-md">
            <q-banner
              class="q-px-md poppins-medium"
              rounded
              style="background-color: #FFF3C8;"
            >
              Don't like any of these? Enter your own topic you'd like Capsho to focus on here:
            </q-banner>
            <q-input
              v-model="choosenTopic"
              autogrow
              class="full-width"
              color="accent"
              outlined
            />
          </q-item>
          <q-inner-loading
            label="Please wait..."
            label-class="text-teal"
            label-style="font-size: 1.1em"
            :showing="isLoading"
          />
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          class="btn-grey border-radius-6"
          color="accent"
          :disable="disable"
          no-caps
          rounded
          text-color="white"
          @click="onOKClick">
          Confirm topic
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.topic-chooser-card,
.topic-chooser-container {
  width: 100%;
  max-width: 725px;
  margin: 0 auto;
}

h1 {
  line-height: 2rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.line-height-18 {
  line-height: 1.8rem !important;
}

.q-field--outlined .q-field__control {
  max-height: 80px;
}
</style>
