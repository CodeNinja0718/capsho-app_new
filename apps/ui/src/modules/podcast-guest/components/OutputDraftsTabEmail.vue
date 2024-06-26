<script setup lang="ts">
import { useUploadPodcastStore } from 'stores/upload-podcast'
import RefreshButton from 'src/modules/podcast/components/RefreshButton.vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { htmlSanitizer } from 'src/utils'
import { debounce } from 'quasar'
import { useSubscription } from 'src/composables/useSubscription'
import type { IEmailOption } from 'src/models/email'
import { useGuestTabs } from 'src/modules/podcast-guest/composables/use-guest-tabs'

const { allowPromotionalEmail, interval } = useSubscription()
const { emailOptions } = useGuestTabs()

const store = useUploadPodcastStore()

const emailType = ref<IEmailOption>({
  default: true,
  disable: false,
  label: 'Promotion',
  tooltip: '',
  value: 'promotion'
})

const emailSubjectLine = computed({
  get() {
    if (store.emailGuest.subjectLine) {
      return [...store.emailGuest.subjectLine].filter((char) => char !== '"').join('')
    } else {
      return ''
    }
  },
  set(value: string) {
    store.emailGuest.subjectLine = value
  }
})

const emailTemplateKey = ref('')

function getNextEmailKey() {
  store.showEmailBodySkeleton = true
  const key = emailType.value.value
  const keys = Object.keys(store.allEmailsGuest[key])
  const currKey = emailTemplateKey.value
  const currKeyIndex = keys.findIndex((val: string) => val === currKey)
  if (currKeyIndex === -1) {
    emailTemplateKey.value = keys[0]
  }
  if (currKeyIndex === keys.length - 1) {
    emailTemplateKey.value = keys[0]
  } else {
    emailTemplateKey.value = keys[currKeyIndex + 1]
  }
  const timer = setTimeout(() => {
    store.showEmailBodySkeleton = false
    clearTimeout(timer)
  }, 500)
}

function getPrevEmailKey() {
  store.showEmailBodySkeleton = true
  const key = emailType.value.value
  const keys = Object.keys(store.allEmailsGuest[key])
  const currKey = emailTemplateKey.value
  const currKeyIndex = keys.findIndex((val: string) => val === currKey)
  if (currKeyIndex === -1) {
    emailTemplateKey.value = keys[0]
  }
  if (currKeyIndex === 0) {
    emailTemplateKey.value = keys[keys.length - 1]
  } else {
    emailTemplateKey.value = keys[currKeyIndex - 1]
  }
  const timer = setTimeout(() => {
    store.showEmailBodySkeleton = false
    clearTimeout(timer)
  }, 500)
}

function getRandomEmailKey() {
  if (store.allEmailsGuest && Object.keys(store.allEmailsGuest).length) {
    store.showEmailBodySkeleton = true
    const key = emailType.value.value
    const keys = Object.keys(store.allEmailsGuest[key])
    const randomKeyIndex = Math.floor(Math.random() * keys.length | 0)
    emailTemplateKey.value = keys[randomKeyIndex]
    const timer = setTimeout(() => {
      store.showEmailBodySkeleton = false
      clearTimeout(timer)
    }, 500)
  }
}

function setEmailTemplateKey() {
  if (store.allEmailsGuest && Object.keys(store.allEmailsGuest).length) {
    if (emailTemplateKey.value) {
      getNextEmailKey()
    } else {
      getRandomEmailKey()
    }
  }
}

const emailBody = computed({
  get() {
    const key = emailType.value.value
    const currEmailKey = emailTemplateKey.value
    if (store.allEmailsGuest && Object.keys(store.allEmailsGuest).length) {
      return store.allEmailsGuest[key][currEmailKey]
    }
    return ''
  },
  set(value: string) {
    if (value) {
      const key = emailType.value.value
      store.allEmailsGuest[key][emailTemplateKey.value] = value
    }
  }
})

const updateEmail = debounce(() => {
  const getEmailSubjectLine = () => {
    if (emailSubjectLine.value) {
      return htmlSanitizer(emailSubjectLine.value)
    } else {
      return ''
    }
  }
  const key = emailType.value.value
  const allEmailsGuest = {
    [key]: {
      [emailTemplateKey.value]: emailBody.value
    },
    ...store.allEmailsGuest
  }
  const getEmailBody = () => {
    if (emailBody.value) {
      return htmlSanitizer(emailBody.value)
    } else {
      return ''
    }
  }
  const data = {
    allEmailsGuest,
    emailGuest: {
      subjectLine: getEmailSubjectLine(),
      body: getEmailBody(),
      engagementBody: store.emailBodyEngagement,
      promotionBody: store.emailBodyPromotion
    },
    drafts: {
      emailSubject: getEmailSubjectLine(),
      email: store.chtEmails ?? {}
    }
  }
  if (key === 'engagement') {
    data.emailGuest.engagementBody = getEmailBody()
  } else {
    data.emailGuest.promotionBody = getEmailBody()
  }
  if (emailSubjectLine.value && emailBody.value) {
    if (store.selectedEpisode.allEmailsGuest) {
      store.selectedEpisode.allEmailsGuest[key] = {
        [emailTemplateKey.value]: emailBody.value
      }
    }
    return Promise.resolve(store.updateGuestPodcastEpisode(data))
  }
}, 500)

const updating = ref(false)

watch(emailType, (key) => {
  updating.value = true
  if (key) {
    getRandomEmailKey()
  }
  const timer = setTimeout(() => {
    updating.value = false
    clearTimeout(timer)
  }, 500)
}, { immediate: true })

watch(emailBody, (updatedEmailBody) => {
  if (updatedEmailBody) {
    moveToTheNext()
  }
}, { immediate: true })

async function moveToTheNext() {
  store.emailGuest.subjectLine = htmlSanitizer(emailSubjectLine.value)
  store.selectedEpisode.emailGuest.subjectLine = htmlSanitizer(emailSubjectLine.value)
  const key = emailType.value.value
  if (key) {
    if (key === 'engagement') {
      store.emailBodyEngagement = htmlSanitizer(emailBody.value)
    } else {
      store.emailBodyPromotion = htmlSanitizer(emailBody.value)
    }
  }
  await updateEmail()
}

onBeforeUnmount(() => {
  Promise.resolve(moveToTheNext())
})

const getStyleForAppCard = computed<string>(() => {
  const background = true
  const border = true
  const minHeight = '200px'
  let properties = background ? 'background: #FCFCFC;' : 'background: none;'
  properties = properties + (border ? 'border: 3px solid #FBDFB3;' : 'border: none;') + (minHeight ? `min-height:${minHeight}` : '')
  return properties
})

const sampleEmailBody = `Hi [Name],<br>
<br>
How can trucking insurance companies use data to deliver profitability?<br>
<br>
When it comes to trucking insurance profitability., here's what you need to know...<br><br>

1. What are the top insurance agents doing to grow their book of business exponentially each month?<br>
2. How can data be used to deliver profitability in trucking insurance?<br>
3. What are the most surprising things that have been learned or encountered when working with trucking?<br>
<br>
I go into a lot more detail in my latest episode, How to Use Data to Deliver Profitability in Trucking Insurance<br>
<br>
Here's where you can listen: Here's where you can listen: [Insert Spotify/Apple/Google player links here]<br>
<br>
[Your Sign Off]`
</script>

<template>
  <div>
    <div
      v-if="allowPromotionalEmail"
      class="q-gutter-y-md"
    >
      <div >
        <div class="row justify-between q-pb-xs">
          <div class="col-10">
            <label
              v-if="store.showEmailSubjectSkeleton"
              class="custom-label"
              for="emailSubjectLine"
            >
              <span>
                Email Subject Line is generating - Please wait
              </span>
              <q-spinner-dots
                color="grey-7"
                size="1.2em"
              />
            </label>
            <label
              v-else
              class="custom-label"
              for="emailSubjectLine"
            >
              Email Subject Line
            </label>
          </div>
        </div>

        <div class="row items-center">
          <div class="col-11">
            <!-- <q-skeleton
              v-if="store.showEmailSubjectSkeleton"
              class="border-radius-6"
              height="40px"
              square
              type="QInput"
            /> -->
            <AppSkeleton
              v-if="store.showEmailSubjectSkeleton || updating"
              class="rounded-xl"
              height="40px"
              width="100%"
            />
            <input
              v-else
              id="emailSubjectLine"
              v-model="emailSubjectLine"
              class="rounded-lg flex items-center h-10 bg-darkish bg-opacity-25 text-grey-3 px-10 w-full ring-2 ring-transparent hover:ring-purple-500 focus:ring-purple-500 outline-none"
              @update:modelValue="moveToTheNext"
            />
          </div>
          <div class="col-1">
            <RefreshButton
              aria-label="Previous"
              class="flip-horizontal"
              dense
              icon="las la-share"
              round
              tooltip
            >
              <template #tooltip>
                Clicking this will take you to the previous option for your email subject line.<br>
                (For when you realize you liked the last one better &#128521;)
              </template>
            </RefreshButton>
            <RefreshButton
              aria-label="Refresh"
              :class="{ 'disabled': !store.emailSubjectLine.isRefreshAllowed }"
              dense
              icon="las la-redo-alt"
              round
              tooltip
              unelevated
            >
              <template #tooltip>
                Clicking this will generate a new version of the email subject line.
              </template>
            </RefreshButton>
          </div>
        </div>
      </div>
      <div>
        <div class="row justify-between q-pb-xs">
          <div class="col-11">
            <div>
              <label
                v-if="store.showEmailBodySkeleton || updating"
                class="custom-label"
                for="emailBody"
              >
                <span>
                  Email Body is generating - Please wait
                </span>
                <q-spinner-dots
                  color="grey-7"
                  size="1.2em"
                />
              </label>
              <label
                v-else
                class="custom-label"
                for="emailBody"
              >
                Email Body
              </label>
              <div class="full-width">
                <q-select
                  v-model="emailType"
                  bg-color="darkish"
                  color="blue"
                  dense
                  filled
                  :options="emailOptions"
                >
                  <template v-slot:option="scope">
                    <q-item
                      v-bind="scope.itemProps"
                      class="bg-darkish text-grey-3"
                    >
                      <div class="row no-wrap items-center">
                        <span>{{ scope.opt.label }}</span>
                        <span class="q-pl-sm">
                          <q-badge
                            v-if="scope.opt.isBeta"
                            color="green"
                            label="Beta"
                            rounded
                          />
                        </span>
                      </div>
                    </q-item>
                  </template>
                  <template v-slot:selected>
                    <div class="row no-wrap items-center">
                      <span class="text-grey-3">{{ emailType.label }}</span>
                      <span class="q-pl-sm">
                        <q-badge
                          v-if="emailType.isBeta"
                          color="green"
                          label="Beta"
                          rounded
                        />
                      </span>
                    </div>
                  </template>
                </q-select>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-11">
            <!-- <q-skeleton
              v-if="store.showEmailBodySkeleton || updating"
              class="border-radius-6"
              height="52.5vh"
              square
              type="QInput"
            /> -->
            <AppSkeleton
              v-if="store.showEmailBodySkeleton || updating"
              class="rounded-xl"
              height="52.5vh"
              width="100%"
            />
            <EditableContent
              v-else
              id="emailBody"
              v-model="emailBody"
              size="lg"
              @update:modelValue="moveToTheNext"
            />
          </div>
          <div class="col-1">
            <RefreshButton
              aria-label="Previous"
              class="flip-horizontal"
              dense
              icon="las la-share"
              round
              tooltip
              @click="getPrevEmailKey"
            >
              <template #tooltip>
                Clicking this will take you to the previous option for your promotional email.<br>
                (Just in case you hit Refresh too quickly &#128522;)
              </template>
            </RefreshButton>
            <RefreshButton
              aria-label="Refresh"
              dense
              icon="las la-redo-alt"
              round
              tooltip
              unelevated
              @click="setEmailTemplateKey"
            >
              <template #tooltip>
                Clicking this will generate a new version of this promotional email.
              </template>
            </RefreshButton>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="row justify-between">
        <div class="col-10">
          <label
            class="custom-label"
            for="emailBody"
          >
            Email body
          </label>
        </div>
      </div>
      <div class="upgrade-container row no-wrap">
        <div class="col-11">
          <EditableContent
            id="emailBody"
            v-model="sampleEmailBody"
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
                  Unlock Promotional Emails for future episodes by<br>
                  upgrading to the Growth Plan, Pro Plan or Capsho Collective!
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
  </div>
</template>

<style scoped>
</style>
