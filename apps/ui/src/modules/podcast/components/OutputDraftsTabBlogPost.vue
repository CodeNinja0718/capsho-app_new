<script setup lang="ts">
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import ExamplePreview from './ExamplePreview.vue'
import TemplatePreview from './TemplatePreview.vue'
import TheEditor from 'src/modules/editor/TheEditor.vue'
import listSvg from 'src/assets/icons/list.svg'
import manualBookSvg from 'src/assets/icons/manual-book.svg'
import questionSvg from 'src/assets/icons/question.svg'
import { TemplateV2 } from 'src/models/template'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { debounce } from 'quasar'
import { hashCode, htmlSanitizer, intToRGB } from 'src/utils'
import { useContentFiller } from 'src/composables/useContentFiller'
import { useSubscription } from 'src/composables/useSubscription'
import { useTemplatesStore } from 'src/stores/templates'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { OutputEpisodeDraftsTabs } from 'src/stores/upload-podcast-state-types'

interface BlogExample {
  content: string
  name: string
  title: string
}

const emit = defineEmits<{(eventName: 'switchTab', tab: OutputEpisodeDraftsTabs): void}>()

const { allowBlogPost, interval } = useSubscription()
const uploadPodcastStore = useUploadPodcastStore()
const { setContentChooser } = useContentFiller()
const templatesStore = useTemplatesStore()

const pickedSeoQuestion = ref<boolean>(false)
const selectedSeoQuestionId = ref<number>(-1)
const blogCategories = ref([
  { name: 'listicle', title: 'Listicle', description: 'Your key points arranged in list form. Choose this if your episode covers a series of way to achieve a desired result or aspiration.', icon: listSvg },
  { name: 'howto', title: 'How-to', description: 'A step-by-step guide that tells your audience how to do something. Choose this if your episode educates your audience about a multi-step framework or process that helps them achieve their desired result', icon: manualBookSvg },
  { name: 'qa', title: 'Q & A', description: "Your key points arranged in Question and Answer format. Choose this if your episode answers key questions on your topic(whether that's in an interview or solo format).", icon: questionSvg }
])
const pickedBlogCategory = ref<boolean>(false)
const selectedBlogCategoryIndex = ref<number>(-1)
const showExampleDialog = ref<boolean[]>([false, false, false])
const confirmCategoryPrompt = ref<boolean>(false)
const pickedTemplate = ref<boolean>(false)
// const selectedTemplateIndex = ref<number>(-2)
const showTemplateDialog = ref<boolean>(false)
const blogExamples = ref<BlogExample[]>([
  {
    name: 'howto',
    title: 'Example of How To Blog Post',
    content: '<h6 style="text-align:center;"><strong>Supercharge Your Exposure: How to Leverage Podcasts for Maximum Impact</strong></h6><p></p><br><br><p>Do you want to make a profit from podcast guesting? Look no further than Christine McAllister. With a career in media and a mission to help people with their online personal brands, Christine is the perfect mentor to teach entrepreneurs how to make the most out of their podcast guesting.&nbsp;</p><br><p>From her own journey as an Olympic broadcaster to her tragic story of child loss, Christine brings a unique level of knowledge and understanding to the show. In this episode, I\'ll outline how Christine McAllister did it in detail - so stay tuned to learn how you can benefit from her podcasting wisdom!</p><br><p></p><br><p><strong>1. Find the right people to pitch to and craft the perfect pitch.</strong></p><br><p>The first step towards monetizing your podcast guest appearances is to identify the right people to pitch to, and craft the perfect pitch. Essentially, you want to start by finding a podcast that people in your audience or client list like, and do your market research until you’ve found that one podcast that is a perfect fit for you. Once you’ve found the right podcast to pitch to, it is time to create the perfect pitch. Invest time into creating a pitch that will tell them exactly what value you bring to the table, and make it easy for them to say yes.&nbsp;</p><br><p>Videos are an investment of time and effort, but they really leave an impression on the host and they are almost never done by podcasters. By providing a video, you will stand out and make -a lasting impression. Additionally, don’t forget to do your research, listen to a recent episode of the podcast in order to ensure you have the same energy and values as the host, and note any information about the host and their audience.&nbsp; Ultimately, if you can do your research, create a personal and authentic pitch, and make it a goal to provide value over transactions, you will be set up for an easy yes and for an engaging, profitable podcast guest appearance.<br></p><br><p><strong>2. Be a powerful and respectful guest.&nbsp;</strong></p><br><p>In order to be a powerful and respectful guest, the most important thing is to prepare for the interview. All preparation should be done before the conversation begins. First, you should do your research about the show, the host, and the audience. Listen to a recent episode and see if it\'s the right fit for you and your message. Make sure you understand the tone and atmosphere of the show, as this will set the stage for the conversation ahead.&nbsp;</p><br><p>Second, make sure you are ready to have an engaging and enjoyable conversation. Don\'t put too much pressure on yourself—allow the conversation to flow naturally and make the most of these conversations. Respect the host, and don\'t be afraid to ask questions and engage with them both in the moment and afterwards. Show your appreciation for the opportunity to be on their show and invite feedback, as this can be invaluable as you go forward.&nbsp;</p><br><p>Finally, it\'s important to be mindful of the message you want to convey. Come prepared with a few talking points that will help you stay focused and ensure you do justice to your message. Having talking points will also help keep the conversation going. Similarly, make sure you have a place for people to go afterwards if they want to follow up and connect with you. Offer them one \'landing spot\' that highlights and sells your offer and ensures you are driving revenue.</p><br><p></p><br><p><strong>3. Follow through with monetization opportunities.&nbsp;</strong></p><br><p>Once you’ve nailed your podcast guest appearance, it’s time to follow-through with monetization opportunities. Step three involves guiding your audience to a specific platform, like your website, where they can learn more about you and your services. You want to take the conversation and the bond you created with the podcast host and your audience and bring them to a designated place where you can provide further information and services to your audience that provide invaluable value.&nbsp;</p><br><p>To do this, you’ll want to create an incoming stream, like an email sequence or a freebie that you know has already been validated with your audience, or an item from your business you know can solve their next problem. Offer this sincerely and simply, highlighting your freebie with authentic stories and intriguing points. When creating this flow, refrain from providing too many options. Instead, narrow down the choices and give your audience one place to go to connect with you. This will make it easier and guarantee that you can continue your conversation with them and cultivate a valuable connection. Doing this will also set you up perfectly to start the monetization process with your audience, so don\'t skip out on this crucial step!</p><br><p></p><br><p><strong>4. Leverage the podcast guest appearance to create a month\'s worth of social media content.</strong></p><br><p>Step 4 is to leverage the podcast guest appearance to create a month\'s worth of social media content. The first step is to transcribe the episode, as this can be downloaded, shared and repurposed as content in a number of ways. This will allow you to pinpoint the relevant quotes and messages that can be used as social media posts, email content and topic discussion posts. Additionally, make sure to tag the host in each post in order to credit and promote their account.&nbsp;</p><br><p>You should also explore the option of collaboration. Since the podcast guest appearance was successful, use this as an opportunity to create a stronger connection with the host, exchange ideas and look for ways to further promote one another. This could take the form of a shared post exchange, webinar collaboration, or even a product or service cross-promotion.</p><br><p>Finally, make sure to create a tangible offer and clearly state it within each post. This should be easy for people to understand and should accurately represent the message from the episode. Examples of this could be a downloadable PDF, a one-time session or a course. This will not only monetize the podcast guest appearance, but create an interesting and engaging call-to-action for potential customers.</p><br><p>By applying the steps outlined in this blog, you can create an enticing podcast guesting that is both enjoyable and monetizable. Start by identifying the right people to pitch to and craft the perfect pitch. Then remember to be a powerful and respectful guest while also capitalizing on monetization opportunities. Don\'t forget to leverage the podcast guest appearance to create a month\'s worth of social media content. With the right preparation and attitude, you can be just as successful as those with experience. You can make it happen!</p><br>'
  },
  {
    name: 'listicle',
    title: 'Example of Listicle Blog Post',
    content: '<h6 style="text-align:center;"><strong>3 Must-Know Email Tips for Podcasting Entrepreneurs</strong></h6><p><br></p><br><p>Email can be an overwhelming task for entrepreneurs, but it doesn\'t have to be. In this blog post, we\'ll cover the basics of email management and how to make it easier for entrepreneurs. I\'ll be sharing my experience as an entrepreneur who is a "no red number" person - but I\'ll also make sure to emphasize that everyone\'s email priorities are different and that\'s okay. By the end of this post, entrepreneurs will have the tools to create a more manageable and less stressful email inbox, as well as improved boundaries and higher quality of life. So let\'s get started!&nbsp;<br></p><br><p>1. Put Everything In Its Place: For Email Efficiency&nbsp;</p><br><p>2. Decide Once: Use Gmail for Easier Organization&nbsp;</p><br><p>3. Zones for Urgent/Non-Urgent Emails: For Easier Finding&nbsp;<br></p><br><p><strong>1. Put Everything In Its Place: For Email Efficiency</strong></p><br><p>Put Everything In Its Place: For Email Efficiency is an important principle for entrepreneurs to remember when managing their email inbox. This principle can help entrepreneurs to create an efficient system for their emails that works for them. It involves deciding once to use a search function to find emails, rather than creating complex folders, which can be difficult to manage.&nbsp;</p><br><p>Additionally, it involves creating boundaries for their emails, whether it is for their own personal habits or those of their colleagues. This can involve creating an auto-response, removing the email app from their phone, or turning off notifications. By putting everything in its place and creating boundaries, entrepreneurs can reduce their stress related to emails, creating a better quality of life.</p><br><p></p><br><p><strong>2. Decide Once: Use Gmail for Easier Organization&nbsp;</strong></p><br><p>Decide Once: Use Gmail for Easier Organization is an important tool for entrepreneurs because managing their inbox can be a very time-consuming task. Using Gmail can help in terms of organizational structure and efficiency as it is equipped with a powerful search function that can help you quickly find what you need. Gmail also has a built-in filing system, which can help you easily organize your emails and make them easier to find later.&nbsp;</p><br><p>Furthermore, Gmail allows you to set boundaries for yourself and when you are available to answer emails, which can help save time and energy. By implementing some of the tips discussed in the transcript, entrepreneurs can use Gmail for easier organization and be more productive and efficient.</p><br><p></p><br><p><strong>3. Zones for Urgent/Non-Urgent Emails: For Easier Finding&nbsp;</strong></p><br><p>Zones for Urgent/ Non-Urgent Emails: For Easier Finding is an important concept for entrepreneurs to consider when trying to make their email inboxes more manageable and less stressful. By utilizing this concept, entrepreneurs can create a more efficient system for their emails. This can be done by creating zones for emails that require more immediate attention and those that do not. For example, emails that require immediate attention can be set in a small, more obvious zone while those that do not require immediate attention can be set in a larger zone. This will help entrepreneurs easily identify which emails need to be addressed first and which can be put off for later.&nbsp;</p><br><p>Additionally, utilizing Gmail’s search function can help entrepreneurs better organize their emails by allowing them to quickly search for emails that they need, instead of attempting to remember what folder or tag they used for a certain email. Implementing boundaries for both work and personal emails can also help entrepreneurs be less overwhelmed by their emails. For work emails, entrepreneurs can set an auto-response that explains when they will be available or remove the work email from their phone. For personal emails, entrepreneurs can turn off notifications and unsubscribe from emails that are no longer needed.&nbsp;&nbsp;</p><br><p>Email marketing is an incredibly powerful tool for entrepreneurs to reach out to their customers or potential partners. By following the above takeaways, entrepreneurs are able to make the most out of their email marketing efforts. First, by putting everything in its place, entrepreneurs are able to increase their efficiency by minimizing the time they need to spend looking for emails or organizing them. Secondly, by using Gmail for easier organization, entrepreneurs can easily categorize and prioritize emails, making the process of finding them much easier.&nbsp;</p><br><p>Additionally, by setting time and boundaries for responding to emails, entrepreneurs are able to create some balance in their personal and professional lives, ensuring that they have enough time to dedicate to other activities. Moreover, by turning off notifications, entrepreneurs can avoid distractions and annoyance, allowing them to stay focused on their tasks. Finally, by unsubscribing and starting small, entrepreneurs can create a healthy relationship with email, which will help them in the long run.&nbsp;</p><br><p>This can be seen in a study that showed that email marketing generates $38 for every $1 spent, allowing small businesses to maximize their profits. As such, entrepreneurs should take these takeaways seriously and use them to make email marketing work for them.</p><br>'
  },
  {
    name: 'qa',
    title: 'Example of Q & A Blog Post',
    content: '<h6 style="text-align:center;">Optimizing Your Social Media Posts for SEO: Tips, Strategies, and Benefits for Growing Your Podcast Audience</h6><p></p><br><p>Are you a podcasting entrepreneur looking to optimize your social media marketing strategy? Are you wondering the best ways for you to show up effectively on social media platforms? Or maybe you\'re trying to build an audience on rented land? If so, this blog post is for you!&nbsp;</p><br><p>Here, we will answer the most common questions podcasting entrepreneurs have on social media marketing, such as how to create content, use Google to find topics, and the three key elements of a successful social media post. Read on to learn how to optimize your social media marketing strategy and build an audience on rented land!</p><br><p></p><br><p><strong>1. How can podcasting entrepreneurs optimize their social media marketing strategy?&nbsp;</strong></p><br><p>Podcasting entrepreneurs can optimize their social media marketing strategy by picking two platforms to focus on, creating a framework for their content, and crafting posts with a hook, body, and call to action. For example, if you pick Instagram and LinkedIn, you can create a framework for your content by choosing four frequently asked questions and designing posts that answer each one.&nbsp;</p><br><p>You can then craft the posts to include a hook, body, and call to action. Your hook could be something intriguing like “Do you wish there was a way for you to grow your email list using LinkedIn?”, your body could explain how this is possible, and your call to action could be something like “Click the link in my bio to learn more!”. By taking these steps, podcasting entrepreneurs can create a social media marketing strategy that is both effective and efficient.</p><br><p></p><br><p><strong>2. What are the best ways for podcasting entrepreneurs to show up effectively on social media platforms?&nbsp;</strong></p><br><p>Podcasting entrepreneurs who want to show up effectively on social media platforms should focus on two or three platforms that they are comfortable with and understand the specific content preferences of each. For example, Instagram offers five different ways to post content, including single images, carousel posts, short form video, Instagram Live, and Stories.&nbsp;</p><br><p>Taking a step back and considering the type of content they are ready to produce and their target audience can help podcasting entrepreneurs decide which platforms to focus on. Once they have chosen their platforms, entrepreneurs should create a strategy for their content with the goal of providing value to their audience. A great way to do this is by answering frequently asked questions. By researching these questions and finding guests who can answer them, entrepreneurs can create a framework for their content. This framework can be as simple as taking one hour per week to plan out the content for the next few weeks.</p><br><p>&nbsp;When creating content, entrepreneurs should also focus on the anatomy of a solid post. This means including a hook, a SEO filled caption body, and a call to action. Ask your audience to comment or share if they relate, or to click the link in your bio to learn more. By following this advice, podcasting entrepreneurs can show up effectively on social media and reach</p><br><p></p><br><p><strong>3. How can podcasting entrepreneurs build an audience on rented land?&nbsp;</strong></p><br><p>&nbsp;Podcasting entrepreneurs can build an audience on rented land by utilizing the various social media platforms available to them. It is important to choose two platforms to focus on that have the desired demographic and to show up effectively by utilizing all the features the platform offers. For example, on Instagram, a podcasting entrepreneur could post single images, carousels, short form video content, Instagram Lives, and stories.&nbsp;</p><br><p>It is also important to be intentional with content by choosing four topics that are frequently asked questions and creating content around them for the month. For example, if a podcasting entrepreneur is asked about why Instagram Reach is down, they could create a carousel post on the reasons why, a reel of a guest from their podcast talking about the topic, and a single image with a call to action to listen to the podcast episode. They can also utilize Google to find popular search terms of questions people are asking. By taking an hour a week to plan out their content and create the anatomy of their post, podcasting entrepreneurs can effectively build an audience on rented land.</p><br><p>Social media marketing is an essential component of success for podcasting entrepreneurs. By optimizing their social media campaigns, entrepreneurs can increase their visibility and reach a larger audience. The best way to show up effectively on social media platforms is to create engaging content that resonates with their target audience. Podcasting entrepreneurs can build an audience on rented land by creating content that is relevant to their niche and sharing it on various social media channels.&nbsp;</p><br><p>The most effective way to create content for their social media channels is to use Google to find topics to write about and to create posts that are interesting and informative. The three key elements of a successful social media post for podcasting entrepreneurs are creating content that is relevant to their niche, using visuals to draw attention, and engaging with their audience by responding to comments and messages. By taking the time to create content that is interesting and engaging, podcasting entrepreneurs can build an audience and increase their visibility on social media platforms.</p><br>'
  }
])
const blogExample = ref<BlogExample>({ name: '', title: '', content: '' })
const templateExample = ref<TemplateV2>({} as TemplateV2)
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
  I’m love to hear how you apply ${uploadPodcastStore.solution} to get ${uploadPodcastStore.ultimateResult}.<br>
  Leave me a comment on how it went for you or drop any questions you want me to answer!`

const blogPostSeoQuestions = computed(() => uploadPodcastStore.blogTopics) // uploadPodcastStore.blogPostSeoQuestions)
const templates = computed(() => templatesStore.templates.filter((template) => template.type === `blogPost(${selectedBlogCategoryIndex.value >= 0 ? blogCategories.value[selectedBlogCategoryIndex.value].title : 'Listicle'})Layout`))
const isBlogPostSeoQuestionPicked = computed(() => {
  if (uploadPodcastStore.blogTemplate) {
    return true
  }
  return uploadPodcastStore.isBlogPostSeoQuestionPicked
})
const blogPost = computed({
  get () {
    if (uploadPodcastStore.blogTemplate) {
      return uploadPodcastStore.blogTemplate
    }
    return ''
  },
  set (value: string) {
    uploadPodcastStore.blogTemplate = value
  }
})
const getStyleForAppCard = computed<string>(() => {
  const background = true
  const border = true
  const minHeight = '200px'
  let properties = background ? 'background: #FCFCFC;' : 'background: none;'
  properties = properties + (border ? 'border: 3px solid #FBDFB3;' : 'border: none;') + (minHeight ? `min-height:${minHeight}` : '')
  return properties
})

function pickBlogPostCategory (id: number) {
  emit('switchTab', `Blog Post(${blogCategories.value[id].title})` as OutputEpisodeDraftsTabs)
  selectedBlogCategoryIndex.value = id
  pickedBlogCategory.value = true
  uploadPodcastStore.blogPostCht = blogCategories.value[id].title
}
function pickSeoQuestion () {
  confirmCategoryPrompt.value = true
}
function confirmBlogPostTopic () {
  pickedSeoQuestion.value = true
  confirmCategoryPrompt.value = false
  uploadPodcastStore.isBlogPostSeoQuestionPicked = true
  uploadPodcastStore.updateBlogPostSeoQuestion()
}
async function moveToTheNext () {
  uploadPodcastStore.blogTemplate = blogPost.value
  await updateBlogPost()
}
function buildFromTemplate (tempIndex: number) {
  if (selectedBlogCategoryIndex.value >= 0) {
    pickedTemplate.value = true
    // selectedTemplateIndex.value = tempIndex
    const contentChoices = ['Blog Post(Listicle)', 'Blog Post(How-to)', 'Blog Post(Q & A)']
    if (uploadPodcastStore.selectedEpisode.layouts) {
      uploadPodcastStore.selectedEpisode.layouts.isBlogPostPicked = true
    } else {
      uploadPodcastStore.selectedEpisode.layouts = {
        isDescriptionPicked: false,
        isPodcastWebsiteContentPicked: false,
        isEmailPicked: false,
        isBlogPostPicked: true,
        isLaPicked: false,
        isYtPicked: false
      }
    }
    uploadPodcastStore.updatePodcastEpisode({
      layouts: {
        isBlogPostPicked: true
      }
    })
    setContentChooser(contentChoices[selectedBlogCategoryIndex.value])
  }
}
function showExample(name: string, id: number) {
  blogExample.value = blogExamples.value.find(ex => ex.name === name) as BlogExample
  showExampleDialog.value[id] = true
}
function showTemplate(template: TemplateV2) {
  templateExample.value = template
  showTemplateDialog.value = true
}

const updateBlogPost = debounce(() => {
  const getTemplate = () => {
    if (uploadPodcastStore.blogTemplate) {
      return htmlSanitizer(blogPost.value)
    } else {
      return ''
    }
  }
  const blogPostTemplate = getTemplate()
  const data = Object.freeze({
    blogPostTemplate
  })
  if (blogPostTemplate === '') {
    return null
  } else {
    uploadPodcastStore.selectedEpisode.blogPostTemplate = blogPostTemplate
    return Promise.resolve(uploadPodcastStore.updatePodcastEpisode(data))
  }
}, 1000)

onUnmounted(() => {
  Promise.resolve(moveToTheNext())
})
</script>

<template>
  <div v-if="!allowBlogPost">
    <template v-if="!(pickedSeoQuestion || isBlogPostSeoQuestionPicked) || !pickedBlogCategory">
      <!--  Blog type chooser  -->
      <div v-if="!pickedBlogCategory">
        <div class="grid grid-cols-3 gap-x-12 xl:gap-x-24 px-6 lg:px-12">
          <p class="col-span-3 text-3xl font-semibold text-center mb-0">Choose what type of {{uploadPodcastStore.outputEpisodeTab}} you want to create for this episode.</p>
          <p class="col-span-3 text-hint text-2xl text-center mb-9">You'll only be able to choose your blog type once for each episode so choose carefully.</p>
          <div
            v-for="(blogCategory, id) in blogCategories"
            v-bind:key="id"
            class="col-span-3 lg:col-span-1"
            @click="pickBlogPostCategory(id)"
          >
            <q-card
              class="category-card relative h-full rounded-3xl flex flex-col items-center gap-5 px-8 py-10 bg-darkish border-4 border-solid overflow-hidden cursor-pointer"
              :class="showExampleDialog[id] ? 'active border-accent' : 'border-transparent hover:border-accent'"
            >
              <div class="w-auto h-32 flex items-center">
                <img
                  alt=""
                  class="w-auto h-32"
                  :src="blogCategory.icon"
                >
              </div>
              <h6 class="text-white text-xl my-0">{{ blogCategory.title }}</h6>
              <p class="text-white text-base text-center">{{ blogCategory.description }}</p>
              <q-btn
                class="see-example-btn absolute"
                color="accent"
                label="See an example"
                no-caps
                rounded
                @click.stop="showExample(blogCategory.name, id)"
              />
            </q-card>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          v-if="!confirmCategoryPrompt && !pickedSeoQuestion"
          class="container mx-auto h-full flex justify-center items-center overflow-auto pb-24"
        >
          <div class="container mx-auto flex flex-col gap-4">
            <h5 class="text-center font-semibold">Choose the topic you would like your How To blog post to focus on (or add your own). You can only choose one. (Warning: No backsies once you’ve confirmed your topic!)</h5>
            <div
              v-for="(seoQuestion, idx) in blogPostSeoQuestions"
              :key="idx"
              class="bg-darkish rounded-2xl h-16 flex items-center justify-between px-8 mx-6"
              :class="selectedSeoQuestionId === idx ? 'border-accent border-2 border-solid' : ''"
            >
              <span class="text-xl">{{ idx }}. {{ seoQuestion }}</span>
              <q-btn
                class="w-28 h-9 flex justify-center items-center"
                :color="selectedSeoQuestionId === idx ? 'accent-custom' : 'grey-10'"
                label="Select"
                no-caps
                rounded
                unelevated
                @click="selectedSeoQuestionId = idx;uploadPodcastStore.blogSeoQuestion = seoQuestion"
              />
            </div>
            <template v-if="selectedSeoQuestionId > -1">
              <span class="mt-4 px-12">Input/edit your topic</span>
              <q-input
                v-model="uploadPodcastStore.blogSeoQuestion"
                bg-color="darkish"
                class="px-8"
                color="accent"
                outlined
                rounded
              />
              <div class="flex justify-between items-center px-12">
                <span class="text-sm">This is your chosen blog post topic. Please make any changes and confirm so we can create your blog post for you.</span>
                <q-btn
                  class="h-9 flex justify-center items-center"
                  color="accent-custom"
                  label="Confirm topic & generate"
                  no-caps
                  rounded
                  unelevated
                  @click="pickSeoQuestion()"
                />
              </div>
            </template>
          </div>
        </div>
        <div v-else-if="confirmCategoryPrompt">
          <q-dialog
            v-model="confirmCategoryPrompt"
            persistent
          >
            <div>
              <div class="bg-darkish px-16 py-12 flex flex-col gap-8 rounded-2xl w-[375px] md:w-[476px] lg:w-[560px] xl:w-[700px]">
                <h4 class="text-xl font-bold mb-0">You are creating a {{ blogCategories[selectedBlogCategoryIndex].title }} {{ uploadPodcastStore.outputEpisodeTab }} for this episode for the topic: {{ uploadPodcastStore.blogSeoQuestion }}</h4>
                <p class="mb-0 text-lg">You can only create one {{ uploadPodcastStore.outputEpisodeTab }} per episode so please confirm this is the {{ uploadPodcastStore.outputEpisodeTab }} type and topic you want for this episode.</p>
                <div class="flex justify-between items-center">
                  <q-btn
                    class="w-20 h-9"
                    color="black"
                    dark
                    dense
                    label="Back"
                    no-caps
                    rounded
                    @click="confirmCategoryPrompt = false"
                  />
                  <q-btn
                    class="w-28 h-9"
                    color="accent"
                    dark
                    dense
                    label="Confirm"
                    no-caps
                    rounded
                    @click="confirmBlogPostTopic()"
                  />
                </div>
              </div>
            </div>
          </q-dialog>
        </div>
      </div>
    </template>
    <template v-else>
      <!--  Blog post template chooser  -->
      <div
        v-if="!pickedTemplate"
        class="flex justify-center items-center full-height pb-24 overflow-y-auto"
      >
        <div class="w-full template-wrapper">
          <h4 class="text-white text-h4 font-black text-center mb-0">Choose a template or build your {{ uploadPodcastStore.outputEpisodeTab }} from scratch</h4>
          <p class="text-center mb-10">Each template is fully customizable and you can always come back to choose a different template</p>
          <div
            v-if="templatesStore.loadingTemplates"
            class="w-full flex justify-center items-center"
          >
            Loading
          </div>
          <div
            v-else
            class="container mx-auto grid grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-24 px-16 md:px-20 lg:px-28 xl:px-40 gap-16"
          >
            <div
              class="col-span-1 flex flex-col items-center gap-4"
              @click="buildFromTemplate(-1)"
            >
              <div class="rounded-3xl w-full h-44 bg-darkish cursor-pointer">
                <div class="w-full h-full flex justify-center items-center">
                  <q-icon
                    color="black"
                    name="add"
                    size="8rem"
                  />
                </div>
              </div>
              <p class="text-white text-2xl font-semibold text-center my-0">Build from scratch</p>
            </div>
            <div
              v-for="(blogTemplate, id) in templates"
              v-bind:key="id"
              class="col-span-1 flex flex-col items-center gap-4"
              @click="buildFromTemplate(id)"
            >
              <div
                class="rounded-3xl w-full h-44 bg-darkish cursor-pointer relative template-card"
                :style="'background: ' + blogTemplate.coverImage + 'background-color: #'+ intToRGB(hashCode(blogTemplate.title))"
              >
                <button
                  class="preview-btn bg-accent"
                  @click.stop="showTemplate(blogTemplate)"
                >Preview</button>
              </div>
              <p class="text-white text-2xl font-semibold text-center my-0">{{ blogTemplate.title }}</p>
              <p class="text-white text-sm text-center">Made by {{ blogTemplate.creator.name }}</p>
              <!-- <q-card
                class="rounded-xl w-full h-44 cursor-pointer template-card"
                :style="{'background-image': blogTemplate.previewImage ? 'url(' + blogTemplate.previewImage +')' : `url(/src/assets/capsho-logo.jpg)`}"
              >
                <button
                  class="preview-btn"
                  @click.stop="showTemplate(blogTemplate)"
                >Preview</button>
              </q-card>
              <p class="text-white text-lg font-bold mt-4 text-center template-card-title">{{ blogTemplate.title }}</p>
              <p class="text-white text-sm text-center template-card-author">Made by {{ blogTemplate.creator.name }}</p> -->
            </div>
          </div>
        </div>
      </div>
      <!--  Blog content / editor  -->
      <div
        v-else
        class="w-full full-height"
      >
        <AppSkeleton
          v-if="uploadPodcastStore.generatingBlogPostDrafts"
          class="rounded-xl"
          height="58vh"
          width="100%"
        />
        <TheEditor
          v-model="blogPost"
          @update:modelValue="moveToTheNext"
        />
      </div>
    </template>
  </div>
  <div
    v-else
    class="upgrade-container row no-wrap grow shrink">
    <div class="col-11">
      <editable-content
        v-model="sampleBlogPostTemplate"
        mode="blur"
        readonly
        size="xxl"
      />
    </div>
    <div class="card-wrapper absolute-center bg-white q-pa-lg">
      <q-card
        class="upgrade-card row items-center inter-regular full-width bg-transparent"
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
  <!-- Blog type sample preview -->
  <q-dialog
    v-for="id in [0,1,2]"
    :key="id"
    v-model="showExampleDialog[id]"
  >
    <div class="container">
      <ExamplePreview :blogExample="blogExample" />
    </div>
  </q-dialog>
  <!-- Layout sample preview -->
  <q-dialog v-model="showTemplateDialog"
  >
    <TemplatePreview :templateExample="templateExample" />
  </q-dialog>
</template>

<style lang="scss" scoped>
@import "src/css/quasar.variables";
.category-card {
  .see-example-btn {
    bottom: -44px;
    transition: bottom 0.3s;
  }
  &:hover, &.active {
    .see-example-btn {
      bottom: 24px;
    }
  }
}

.template-card {
  background-size: 100% auto;
  background-position: center;
  transition: 0.3s;
  box-shadow: 0 0 0 $dark;
  border: 3px solid transparent;
  &:hover{
    box-shadow: 0 0 10px $accent;
    border: 3px solid $accent;
    .preview-btn{
      display: block;
    }
  }
  .preview-btn{
    position: absolute;
    z-index: 0;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 10px;
    display: none;
    padding: 03px 10px;
    color: white;
    background-color: $secondary-dark;
    border-radius: 18px;
    outline: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s;
    &:hover{
      box-shadow: 0 0 10px $accent;
    }
  }
}
</style>
