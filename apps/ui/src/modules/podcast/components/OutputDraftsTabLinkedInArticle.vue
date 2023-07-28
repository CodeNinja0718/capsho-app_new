<script setup lang="ts">
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import TheEditor from 'src/modules/editor/TheEditor.vue'
import { computed, onUnmounted, ref } from 'vue'
import { debounce } from 'quasar'
import { htmlSanitizer } from 'src/utils'
import { useContentFiller } from 'src/composables/useContentFiller'
import { useSubscription } from 'src/composables/useSubscription'
import { useTemplatesStore } from 'src/stores/templates'
import { useUploadPodcastStore } from 'stores/upload-podcast'

const store = useUploadPodcastStore()
const { allowLinkedInArticle, interval } = useSubscription()

const { setContentChooser } = useContentFiller()

const templatesStore = useTemplatesStore()
const templates = computed(() => templatesStore.templates.filter((template) => template.type === 'laArticle'))

const pickedTemplateIndex = ref(-1)

const buildFromTemplate = (tempIndex: number) => {
  pickedTemplateIndex.value = tempIndex
  store.selectedEpisode.layouts.isLaPicked = true
  store.updatePodcastEpisode({
    layouts: {
      isLaPicked: true
    }
  })
  setContentChooser('LinkedIn Article')
}

const isBlogPostSeoQuestionPicked = computed(() => {
  if (store.blogTemplate) {
    return true
  }
  return store.isBlogPostSeoQuestionPicked
})

const linkedinInArticle = computed({
  get () {
    return store.linkedinTemplate
  },
  set (value: string) {
    store.linkedinTemplate = value
  }
})

const updateLinkedInArticle = debounce(() => {
  const normalArticle = htmlSanitizer(store.linkedinTemplate)
  const data = Object.freeze({
    linkedinTemplate: normalArticle
  })
  if (normalArticle) {
    store.selectedEpisode.linkedinTemplate = normalArticle
    return Promise.resolve(store.updatePodcastEpisode(data))
  }
}, 1000)

async function moveToNextTab () {
  store.linkedinTemplate = linkedinInArticle.value
  await updateLinkedInArticle()
}

onUnmounted(() => {
  Promise.resolve(moveToNextTab())
})

const getStyleForAppCard = computed<string>(() => {
  const background = true
  const border = true
  const minHeight = '200px'
  let properties = background ? 'background: #FCFCFC;' : 'background: none;'
  properties = properties + (border ? 'border: 3px solid #FBDFB3;' : 'border: none;') + (minHeight ? `min-height:${minHeight}` : '')
  return properties
})

const sampleTemplate = `I'm Jim Schubert, and I've been in the insurance industry for 20 years.
I've grown my agency to multiple locations and dozens of agents, and I'm excited to share the secrets
of the industry's top performers with you. In this episode, I interview Wes Becknell
about how to use data to deliver profitability in trucking insurance.
Trucking insurance is a tough business, but by using data to create a risk profile,
agents can bind rates instantly and email endorsements to their insured with the click of a button.
These time-saving strategies will help agents keep their renewals and make more money in the long run.
<br><br>
Here are the steps you need to follow to also get 1. Exponential growth 2. Increased profitability 3. Improved relationships:<br>
1. Using data to create a risk profile<br>
2. Using technology to bind rates and generate endorsements<br>
3. Using leads to generate new business<br>
<br>
1. Using data to create a risk profile<br>
To create a risk profile using data, insurance agents can use a variety of resources to gather information
on their potential customers. This data can include public records, such as inspection reports and
crash reports, as well as information gathered from the customer themselves. By understanding
where a customer has been and what they have been doing, agents can create a more accurate
picture of the risk they pose. This information can then be used to create a more customized and accurate insurance policy for the customer.<br>
<br>
2. Using technology to bind rates and generate endorsements<br>
To bind rates and generate endorsements using technology, insurance agents can use a site like MCSS Net.
This site allows agents to search for potential customers based on criteria like location,
type of commodity hauled, and number of units. Once a Dot number is entered,
the site will generate a binding rate and provide information on the customer, including any
inspections or crashes that have occurred. Endorsements can be generated and emailed to the customer
instantly, and payments can be collected via Epay policy.<br>
<br>
3. Using leads to generate new business<br>
In order to deliver profitability in trucking insurance, data must be used to create a risk profile.
This risk profile is then used to generate a binding rate that can be emailed to the Insured.
Endorsements are also done instantaneously, and payments can be collected via Epay policy.<br>
<br>
Data is essential for insurance agents who want to grow their business and become more profitable.
By using data to create a risk profile, agents can bind rates instantly and email endorsements to
their customers with the click of a button. These time-saving strategies will help agents
keep their renewals and make more money in the long run.<br>
<br>
I’m love to hear how you apply to get 1. Exponential growth 2. Increased profitability 3. Improved relationships.
Leave me a comment on how it went for you or drop any questions you want me to answer!`
</script>

<template>
  <div v-if="allowLinkedInArticle">
    <div v-if="isBlogPostSeoQuestionPicked">
      <!--  Linkedin article template chooser  -->
      <div
        v-if="pickedTemplateIndex === -2"
        class="flex justify-center items-center full-height pb-24 overflow-y-auto"
      >
        <div class="w-full grid grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-24 gap-y-12 px-6 lg:px-12">
          <p class="col-span-3 text-white text-h4 font-black text-center">Choose a template or build your linkedin article from scratch</p>
          <div
            class="col-span-1 flex flex-col items-center gap-4"
            @click="buildFromTemplate(-1)"
          >
            <q-card class="rounded-xl w-full h-44 bg-darkish cursor-pointer">
              <div class="w-full h-full flex justify-center items-center">
                <q-icon
                  color="black"
                  name="add"
                  size="4rem"
                />
              </div>
            </q-card>
            <p class="text-white text-lg font-bold text-center">Build from scratch</p>
          </div>
          <div
            v-for="(blogTemplate, id) in templates"
            v-bind:key="id"
            class="col-span-1 flex flex-col items-center"
            @click="buildFromTemplate(id)"
          >
            <q-card
              class="rounded-xl w-full h-44 cursor-pointer"
              :class="blogTemplate.createdAt"
            />
            <p class="text-white text-lg font-bold mt-4 text-center">{{ blogTemplate.title }}</p>
            <p class="text-white text-sm text-center">Used by us, created by {{ blogTemplate.creator.name }}</p>
          </div>
        </div>
      </div>
      <!--  Linkedin article content / editor  -->
      <div
        v-else
        class="w-full row no-wrap items-center full-height gap-8"
      >
        <div class="col-11">
          <app-skeleton
            v-if="store.showLinkedinArticleSkeleton"
            class="rounded-xl"
            height="70vh"
            width="100%"
          />
          <the-editor
            v-else
            v-model="linkedinInArticle"
            @update:modelValue="moveToNextTab"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
    >
      <p class="lexend-regular text-18 text-center">
        We first need you to click on ‘Blog Post’ <i>(on the left)</i>
        and confirm your blog post topic.<br />
        Once your blog post is created, your linkedin article will automatically follow.
      </p>
    </div>
  </div>
  <div v-else>
    <div class="upgrade-container row no-wrap">
      <div class="col-11">
        <editable-content
          id="linkedinArticle"
          v-model="sampleTemplate"
          mode="blur"
          readonly
          size="xxl"
        />
      </div>
      <div class="card-wrapper absolute-center bg-white q-pa-lg">
        <q-card
          class="upgrade-card row items-center inter-regular full-width"
          flat
          :style="getStyleForAppCard">
          <q-card-section class="col-12">
            <div class="column items-center q-gutter-y-md">
              <div class="text-center inter-medium text-weight-medium text-body1">
                Unlock LinkedIn Article for future episodes by<br>
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
</style>
