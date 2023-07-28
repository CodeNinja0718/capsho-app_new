<script setup lang="ts">
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { computed, ref } from 'vue'

const store = useUploadPodcastStore()
const questions = computed(() => store.blogPostSeoQuestions)
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
const choosenTopic = ref('')
function pickTopic (idx: number) {
  if (!Object.keys(questions.value).includes(String(idx))) {
    throw new Error('Index is missing!')
  }
  const topic = questions.value[idx]
  choosenTopic.value = topic.replace(/\d./, '').replace(/^-/, '').trim()
}
const disable = computed(() => !choosenTopic.value.length)
function onOKClick () {
  store.blogSeoQuestion = choosenTopic.value
  store.isBlogPostSeoQuestionPicked = true
  const data = {
    drafts: {
      blogSeoQuestion: choosenTopic.value
    },
    userPickedBlogPostSeoQuestion: true
  }
  store.updatePodcastEpisode(data)
  store.createBlogDraftsTwo()
}
</script>

<template>
  <q-card
    class="topic-chooser-card q-pa-none"
    flat>
    <q-card-section class="q-pa-none">
      <h1 class="text-16 custom-label q-my-none q-py-none">What is the blog post topic for this episode?</h1>
    </q-card-section>
    <q-card-section class="q-pa-none">
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
          Choose the topic you would like the blog post to focus on
          <b>(you can only choose one. Beware: no backsies!)</b>
        </p>
      </q-banner>
    </q-card-section>
    <q-card-section class="q-pa-none q-mt-sm">
      <q-list>
        <q-item
          v-for="(question, idx) in questions"
          :key="idx"
          class="full-width q-px-none"
        >
          <q-input
            autogrow
            class="full-width"
            :model-value="question"
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
            This is your chosen blog post topic.
            Please make any changes and confirm so we can create your blog post for you!
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
        Confirm topic & generate
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped>
.topic-chooser-card,
.topic-chooser-container {
  width: 100%;
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
