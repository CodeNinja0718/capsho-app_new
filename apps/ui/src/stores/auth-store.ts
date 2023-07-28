import { AuthStateProperties, defineStore } from 'pinia'
import countryCodes from './data.json'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { useFolderStore } from './folder-store'
import { InitialAuthState } from 'src/services/firebase/base'
import type { Unsubscribe } from '@firebase/firestore'
import type { Unsubscribe as AuthObserver, User } from 'firebase/auth'
import type { CountryObject, Onboardning, UtmData } from 'stores/auth-store-state-types'
import { getStripeProducts, isUserSubscribed } from 'src/services/firebase/stripe'
import { expiryIn24Hours } from 'src/utils/expiry-date'
import { UserDoc } from 'src/models/userProfile'
import { useNotification } from 'src/composables/useNotification'
// import { customer } from 'src/services/tapfiliate-service'
import { createPodcastEpisodeDraftsHostSharedTemplate, createSharedTemplate } from 'src/services/firebase/usersData'

const phoneCountryCodes = countryCodes.reduce((acc: CountryObject[], obj) => {
  const country: CountryObject = {
    label: obj.country,
    country_code: obj.country_code,
    phone_code: obj.phone_code,
    flag: obj.flag
  }
  acc.push(country)
  return acc
}, []).sort((a, b) => {
  if (a.label < b.label) return -1
  if (a.label > b.label) return 1
  return 0
})
export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      utmData: {} as UtmData,
      authPageTab: 'signin',
      paymentDark: false,
      signUpStep: 'emailSignUp',
      onBoarding: 'userDetails',
      currentSubscription: {
        status: ''
      },
      isAuthenticated: false,
      isReady: false,
      email: '',
      password: null,
      confirmPassword: null,
      trialCredits: 1,
      firstName: '',
      lastName: '',
      phone: '',
      selectedCountry: phoneCountryCodes.reduce((acc: object, obj) => {
        if (obj.country_code === 'US') {
          acc = {
            ...obj
          }
        }
        return acc
      }, {}),
      countryCodes: phoneCountryCodes,
      pin: '',
      businessName: '',
      businessLogo: {},
      businessLogoURL: '',
      podcastName: '',
      instagramLink: '',
      facebookLink: '',
      youtubeLink: '',
      twitterLink: '',
      linkedinLink: '',
      websiteLink: '',
      podcastLink: '',
      auth: {},
      user: {} as UserDoc,
      unsubUsersListener: {} as Unsubscribe,
      unsubSubscriptionListener: {} as Unsubscribe,
      authStateUnsubscribe: {} as AuthObserver,
      uid: '',
      showUpdatePasswordDialog: false,
      showUploadLogoDialog: false,
      showUpdateEmailDialog: false,
      phoneVerificationDialog: false,
      confirmationResult: {},
      stripeProducts: [],
      yearlyProducts: [],
      subscriptions: {},
      userCustomClaims: {},
      primaryPurpose: '',
      userType: 'host',
      referralLink: '',
      darkMode: true
    } as AuthStateProperties
  },
  actions: {
    async setAuthState (data: InitialAuthState) {
      this.isAuthenticated = data.isAuthenticated
      this.isReady = data.isReady
      this.uid = 'epXH5eJKosPPS4gG79RS8J2T9Mv1' // data.uid
      this.auth = data.auth
      const userClaims = await isUserSubscribed()
      if (userClaims !== null) {
        this.userCustomClaims = userClaims
      }
    },
    async reauthenticate (email: string, password: string) {
      this.$fbServices.reauthenticateUser(email, password)
    },
    async loginWithEmail () {
      const authUser = await this.$fbServices.signInWithEmail({ email: this.email, password: this.password })
      if (authUser === null || authUser === undefined) {
        return null
      }
      await this.handleSignedInUser(authUser)
    },
    async handleSignedInUser (user: User) {
      await getStripeProducts()
      await this.$fbServices.getUsersData()
      // if email is not verified, then verify first
      if (!user.emailVerified) {
        // if email is not verified, then verify
        await this.router.push({ name: 'AuthEmailVerify' })
        return null
      }
      if (!this.user.isDoneOnBoardingFlow) {
        await this.router.push({ name: 'AuthSignUpUserDetails' })
      } else {
        if (this.userType === 'guest') {
          await this.router.push({ name: 'DefaultPodcastGuest' })
        } else {
          await this.router.push({ name: 'PodcastFolders' })
        }
      }
    },
    toggleUserLoggedIn () {
      this.user.isLoggedIn = !this.user.isLoggedIn
    },
    async fetchUser () {
      await getStripeProducts()
    },
    async redirectToCompleteSignUp (onBoardingStep: Onboardning = 'userDetails') {
      this.user.isLoggedIn = false
      this.onBoarding = onBoardingStep
      this.authRouter('AuthSignUpUserDetails')
    },
    updateUtmData() {
      const validKeys = ['utm_campaign', 'utm_medium', 'utm_source']
      const utmData = this.utmData
      if (Object.keys(utmData).every((key) => validKeys.includes(key))) {
        this.updateUser({
          utmData
        })
      }
    },
    async registerWithEmail () {
      const { triggerWarning } = useNotification()
      const userCredential = await this.$fbServices.createUserWithEmail({ email: this.email, password: this.password })
      if (userCredential !== null) {
        // const res = customer(userCredential.user.uid)
        const searchURL = new URL(window.location.href)
        const referelUserId = searchURL.searchParams.get('referelUserId')
        const templateId = searchURL.searchParams.get('templateId')
        if (referelUserId && templateId) {
          // await createPodcastEpisodeDraftsHostSharedTemplate({ userId: referelUserId, templateId })
          await createSharedTemplate({ userId: referelUserId, templateId })
        }
        this.auth = userCredential
        // this.signUpStep = 'verifyEmail'
        this.router.push({ name: 'AuthEmailVerify' })
          .then(() => {
            this.updateUtmData()
          })
        await this.verifyEmailAddress()
      } else {
        if (this.userType === 'guest') {
          const message = 'Oops it looks like you already have a Capsho Host account with this email address!'
          const caption = 'Capsho Guest is currently in Beta so we\'ll need you to create a Capsho Guest account with a different email address.'
          triggerWarning(message, true, caption, 10000)
        } else {
          triggerWarning('Try with a different email address')
        }
      }
    },
    async verifyEmailAddress () {
      await this.$fbServices.verifyEmail()
    },
    handleSignUpWithGoogle () {
      this.onBoarding = 'userDetails'
      this.router.push({ name: 'AuthSignUpUserDetails' })
        .then(() => {
          this.updateUtmData()
        })
    },
    async loginWithGoogleProvider ({ isSignUp = false }) {
      const authUser = await this.$fbServices.signInWithGoogle(isSignUp)
      if (authUser === null || authUser === undefined) {
        return null
      }
      if (isSignUp) {
        // const res = customer(authUser.uid)
        // console.log(res)
        this.handleSignUpWithGoogle()
      } else {
        await this.handleSignedInUser(authUser)
      }
    },
    async logOut () {
      const unsubs = []
      // remove previous listeners if any
      if (typeof this.unsubUsersListener === 'function') {
        unsubs.push(this.unsubUsersListener())
      }
      if (typeof this.unsubSubscriptionListener === 'function') {
        unsubs.push(this.unsubSubscriptionListener())
      }
      const podcastStore = useUploadPodcastStore()
      if (typeof podcastStore.unsubTranscriptListener === 'function') {
        unsubs.push(podcastStore.unsubTranscriptListener())
      }
      if (typeof podcastStore.unsubUsersDataListener === 'function') {
        unsubs.push(podcastStore.unsubUsersDataListener())
      }
      if (typeof podcastStore.unsubEpisodeDocListener === 'function') {
        unsubs.push(podcastStore.unsubEpisodeDocListener())
      }
      podcastStore.$reset()
      const folderStore = useFolderStore()
      if (typeof folderStore.foldersListener === 'function') {
        unsubs.push(folderStore.foldersListener())
      }
      Promise.all(unsubs)
      this.resetUser()
      await this.$fbServices.logOut()
      this.authRouter('AuthSignIn')
    },
    async logOutCopy () {
      if (typeof this.authStateUnsubscribe === 'function') {
        await this.authStateUnsubscribe()
      }
      // remove previous listeners if any
      if (typeof this.unsubUsersListener === 'function') {
        await this.unsubUsersListener()
      }
      const podcastStore = useUploadPodcastStore()
      if (typeof podcastStore.unsubTranscriptListener === 'function') {
        await podcastStore.unsubTranscriptListener()
      }
      if (typeof podcastStore.unsubUsersDataListener === 'function') {
        await podcastStore.unsubUsersDataListener()
      }
      if (typeof podcastStore.unsubEpisodeDocListener === 'function') {
        await podcastStore.unsubEpisodeDocListener()
      }
      podcastStore.$reset()
      const folderStore = useFolderStore()
      if (typeof folderStore.foldersListener === 'function') {
        await folderStore.foldersListener()
      }
      this.resetUser()
      await this.$fbServices.logOut()
    },
    resetUser () {
      this.email = ''
      this.uid = ''
      this.signUpStep = 'emailSignUp'
      this.user = {} as UserDoc
    },
    async sendResetPasswordLink (email: string) {
      await this.$fbServices.resetPassword(email)
      await this.authRouter('AuthSignIn')
    },
    authRouter (routeName: string) {
      this.router.push({ name: routeName })
    },
    toggleUploadLogoDialogState () {
      this.showUploadLogoDialog = !this.showUploadLogoDialog
    },
    uploadBrandLogo () {
      this.$fbServices.saveImage(this.businessLogo)
        .then(async (downloadURL: string) => {
          this.businessLogoURL = downloadURL
          this.$fbServices.updateUserProfile({ photoURL: downloadURL })
          await this.$fbServices.updateUsersData({ businessLogoURL: downloadURL })
        })
    },
    toggleUpdatePasswordDialogState () {
      this.showUpdatePasswordDialog = !this.showUpdatePasswordDialog
    },
    updatePassword ({ email, oldPassword, newPassword }: { email: string | null, oldPassword: string, newPassword: string }) {
      this.$fbServices.setPassword({ email, oldPassword, newPassword })
    },
    toggleUpdateEmailDialogState () {
      this.showUpdateEmailDialog = !this.showUpdateEmailDialog
    },
    updateEmail ({ email, newEmail, password }: { email: string, newEmail: string, password: string }) {
      this.$fbServices.updateUserEmail({ email, newEmail, password })
    },
    async updateUser (data: object) {
      await this.$fbServices.updateUsersData(data)
    },
    async saveUser () {
      const {
        firstName,
        lastName,
        businessName,
        primaryPurpose
      } = this
      const getUserData = () => {
        return {
          businessName,
          createdAt: Date.now(),
          defaultFolder: false,
          firstName,
          isDoneOnBoardingFlow: true,
          lastName,
          primaryPurpose,
          proPlanOfferCountdown: expiryIn24Hours(),
          userType: this.userType
        }
      }
      await this.$fbServices.updateUsersData(getUserData())
      await this.fetchUser()
      this.onBoarding = 'userDetails'
      this.signUpStep = 'emailSignUp'
      if (this.userType === 'guest') {
        this.router.push({ name: 'DefaultPodcastGuest' })
      } else {
        this.router.push({ name: 'UploadPodcast' })
      }
    },
    changeDarkMode (newTheme: boolean) {
      this.darkMode = newTheme
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['auth', 'uid', 'user']
      },
      {
        storage: sessionStorage,
        paths: ['user', 'stripeProducts', 'yearlyProducts', 'userCustomClaims', 'isAuthenticated', 'isReady', 'darkMode']
      }
    ]
  }
})
