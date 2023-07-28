<template>
  <div class="column items-center q-gutter-y-sm q-mt-md">
    <div v-if="!isLoggedIn">
      <BrandLogo />
    </div>
    <h1 class="text-h5 lexend-deca-bold text-uppercase letter-spacing-1 custom-dark-blue">Capsho Collective</h1>
    <div class="text-16 inter-regular text-center">
      Not all plans are created equal.<br>
      And this one is, by far, the best value. <span class="inter-bold">Pro Move</span> 👏
    </div>
    <q-card
      :bordered="false"
      class="pricing-card q-pa-md shadow-1"
    >
      <q-card-section class="text-center">
        <div class="column no-wrap q-gutter-x-xs">
          <span class="lexend-deca-medium text-25">$497</span>
          <span class="inter-light">billed every 6 months</span>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="q-gutter-y-sm">
        <div
          v-for="(info, idx) in pricingDetails"
          :key="idx"
          class="row no-wrap q-gutter-x-md items-start"
        >
          <q-icon
            class="custom-green"
            name="task_alt"
            size="sm" />
          <span class="col-10">
            <span :class="{ 'inter-bold': info.highlightLeading }">
              {{ info.leading }}
            </span>
            <span :class="{ 'inter-bold': info.highlightFollowing }">
              {{ info.following }}
            </span>
          </span>
        </div>
      </q-card-section>
      <q-card-section class="absolute-bottom">
        <q-card-actions class="">
          <q-btn
            class="full-width"
            :class="{ 'disabled': loading }"
            color="accent"
            :label="[ isLoggedIn ? 'Join Now': 'Sign In First' ]"
            :loading="loading"
            no-caps
            padding="8px"
            rounded
            @click="subscribe()"
          >
            <template v-slot:loading>
              Submitting...
            </template>
          </q-btn>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
  <q-dialog
    v-model="reauthenticate"
    transition-hide="slide-down"
    transition-show="slide-up"
  >
    <AppCard
      size="md"
      title="Sign In">
      <template #body>
        <q-form @submit.prevent="onSubmit">
          <div class="q-gutter-y-sm">
            <!--                Email address input-->
            <div>
              <label
                class="inter-regular text-grey-6"
                for="email"
              >Email address</label>
              <q-input
                id="email"
                v-model="authStore.email"
                color="accent"
                dense
                lazy-rules
                outlined
                :rules="[val => !!val || '*Email is required']"
                type="email"
              />
            </div>
            <!--                Password input-->
            <div>
              <label
                class="inter-regular text-grey-6"
                for="password"
              >Password</label>
              <q-input
                id="password"
                v-model="authStore.password"
                class="border-radius-10"
                color="accent"
                dense
                hide-bottom-space
                lazy-rules
                outlined
                :rules="[val => !!val || '*Password is required']"
                type="password"
              />
              <div class="row justify-end">
                <span
                  class="cursor-pointer"
                  @click="$router.push({ name: 'AuthResetPassword' })">
                  <span class="text-caption text-grey-5">Forgot password?</span>
                </span>
              </div>
            </div>
            <!--                Submit button-->
            <div class="row justify-center">
              <div class="col-8">
                <q-btn
                  class="full-width full-height"
                  :class="{ 'disabled': loading }"
                  color="accent"
                  label="Sign In"
                  :loading="loading"
                  no-caps
                  push
                  rounded
                  type="submit"
                >
                  <template #loading>
                    Signing in...
                  </template>
                </q-btn>
              </div>
              <!--                or section-->
              <div class="col-7 q-py-md row justify-center items-center no-wrap q-gutter-x-sm">
                <div class="col-6 separator">
                  <q-separator/>
                </div>
                <span class="col-auto text-center">or</span>
                <div class="col-6 separator">
                  <q-separator/>
                </div>
              </div>
              <!--                Sign in with google-->
              <div class="col-8 row justify-center">
                <q-btn
                  class="full-width full-height"
                  no-caps
                  rounded
                  style="color: gray"
                  @click="loginWithGoogleProvider"
                >
                  <q-icon left>
                    <q-img src="~assets/icons/google.png"/>
                  </q-icon>
                  <div>Sign in with Google</div>
                </q-btn>
              </div>
            </div>
          </div>
          <div class="q-pt-lg text-grey-6 inter-regular">
            <div class="row justify-center items-center q-gutter-x-sm">
              <p>
                Don't have an account?
                <span
                  class="cursor-pointer"
                  @click="$router.push({ name: 'AuthSignUp' })">
                  <span class="text-weight-bold">Register</span>
                </span>
              </p>
            </div>
          </div>
        </q-form>
      </template>
    </AppCard>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { firestore } from 'src/services/firebase/db'
import BrandLogo from 'components/BrandLogo.vue'
import AppCard from 'components/AppCard.vue'
import { useNotification } from 'src/composables/useNotification'
import { useAuthStore } from 'stores/auth-store'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.user.isLoggedIn)
const pricingDetails = [
  {
    leading: 'Full access for 4 credits per month + ',
    following: '$15 for each additional credit',
    highlightFollowing: true
  },
  {
    leading: 'Features exclusive to the Collective: ',
    following: 'Blog post and YouTube Description creation',
    highlightLeading: true
  },
  {
    leading: 'Monthly Training with a Podcast Growth Expert',
    following: ''
  },
  {
    leading: 'Prioritized upvoting on Capsho features',
    following: ''
  },
  {
    leading: 'A full library of expert on-demand podcast growth training',
    following: ''
  },
  {
    leading: 'Auto-access to the Grow My Podcast Summit VIP All Access Pass',
    following: ''
  },
  {
    leading: 'Monthly Podcast Feedback & Review Swaps',
    following: ''
  },
  {
    leading: 'Website Feature on Capsho',
    following: ''
  },
  {
    leading: 'Founding Member T-Shirt',
    following: ''
  }
]
const { triggerWarning } = useNotification()
const loading = ref(false)
const reauthenticate = ref(false)
const signInForm = reactive({
  email: '',
  password: ''
})
function resetForm () {
  signInForm.email = ''
  signInForm.password = ''
}
async function loginWithEmail () {
  const authUser = await authStore.$fbServices.signInWithEmail({ email: signInForm.email, password: signInForm.password })
  if (authUser === null || authUser === undefined) {
    return null
  }
  reauthenticate.value = false
  resetForm()
}
async function loginWithGoogleProvider ({ isSignUp = false }) {
  const authUser = await authStore.$fbServices.signInWithGoogle(isSignUp)
  if (authUser === null || authUser === undefined) {
    return null
  }
  reauthenticate.value = false
  resetForm()
}
function onSubmit () {
  loading.value = true
  try {
    loginWithEmail()
  } finally {
    loading.value = false
  }
}
async function startSubscriptionSession (priceId: string, redirectURL: string) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    loading.value = false
    return null
  }
  const colRef = collection(firestore(), 'users', user.uid, 'checkout_sessions')
  const docRef = await addDoc(colRef, {
    price: priceId,
    success_url: redirectURL,
    cancel_url: redirectURL
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
      loading.value = false
      // Show an error to your customer and
      // inspect your Cloud Function logs in the Firebase console.
      triggerWarning(`An error occurred: ${error.message}`)
    }
    if (url) {
      // We have a Stripe Checkout URL, let's redirect.
      window.location.assign(url)
    }
  })
}
async function subscribe () {
  loading.value = true
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    triggerWarning('Sign in first')
    reauthenticate.value = true
    loading.value = false
    return null
  }
  const priceId = 'price_1LLjgmIxtUtbG5yKkLtlsQJK'
  const redirectURL = window.location.origin + '/podcast/upload'
  await startSubscriptionSession(priceId, redirectURL)
}
</script>

<style lang="sass" scoped>
.pricing-card
  width: 100%
  max-width: 624px
  min-height: 500px
  border-radius: 28px
</style>
