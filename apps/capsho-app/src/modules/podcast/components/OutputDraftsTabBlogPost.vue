<script setup lang="ts">
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { useSubscription } from 'src/composables/useSubscription'
import { computed, onUnmounted } from 'vue'
import { htmlSanitizer } from 'src/utils'
import { debounce } from 'quasar'
import OutputDraftsTabBlogPostSeoQuestionsCard
  from 'src/modules/podcast/components/OutputDraftsTabBlogPostSeoQuestionsCard.vue'

const { allowBlogPost, interval } = useSubscription()

const store = useUploadPodcastStore()

const isBlogPostSeoQuestionPicked = computed(() => {
  if (store.blogTemplate) {
    return true
  }
  return store.isBlogPostSeoQuestionPicked
})

const blogTitle = computed({
  get () {
    return store.blogPost.blogTitle ?? ''
  },
  set (val: string) {
    store.blogPost.blogTitle = val
  }
})

const blogPost = computed({
  get () {
    return store.blogTemplate || ''
  },
  set (value: string) {
    store.blogTemplate = value
  }
})

const updateBlogPost = debounce(() => {
  const getTemplate = () => {
    if (store.blogTemplate) {
      return htmlSanitizer(blogPost.value)
    } else {
      return ''
    }
  }
  const blogPostTemplate = getTemplate()
  const data = Object.freeze({
    blogPostTemplate,
    drafts: {
      blogTitle: blogTitle.value
    }
  })
  if (blogPostTemplate === '' && blogTitle.value === '') {
    return null
  } else {
    store.selectedEpisode.blogPostTemplate = blogPostTemplate
    return Promise.resolve(store.updatePodcastEpisode(data))
  }
}, 1000)

async function moveToTheNext () {
  store.blogTemplate = blogPost.value
  await updateBlogPost()
}
const sampleBlogPostTemplate = `Welcome to the Integrated Schools Podcast. On today's episode, we're discussing anti blackness with a multiracial panel of guests. Our guests are Dr. Daniela Sores and Trisha Ebarvia, both of whom are educators with a wealth of experience in the field.
ABC CBA was born to immigrant parents who were determined to provide their children with a good education. They moved to several communities in search of better schools for their children. However, they found that the schools were not always what they seemed. The schools were often segregated and lacked resources.
<br><br>
Here are the steps you need to follow to also get Calmness, Happiness, Success:
1. Recognize the global problem of anti-blackness.
2. Understand how it manifests in different communities of color.
3. Engage in conversations about it in order to create change.
<br><br>
<strong>To be persistent in pursuing your goals</strong>
The first step is to meet with the band's promoter to get a gig as a 'gopher' for the band. This involves getting a free pass to the show and helping to set up and clean up before and after the show. The band was not yet well known in the US
<br><br>
<strong>To be open to new opportunities and experiences</strong>
When she arrived at the club, the first thing she noticed was that the road crew for the band was trashing the United States. She thought to herself that this was going to be a fun night. As she walked in, she realized that the band was not there yet and that she
<br><br>
<strong>To have a positive attitude</strong>
To be open to new opportunities and experiences, you should approach life with a positive attitude and an open mind. Be willing to try new things, meet new people, and visit new places. By doing so, you will open yourself up to a world of new possibilities. Additionally, don't
<br><br>
I’m love to hear how you apply ${store.solution} to get ${store.ultimateResult}.<br>
Leave me a comment on how it went for you or drop any questions you want me to answer!`

const getStyleForAppCard = computed<string>(() => {
  const background = true
  const border = true
  const minHeight = '200px'
  let properties = background ? 'background: #FCFCFC;' : 'background: none;'
  properties = properties + (border ? 'border: 3px solid #FBDFB3;' : 'border: none;') + (minHeight ? `min-height:${minHeight}` : '')
  return properties
})

onUnmounted(() => {
  Promise.resolve(moveToTheNext())
})
</script>

<template>
  <div v-if="allowBlogPost">
    <div
      v-if="!isBlogPostSeoQuestionPicked"
      class="row">
      <div class="col-11">
        <OutputDraftsTabBlogPostSeoQuestionsCard />
      </div>
    </div>
    <div v-else>
      <div class="q-gutter-y-md">
        <div>
          <div class="row justify-between q-pb-xs">
            <div class="col-10">
              <label
                v-if="store.showEmailSubjectSkeleton"
                class="custom-label"
                for="blogTitle"
              >
                <span>
                  Blog Post Title is generating - Please wait
                </span>
                <q-spinner-dots
                  color="grey-7"
                  size="1.2em"
                />
              </label>
              <label
                v-else
                class="custom-label"
                for="blogTitle"
              >
                Blog Post Title
              </label>
            </div>
          </div>
          <div class="row items-center">
            <div class="col-11">
              <q-skeleton
                v-if="store.generatingBlogPostDrafts"
                class="border-radius-6"
                height="40px"
                square
                type="QInput"
              />
              <q-input
                v-else
                id="blogTitle"
                v-model="blogTitle"
                color="grey-3"
                dense
                input-class="readable-text"
                input-style="padding: 0 30px;"
                outlined
                style="background-color:#fff"
                @update:modelValue="moveToTheNext"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="row justify-between q-pb-xs">
            <div class="col-10">
              <label
                v-if="store.generatingBlogPostDrafts"
                class="custom-label"
                for="blogPost"
              >
                <span>
                  Blog Post is generating - Please wait
                </span>
                <q-spinner-dots
                  color="grey-7"
                  size="1.2em"
                />
              </label>
              <label
                v-else
                class="custom-label"
                for="blogPost"
              >
                Blog Post
              </label>
            </div>
            <q-space/>
          </div>
          <div class="row no-wrap">
            <div class="col-11">
              <q-skeleton
                v-if="store.generatingBlogPostDrafts"
                class="border-radius-6"
                height="58vh"
                square
                type="QInput"
              />
              <EditableContent
                v-else
                id="blogPost"
                v-model="blogPost"
                size="xl"
                @update:modelValue="moveToTheNext"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    class="upgrade-container row no-wrap">
    <div class="col-11">
      <EditableContent
        v-model="sampleBlogPostTemplate"
        mode="blur"
        readonly
        size="xxl"
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
              Unlock Blog Posts for future episodes by<br>
              upgrading to the Pro Plan or Capsho Collective!
            </div>
            <q-btn
              v-if="interval === 'month'"
              class="text-accent lexend-deca-bold"
              flat
              label="Upgrade Now"
              no-caps
              :to="{ name: 'PickAPlan' }"
            />
            <a
              v-else
              class="q-btn q-btn-item non-selectable q-btn--no-uppercase q-btn--flat no-outline cursor-pointer border-radius-10 text-accent lexend-deca-bold"
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
</template>
