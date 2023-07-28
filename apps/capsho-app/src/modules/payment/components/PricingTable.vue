<script setup>
import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import { useNotification } from 'src/composables/useNotification'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { firestore } from 'src/services/firebase/db'
import { getProProductPriceIds, makeStripeProducts } from 'src/services/firebase/stripe-products'
import { useAuthStore } from 'stores/auth-store'
import { useSubscription } from 'src/composables/useSubscription'
import AppCard from 'components/AppCard.vue'
import upperFirst from 'src/helpers/upper-first-char'

const props = defineProps({
  mode: {
    type: String,
    required: false
  }
})

const planMode = ref(props.mode)

const annual = ref(false)
const showUpdateSubscriptionMessageDialog = ref(false)
const subscriptionPriceId = ref('')
const selectedPlanName = ref('')
const pagination = ref({
  rowsPerPage: 0
})
const $q = useQuasar()

const products = computed(() => makeStripeProducts())

const columnsV2 = [
  {
    name: 'name',
    required: true,
    label: 'Key Features',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
    style: 'width: 100%; max-width: 500px;'
  },
  {
    name: 'starter',
    required: true,
    label: 'Starter Plan',
    align: 'center',
    field: 'starter',
    style: 'width: 100%; max-width: 300px;'
  },
  {
    name: 'growth',
    required: true,
    label: 'Growth Plan',
    align: 'center',
    field: 'growth',
    style: 'width: 100%; max-width: 300px;'
  },
  {
    name: 'pro',
    required: true,
    label: 'Pro Plan',
    align: 'center',
    field: 'pro',
    style: 'width: 100%; max-width: 300px;'
  },
  {
    name: 'agency',
    required: false,
    label: 'Agency Plan',
    align: 'center',
    field: 'agency',
    style: 'width: 100%; max-width: 300px;'
  }
]
const rows = [
  {
    name: 'Number of Episode Credits included per month',
    info: '*1 episode credit gives you the ability to upload 1 episode',
    starter: {
      monthlyCredits: 4
    },
    growth: {
      monthlyCredits: 4
    },
    pro: {
      monthlyCredits: 4
    },
    agency: {
      monthlyCredits: 'Custom'
    }
  },
  {
    name: 'Episode Titles',
    starter: true,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'Episode Descriptions',
    starter: true,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'Episode Show Notes',
    starter: true,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'Episode Transcript',
    starter: true,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'Facebook / Instagram Promotion Captions',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'Facebook / Instagram Engagement Captions',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'Twitter Promotional Tweets',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'Twitter Engagement Tweets',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'LinkedIn Promotional Posts',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'LinkedIn Engagement Posts',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'TikTok Promotional Captions',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'TikTok Engagement Captions',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'Promotional Emails',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'Engagement Emails',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'Facebook / Instagram Educational Captions',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'Twitter Educational Captions',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'LinkedIn Educational Posts',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'TikTok Educational Captions',
    starter: false,
    growth: true,
    pro: true,
    agency: true
  },
  {
    name: 'LinkedIn Articles',
    starter: false,
    growth: false,
    pro: true,
    agency: true
  },
  {
    name: 'Blog Posts',
    starter: false,
    growth: false,
    pro: true,
    agency: true
  },
  {
    name: 'YouTube Descriptions',
    starter: false,
    growth: false,
    pro: true,
    agency: true
  },
  {
    name: 'Monthly Training with a Podcast Growth Expert',
    starter: false,
    growth: false,
    pro: true,
    agency: false
  },
  {
    name: 'Price for Additional Episodes',
    starter: {
      additionalEpisodePrice: '$7.25'
    },
    growth: {
      additionalEpisodePrice: '$15'
    },
    pro: {
      additionalEpisodePrice: '$18'
    },
    agency: {
      additionalEpisodePrice: 'Custom'
    }
  },
  {
    name: 'Unused Episode Rollover',
    starter: {
      unusedEpisode: 'Episode Credits\n are live for 6\n months after\n date of issue'
    },
    growth: {
      unusedEpisode: 'Episode Credits\n are live for 6\n months after\n date of issue'
    },
    pro: {
      unusedEpisode: 'Episode Credits\n are live for 6\n months after\n date of issue'
    },
    agency: {
      unusedEpisode: 'Episode Credits\n are live for 6\n months after\n date of issue'
    }
  },
  {
    name: 'Price',
    starter: {
      price: '$290.00',
      priceId: 'price_1LeMWuIxtUtbG5yK3PuJoLNi',
      highlight: '',
      action: 'Get started now',
      save: '17%'
    },
    growth: {
      price: '$590.00',
      priceId: 'price_1LeMZYIxtUtbG5yKeFLhJDZR',
      highlight: '',
      action: 'Get started now',
      save: '17%'
    },
    pro: {
      price: '$864.00',
      priceId: 'price_1LeMbaIxtUtbG5yKh0j2br2M',
      highlight: '',
      action: 'Get started now',
      save: '20%'
    },
    agency: {
      price: '$1,999.00',
      priceId: 'price_1LNgIkIxtUtbG5yKFIwribXd',
      highlight: '',
      action: 'Get started now',
      save: '22%'
    }
  }
]
const productRows = computed(() => {
  const res = [...rows]
  if (annual.value) {
    const row = res.find((val) => val.name === 'Price')
    products.value.yearly.forEach((product) => {
      row[product.role] = {
        ...product
      }
    })
    // res.push(row)
  } else {
    const row = res.find((val) => val.name === 'Price')
    products.value.monthly.forEach((product) => {
      row[product.role] = {
        ...product
      }
    })
    // res.push(row)
  }
  return res
})

const authStore = useAuthStore()

const { subscribedPlan, interval, activeSubscription } = useSubscription()

const disableStarter = computed(() => {
  if (annual.value) {
    return subscribedPlan.value === 'starter' && interval.value === 'year'
  } else {
    return subscribedPlan.value === 'starter' && interval.value === 'month'
  }
})

const disableGrowth = computed(() => {
  if (annual.value) {
    return subscribedPlan.value === 'growth' && interval.value === 'year'
  } else {
    return subscribedPlan.value === 'growth' && interval.value === 'month'
  }
})

const disablePro = computed(() => {
  if (annual.value) {
    return subscribedPlan.value === 'pro' && interval.value === 'year'
  } else {
    return subscribedPlan.value === 'pro' && interval.value === 'month'
  }
})

const disableAgency = computed(() => {
  if (annual.value) {
    return subscribedPlan.value === 'agency' && interval.value === 'year'
  } else {
    return subscribedPlan.value === 'agency' && interval.value === 'month'
  }
})

async function cancelCurrentSubscription() {
  const subId = activeSubscription.value.items[0].subscription
  if (!subId) {
    throw new Error('Invalid number of arguments')
  }
  const response = await authStore.$paymentFunctions.cancelSubscription(subId)
  return response.data
}

async function startSubscriptionSession (priceId, redirectURL) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return null
  }
  if (planMode.value === 'update') {
    const subscription = await cancelCurrentSubscription()
    if (subscription.status !== 'canceled') {
      $q.loading.hide()
      return null
    }
  }
  const isPromotion = isPromotionPriceId(priceId)
  const colRef = collection(firestore(), 'users', user.uid, 'checkout_sessions')
  const docRef = await addDoc(colRef, {
    price: priceId,
    success_url: redirectURL,
    cancel_url: redirectURL,
    allow_promotion_codes: annual.value === false || isPromotion
  })
  // Wait for the CheckoutSession to get attached by the extension
  onSnapshot(docRef, (snap) => {
    const data = snap.data()
    let error
    let url
    if (data) {
      error = data.error
      url = data.url
    }
    if (error) {
      $q.loading.hide()
      // Show an error to your customer and
      // inspect your Cloud Function logs in the Firebase console.
      alert(`An error occurred: ${error.message}`)
    }
    if (url) {
      // We have a Stripe Checkout URL, let's redirect.
      window.location.assign(url)
    }
  })
}

async function subscribe () {
  $q.loading.show({
    delay: 400 // ms
  })
  const priceId = subscriptionPriceId.value
  const { triggerWarning } = useNotification()
  const redirectURL = window.location.origin + '/podcast/upload'
  if (priceId) {
    await startSubscriptionSession(priceId, redirectURL)
  } else {
    triggerWarning('Pick a plan first')
  }
}

function isPromotionPriceId(priceId) {
  const proProduct = getProProductPriceIds()
  return proProduct.yearly === priceId
}

function confirmSubscription ({ plan, priceId }) {
  selectedPlanName.value = upperFirst(plan)
  subscriptionPriceId.value = priceId
  showUpdateSubscriptionMessageDialog.value = true
}
</script>

<template>
  <div class="q-px-xl q-pb-xl pricing-page">
    <h1 class="lexend-deca-medium text-25 text-center custom-dark-blue">Plans And Pricing</h1>
    <div class="flex flex-center q-gutter-x-md">
      <div class="row q-gutter-x-sm items-center text-13">
        <div
          class="custom-grey"
          :class="{ 'custom-dark-blue inter-medium': !annual }"
        >Monthly plans </div>
        <div>
          <q-toggle
            v-model="annual"
            color="accent" />
        </div>
        <div
          class="custom-grey"
          :class="{ 'custom-dark-blue inter-medium': annual }"
        >Annual plans </div>
      </div>
    </div>
    <q-table
      v-model:pagination="pagination"
      class="pricing-table inter-regular bg-transparent"
      :columns="columnsV2"
      flat
      hide-bottom
      row-key="name"
      :rows="productRows"
      :rows-per-page-options="[0]"
      separator="horizontal"
      virtual-scroll
      :visible-columns="columnsV2"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            class="lexend-deca-medium text-accent"
            :props="props"
            style="font-size: 1.2rem;"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            key="name"
            :class="{ 'inter-bold text-uppercase text-accent text-25 letter-spacing-1': props.row.bold }"
            :props="props"
          >
            {{ props.row.name }}
            <div
              v-if="props.row.info"
              class="text-10 custom-grey"
              style="letter-spacing: 0.7px;"
            >{{ props.row.info }}</div>
          </q-td>
          <!--          Starter-->
          <q-td
            key="starter"
            :props="props">
            <span v-if="typeof props.row.starter === 'boolean'">
              <q-icon
                v-if="props.row.starter"
                class="custom-green"
                name="task_alt"
                size="sm" />
              <q-icon
                v-else
                class="custom-red"
                name="cancel"
                size="sm" />
            </span>
            <span v-else-if="typeof props.row.starter === 'object'">
              <span v-if="props.row.starter.monthlyCredits">
                {{ props.row.starter.monthlyCredits }}
              </span>
              <span
                v-else-if="props.row.starter.additionalEpisodePrice"
                class="row items-center justify-center">
                <span class="lexend-deca-medium text-16">{{ props.row.starter.additionalEpisodePrice }}</span>
                <span class="inter-light"> / episode</span>
              </span>
              <span v-else-if="props.row.starter.unusedEpisode"
              >
                <span
                  v-for="(line, idx) in props.row.starter.unusedEpisode.split('\n')"
                  :key="idx"
                  class="block"
                >
                  {{ line }}
                </span>
              </span>
              <span
                v-else-if="props.row.starter.price"
                class="text-accent"
              >
                <span class="row items-center justify-center">
                  <span class="lexend-deca-medium text-20">{{ props.row.starter.price }}</span>
                  <span
                    v-if="annual"
                    class="inter-light"> / yearly</span>
                  <span
                    v-else
                    class="inter-light"> / month</span>
                </span>
                <span
                  v-if="annual"
                  class="lexend-deca-medium text-accent block q-pb-sm"
                >
                  {{ 'SAVE ' + props.row.starter.save }}
                </span>
                <span>
                  <q-btn
                    class="border-radius-10 lexend-deca-regular"
                    color="accent"
                    :disable="disableStarter"
                    label="Get started now"
                    no-caps
                    padding="10px 22px"
                    text-color="white"
                    @click="confirmSubscription({plan: 'starter', priceId: props.row.starter.priceId})"
                  />
                </span>
              </span>
            </span>
            <span v-else>
              {{ props.row.starter }}
            </span>
          </q-td>
          <!--          Growth-->
          <q-td
            key="growth"
            :props="props">
            <span v-if="typeof props.row.growth === 'boolean'">
              <q-icon
                v-if="props.row.growth"
                class="custom-green"
                name="task_alt"
                size="sm" />
              <q-icon
                v-else
                class="custom-red"
                name="cancel"
                size="sm" />
            </span>
            <span v-else-if="typeof props.row.growth === 'object'">
              <span v-if="props.row.growth.monthlyCredits">
                {{ props.row.growth.monthlyCredits }}
              </span>
              <span
                v-else-if="props.row.growth.additionalEpisodePrice"
                class="row items-center justify-center">
                <span class="lexend-deca-medium text-16">{{ props.row.growth.additionalEpisodePrice }}</span>
                <span class="inter-light"> / episode</span>
              </span>
              <span v-else-if="props.row.growth.unusedEpisode">
                <span
                  v-for="(line, idx) in props.row.growth.unusedEpisode.split('\n')"
                  :key="idx"
                  class="block"
                >
                  {{ line }}
                </span>
              </span>
              <span
                v-else-if="props.row.growth.price"
                class="text-accent"
              >
                <span class="row items-center justify-center ">
                  <span class="lexend-deca-medium text-20">{{ props.row.growth.price }}</span>
                  <span
                    v-if="annual"
                    class="inter-light"> / yearly</span>
                  <span
                    v-else
                    class="inter-light"> / month</span>
                </span>
                <span
                  v-if="annual"
                  class="lexend-deca-medium text-accent block q-pb-sm"
                >
                  {{ 'SAVE ' + props.row.growth.save }}
                </span>
                <span>
                  <q-btn
                    class="border-radius-10 lexend-deca-regular"
                    color="accent"
                    :disable="disableGrowth"
                    label="Get started now"
                    no-caps
                    padding="10px 22px"
                    text-color="white"
                    unelevated
                    @click="confirmSubscription({plan: 'growth', priceId: props.row.growth.priceId})"
                  />
                </span>
              </span>
            </span>
            <span v-else>
              {{ props.row.growth }}
            </span>
          </q-td>
          <!--          Pro-->
          <q-td
            key="pro"
            :props="props">
            <span v-if="typeof props.row.pro === 'boolean'">
              <q-icon
                v-if="props.row.pro"
                class="custom-green"
                name="task_alt"
                size="sm" />
              <q-icon
                v-else
                class="custom-red"
                name="cancel"
                size="sm" />
            </span>
            <span v-else-if="typeof props.row.pro === 'object'">
              <span v-if="props.row.pro.monthlyCredits">
                {{ props.row.pro.monthlyCredits }}
              </span>
              <span
                v-else-if="props.row.pro.additionalEpisodePrice"
                class="row items-center justify-center">
                <span class="lexend-deca-medium text-16">{{ props.row.pro.additionalEpisodePrice }}</span>
                <span class="inter-light"> / episode</span>
              </span>
              <span v-else-if="props.row.pro.unusedEpisode">
                <span
                  v-for="(line, idx) in props.row.pro.unusedEpisode.split('\n')"
                  :key="idx"
                  class="block"
                >
                  {{ line }}
                </span>
              </span>
              <span
                v-else-if="props.row.pro.price"
                class="text-accent"
              >
                <span class="row items-center justify-center ">
                  <span class="lexend-deca-medium text-20">{{ props.row.pro.price }}</span>
                  <span
                    v-if="annual"
                    class="inter-light"> / yearly</span>
                  <span
                    v-else
                    class="inter-light"> / month</span>
                </span>
                <span
                  v-if="annual"
                  class="lexend-deca-medium text-accent block q-pb-sm"
                >
                  {{ 'SAVE ' + props.row.pro.save }}
                </span>
                <span>
                  <q-btn
                    class="border-radius-10 lexend-deca-regular"
                    color="accent"
                    :disable="disablePro"
                    label="Get started now"
                    no-caps
                    padding="10px 22px"
                    text-color="white"
                    unelevated
                    @click="confirmSubscription({plan: 'pro', priceId: props.row.pro.priceId})"
                  />
                </span>
              </span>
            </span>
            <span v-else>
              {{ props.row.pro }}
            </span>
          </q-td>
          <!--          Agency-->
          <q-td
            key="agency"
            :props="props">
            <span v-if="typeof props.row.agency === 'boolean'">
              <q-icon
                v-if="props.row.agency"
                class="custom-green"
                name="task_alt"
                size="sm" />
              <q-icon
                v-else
                class="custom-red"
                name="cancel"
                size="sm" />
            </span>
            <span v-else-if="typeof props.row.agency === 'object'">
              <span v-if="props.row.agency.monthlyCredits">
                {{ props.row.agency.monthlyCredits }}
              </span>
              <span
                v-else-if="props.row.agency.additionalEpisodePrice"
                class="row items-center justify-center">
                <span class="lexend-deca-medium text-16">{{ props.row.agency.additionalEpisodePrice }}</span>
              </span>
              <span v-else-if="props.row.agency.unusedEpisode">
                <span
                  v-for="(line, idx) in props.row.agency.unusedEpisode.split('\n')"
                  :key="idx"
                  class="block"
                >
                  {{ line }}
                </span>
              </span>
              <span
                v-else-if="props.row.agency.price"
                class="text-accent"
              >
                <span class="invisible row items-center justify-center ">
                  <span class="lexend-deca-medium text-20">{{ props.row.agency.price }}</span>
                  <span
                    v-if="annual"
                    class="inter-light"> / yearly</span>
                  <span
                    v-else
                    class="inter-light"> / month</span>
                </span>
                <span
                  v-if="annual"
                  class="invisible lexend-deca-medium text-center text-accent block q-pb-sm"
                >
                  {{ 'SAVE ' + props.row.agency.save }}
                </span>
                <span>
                  <a
                    class="q-btn q-btn--no-uppercase cursor-pointer btn-grey border-radius-10 text-white lexend-deca-regular"
                    :class="{ 'disable': disableAgency }"
                    href="http://www.capsho.com/book-a-call"
                    style="padding: 10px 38px; text-decoration: none;"
                    target="_blank"
                  >
                    Book a call
                  </a>
                </span>
              </span>
            </span>
            <span v-else>
              {{ props.row.agency }}
            </span>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="text-center q-mt-xl">
      <q-card
        class="pricing-agency-card q-pa-md text-14"
        flat
      >
        <q-card-section
          class="poppins-medium"
          style="font-size: 1rem;"
        >
          ARE YOU A PODCAST MANAGER OR A PODCASTING AGENCY? (OR A VERY ACTIVE PODCASTER?)
        </q-card-section>
        <q-card-section>
          If you do more than 12 episodes a month, we can create a bespoke pricing plan for you.
          Book a call with a Capsho Co-Founder to discuss your specific needs.
        </q-card-section>
        <q-card-actions align="center">
          <a
            class="q-btn q-btn--no-uppercase cursor-pointer btn-grey border-radius-10 text-white lexend-deca-regular"
            :class="{ 'disable': disableAgency }"
            href="https://calendly.com/ashcapsho/capsho-call"
            style="padding: 10px 38px; text-decoration: none;"
            target="_blank"
          >
            Book a call
          </a>
        </q-card-actions>
      </q-card>
    </div>
  </div>
  <q-dialog
    v-model="showUpdateSubscriptionMessageDialog"
    persistent
    transition-hide="scale"
    transition-show="scale"
  >
    <AppCard>
      <template #body>
        <div class="column items-center q-col-gutter-y-md">
          <div class="col-10 text-center text-weight-medium text-subtitle1">
            You will be subscribed to the
            <span class="text-weight-bold">
              {{ selectedPlanName }}
            </span>
            plan immediately.<br>
            If you have any remaining credits, they will be transferred to the new plan
          </div>
          <div class="col-auto q-gutter-x-lg lexend-deca-regular">
            <q-btn
              v-close-popup
              flat
              label="Cancel"
              no-caps
              padding="4px 30px"
              rounded
              style="background-color: #EAE8FF;"
              text-color="accent"
              unelevated
            />
            <q-btn
              v-close-popup
              flat
              label="Confirm"
              no-caps
              padding="4px 30px"
              rounded
              style="background-color: #EAE8FF;"
              text-color="accent"
              unelevated
              @click="subscribe"
            />
          </div>
        </div>
      </template>
    </AppCard>
  </q-dialog>
</template>

<style lang="sass">
.pricing-page
  width: 100%
  max-width: 1000px
  margin: 0 auto
.custom-grey
  color: rgb(147 157 184/1)
.pricing-body
  --tw-bg-opacity: 1
  background-color: rgb(18 24 38/var(--tw-bg-opacity))

.my-sticky-header-column-table
  /* height or max-height is important */
  height: 70vh

  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 70%

  td:first-child
    /* bg color is important for td; just specify one */
    background-color: #c1f4cd !important

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0

.pricing-agency-card
  max-width: 560px
  margin: 0 auto
</style>
