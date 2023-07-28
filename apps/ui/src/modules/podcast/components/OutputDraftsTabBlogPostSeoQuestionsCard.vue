<script setup lang="ts">
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { computed, ref } from 'vue'

const store = useUploadPodcastStore()
const questions = computed(() => store.blogTopics.choices)
// const questions = computed(() => {
//   return [
//     '1. How can sharing your story be a powerful marketing tool?',
//     '2. What are the benefits of sharing your story?',
//     '3. How can you use your story to connect with your audience?',
//     '4. What are some tips for sharing your story effectively?',
//     '5. How can you make sure your story is optimized for SEO?'
//   ]
// })
const isLoading = computed(() => store.generatingBlogSeoQuestions)
const selectedQuestion = ref('')
const selectedQuestionId = ref<number|null>(null)
function pickTopic (idx: number) {
  if (!Object.keys(questions.value).includes(String(idx))) {
    throw new Error('Index is missing!')
  }
  selectedQuestionId.value = idx
  const topic = questions.value[idx]
  selectedQuestion.value = topic.replace(/\d./, '').replace(/^-/, '').trim()
}
const disable = computed(() => !selectedQuestion.value.length)
function onOKClick () {
  store.blogTopic = selectedQuestion.value
  store.isBlogPostSeoQuestionPicked = true
  const data = {
    drafts: {
      blogTopic: selectedQuestion.value
    },
    blogType: store.blogPostType,
    userPickedBlogPostSeoQuestion: true
  }
  store.updatePodcastEpisode(data)
  store.createBlogDraftsOne()
}
</script>

<template>
  <div v-if="isLoading">
    Loading...
  </div>
  <q-card
    v-else
    class="topic-chooser-card lexend-regular q-pa-none"
    flat>
    <q-card-section class="q-pa-none">
      <h1 class="lexend-bold text-white text-18 font-black text-center">
        Choose the topic you would like the blog post to focus on. (you can only choose one)<br />
        Beware: no backsies!
      </h1>
    </q-card-section>
    <q-card-section class="q-pa-none q-mt-sm">
      <q-list>
        <q-item
          v-for="(question, idx) in questions"
          :key="idx"
          :active="selectedQuestionId === idx"
          active-class="active-item"
          class="full-width bg-grey-9 text-16 border-radius-6 q-my-md"
        >
          <q-item-section>
            {{ question }}
          </q-item-section>
          <q-item-section side>
            <q-btn
              :color="selectedQuestionId === idx ? 'accent-custom' : 'grey-10'"
              label="Select"
              no-caps
              padding="4px 25px"
              rounded
              unelevated
              @click="pickTopic(idx)" />
          </q-item-section>
        </q-item>
        <q-item class="full-width bg-grey-10 text-13 border-radius-6 q-my-md q-px-none q-gutter-y-md">
          <q-item-section>
            <label
              class="text-13"
              for="selectedQuestion"
            >
              This is your chosen blog post topic.
              Please make any changes and confirm so we can create your blog post for you!
            </label>
            <q-input
              id="selectedQuestion"
              v-model="selectedQuestion"
              autogrow
              color="accent"
              dark
              filled
            />
          </q-item-section>
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
        class="text-13 poppins-medium"
        color="accent"
        :disable="disable"
        label="Confirm topic & generate"
        no-caps
        padding="4px 25px"
        rounded
        text-color="white"
        unelevated
        @click="onOKClick" />
    </q-card-actions>
  </q-card>
</template>

<style lang="scss" scoped>
@import "src/css/quasar.variables";
.topic-chooser-card,
.topic-chooser-container {
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
}

h1 {
  line-height: 2rem;
  letter-spacing: 0.5px;
}

.line-height-18 {
  line-height: 1.8rem !important;
}

.q-field--outlined .q-field__control {
  max-height: 80px;
}

.active-item {
  border: 1px solid $accent;
  color: #FFFFFF;
}
</style>
