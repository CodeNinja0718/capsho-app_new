<script setup>
import { useAuthStore } from 'stores/auth-store'
import { getStripeProducts, getSubscriptionOneTime, getSubInvoices } from 'src/services/firebase/stripe'
import { onMounted, ref, computed } from 'vue'
import { formatSubscriptionEndDate } from 'src/utils/date'
import { useCredits } from 'src/composables/useCredits'
import { useSubscription } from 'src/composables/useSubscription'
import { useQuasar } from 'quasar'
import { useNotification } from 'src/composables/useNotification'

const $q = useQuasar()
const authStore = useAuthStore()
const { totalCredits, isCancelAtPeriodEnd, additionalCredits } = useCredits()

const subscription = ref({})
const processing = ref(false)

const { interval } = useSubscription()
const { triggerWarning } = useNotification()
const isAnnualSubscriber = computed(() => interval.value === 'year')

async function openCustomerPortal () {
  processing.value = true
  $q.loading.show({
    delay: 400
  })
  try {
    const customerId = authStore.user.stripeId
    const redirectUrl = window.location.origin + '/podcast/upload'
    const { data } = await authStore.$paymentFunctions.createPortalSession({
      customerId,
      redirectUrl
    })
    const portalUrl = data.session.url
    if (portalUrl) {
      window.location.assign(portalUrl)
    }
  } catch (error) {
    if (error instanceof Error) {
      triggerWarning(`An error occurred: ${error.message}`)
    }
  } finally {
    processing.value = false
    $q.loading.hide()
  }
}

const { maxMonthlyCredits } = useSubscription()
const loading = ref(false)

async function fetchSubscriptions () {
  loading.value = true
  try {
    const activeSub = await getSubscriptionOneTime()
    if (!activeSub) {
      return await authStore.router.push({ name: 'PickAPlan' })
    }
    const productId = activeSub.items[0].price.product.id
    const subId = activeSub.items[0].subscription
    const invoices = await getSubInvoices(subId)
    getStripeProducts()
      .then((products) => {
        if (products) {
          const plan = products.filter((pr) => pr.id !== productId)
          subscription.value = {
            productId,
            ...activeSub,
            ...plan,
            invoices
          }
        }
      })
      .catch((e) => console.error(e))
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => await authStore.fetchUser())
onMounted(() => fetchSubscriptions())
</script>

<template>
  <q-page>
    <div class="q-ma-md q-col-gutter-y-xl poppins-regular"
    >
      <h1 class="poppins-semibold text-h5 text-grey-9 text-center"
      >
        Billing Details
      </h1>
      <div
        v-if="subscription.status"
        class="q-px-xl"
      >
        <div class="row justify-center q-gutter-x-xl no-wrap"
        >
          <q-card
            class="billing-card q-pa-md"
            flat
          >
            <div>
              <div class="text-grey-6 text-body2 text-center"
              >
                Episodes included in your<br/>
                plan until reset date
              </div>
              <div class="text-center">
                <q-circular-progress
                  class="text-black rounded-borders q-ma-md"
                  color="accent"
                  font-size="14px"
                  :max="maxMonthlyCredits"
                  :min="0"
                  show-value
                  size="130px"
                  :thickness="0.20"
                  track-color="grey-3"
                  :value="totalCredits"
                >
                  <div class="poppins-semibold">{{ totalCredits + ' left' }}</div>
                </q-circular-progress>
              </div>
              <div class="text-center text-12">
                <span class="text-grey-7 ">Additional credits: </span>
                <span class="text-grey-7 poppins-semibold">{{ additionalCredits }}</span>
              </div>
              <div class="poppins-semibold text-grey-7 text-center text-10 q-py-sm">
                Unused credits will roll over to the next month
              </div>
            </div>
          </q-card>
          <q-card
            class="billing-card q-pa-md"
            flat
          >
            <div class="column justify-between items-center full-height">
              <div class="col-3 text-grey-6 text-body2 text-capitalize">
                Current Plan <b>{{ subscription.status }}</b>
              </div>
              <div class="col-auto text-uppercase lexend-deca-bold text-14">
                {{ subscription.items[0].price.product.name }}
              </div>
              <div class="col-3">
                <div class="column q-px-none">
                  <q-btn
                    class="poppins-medium text-caption"
                    :class="{ 'disabled': processing }"
                    dense
                    flat
                    label="Update billing details"
                    :loading="processing"
                    no-caps
                    rounded
                    text-color="accent"
                    @click="openCustomerPortal"
                  >
                    <template #loading>
                      Processing...
                    </template>
                  </q-btn>
                  <q-btn
                    class="poppins-medium text-caption"
                    dense
                    :disable="isAnnualSubscriber"
                    flat
                    label="Upgrade or Downgrade plan"
                    no-caps
                    rounded
                    text-color="accent"
                    :to="{ name: 'PickAPlan' }"
                  />
                  <q-btn
                    class="poppins-medium text-caption"
                    dense
                    flat
                    label="Cancel plan"
                    no-caps
                    rounded
                    text-color="accent"
                    :to="{ name: 'CancelSubscription' }"
                  />
                </div>
              </div>
            </div>
          </q-card>
          <q-card
            class="billing-card q-pa-md"
            flat
          >
            <div class="q-col-gutter-y-sm column justify-center items-center full-height">
              <div>
                <div class="text-grey-6 text-subtitle1 poppins-medium text-center">
                  Subscribed
                </div>
                <div class="text-accent text-body2 poppins-medium text-center">
                  {{ formatSubscriptionEndDate(subscription.created.seconds * 1000, true) }}
                </div>
              </div>
              <div class="col-2" />
              <div>
                <div class="text-grey-6 text-subtitle1 poppins-medium text-center">
                  {{ isCancelAtPeriodEnd ? 'Plan ends' : 'Next Billing Date' }}
                </div>
                <div class="text-accent text-body2 poppins-medium text-center">
                  {{ formatSubscriptionEndDate(subscription.current_period_end?.seconds * 1000, true) }}
                </div>
              </div>
            </div>
          </q-card>
        </div>
        <div
          class="q-pt-xl"
          style="max-width: 865px; margin: 0 auto;"
        >
          <div class="text-uppercase q-pl-md">
            Invoice History
          </div>
          <q-separator inset />
          <q-list style="max-width: 400px;">
            <q-item
              v-for="(invoice) in subscription.invoices"
              :key="invoice.created"
            >
              <q-item-section>
                <div class="row items-center q-gutter-x-xl">
                  <div>
                    <a
                      class="q-pr-xs"
                      :href="invoice.hosted_invoice_url"
                      target="_blank">
                      <span>
                        {{ formatSubscriptionEndDate(invoice.created * 1000, true) }}
                      </span>
                    </a>
                    <q-icon name="open_in_new" />
                  </div>
                  <div>
                    {{ invoice.displayPrice }}
                  </div>
                  <div>
                    <q-badge
                      class="text-capitalize"
                      color="accent"
                      :label="invoice.status"
                      outline
                    />
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <div
        v-else-if="loading"
        class="text-center lexend-deca-light text-subtitle1 text-grey-7"
      >
        Loading...
      </div>
      <div
        v-else
        class="text-center lexend-deca-light text-subtitle1 text-grey-7"
      >
        Your subscription will be shown here...
      </div>
    </div>
  </q-page>
</template>

<style lang="sass" scoped>
.billing-card
  width: 100%
  max-width: 290px
  border-radius: 16px
  background-color: #F8F8F8
</style>
