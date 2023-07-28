<script setup>
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { computed, ref } from 'vue'

const store = useUploadPodcastStore()
const blogIdeas = computed(() => {
  return store.blogTopics.choices
})

const isLoading = computed(() => store.generatingBlogSeoQuestions)
const selectedIdea = ref('')
const selectedIdeaId = ref(null)
function pickTopic (idx) {
  if (!Object.keys(blogIdeas.value).includes(String(idx))) {
    throw new Error('Index is missing!')
  }
  selectedIdeaId.value = idx
  const topic = blogIdeas.value[idx]
  selectedIdea.value = topic.replace(/\d./, '').replace(/^-/, '').trim()
}
const disable = computed(() => !selectedIdea.value.length)
function onOKClick () {
  store.blogTopic = selectedIdea.value
  store.isBlogPostSeoQuestionPicked = true
  const data = {
    drafts: {
      blogTopic: selectedIdea.value
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
          v-for="(idea, idx) in blogIdeas"
          :key="idx"
          :active="selectedIdeaId === idx"
          active-class="active-item"
          class="full-width bg-grey-9 text-16 border-radius-6 q-my-md"
        >
          <q-item-section>
            {{ idea }}
          </q-item-section>
          <q-item-section side>
            <q-btn
              :color="selectedIdeaId === idx ? 'accent-custom' : 'grey-10'"
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
              for="selectedIdea"
            >
              This is your chosen blog post topic.
              Please make any changes and confirm so we can create your blog post for you!
            </label>
            <q-input
              id="selectedIdea"
              v-model="selectedIdea"
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
