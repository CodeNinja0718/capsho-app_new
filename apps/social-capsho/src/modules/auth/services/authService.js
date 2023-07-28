import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth'
import store from '@/store'
import router from '@/router'
import { getUserByDocId } from '@/services/dbService'
import { useNotification } from '@/composables/useNotification'

const { alertDanger, alertSuccess, alertPrimary } = useNotification()

/**
 * Create user with email and password
 * @param email
 * @param password
 */
export function registerWithEmail({ email, password }) {
  const auth = getAuth()
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user
      if (user !== null) {
        await verifyEmail()
        alertSuccess('Successfully registered!')
        router.push({ name: 'SignIn' })
      }
    }).catch((err) => {
    alertDanger(err.message)
  })
}

/**
 * Create user with gmail account
 */
export function signInWithGoogle() {
  const auth = getAuth()
  const googleProvider = new GoogleAuthProvider()
  signInWithPopup(auth, googleProvider)
    .then(async (userCredential) => {
      await updateUserState(userCredential)
    }).catch((err) => {
    store.commit('app/setLoginError', err.message)
    alertDanger(err)
  })
}

/**
 * Sign in with email and password
 * @param email
 * @param password
 * @param rememberMe
 */
export function signInWithEmail({ email, password, rememberMe }) {
  const auth = getAuth()
  if (!rememberMe) {
    try {
      return new Promise((resolve, reject) => {
        setPersistence(auth, browserSessionPersistence)
          .then(() => {
            return resolve(signInWithEmailAndPassword(auth, email, password))
          })
          .catch((err) => {
            store.commit('app/setLoginError', err.message)
            alertDanger(err.message)
            return reject()
          })
      })
    } catch (err) {
      store.commit('app/setLoginError', err.message)
      alertDanger(err.message)
    }
  } else {
    try {
      return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            return resolve(userCredential)
          })
          .catch((err) => {
            store.commit('app/setLoginError', err.message)
            alertDanger(err.message)
            return reject()
          })
      })
    } catch (err) {
      store.commit('app/setLoginError', err.message)
      alertDanger(err)
    }
  }
}

/**
 * Send verification email
 */
export async function verifyEmail() {
  const auth = getAuth()
  await sendEmailVerification(auth.currentUser)
  alertPrimary('We’ve sent you a verification email with a link inside. Just click on the link and when you\'re back here, sign in to get started!')
  //   .then(() => {
  //   store.commit('app/setVerifyEmailError', 'We’ve sent you a verification email with a link inside. Just click on the link and when you\'re back here, refresh this browser to get started!')
  // }).catch((err) => {
  //   store.commit('app/setVerifyEmailError', err.message)
  // })
}

/**
 * Send reset password link
 * @param email
 */
export function resetPassword(email) {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    email = user.email
  }
  sendPasswordResetEmail(auth, email)
    .then(() => {
      if (user) {
        logOut()
      } else {
        router.push({ name: 'SignIn' })
      }
    }).catch((err) => {
    alertDanger(err)
  })
}

/**
 * Log out and remove user from session storage
 */
export function logOut() {
  const auth = getAuth()
  signOut(auth)
    .then(() => {
      sessionStorage.clear()
      store.commit('app/logOut')
      router.push({ name: 'Home' })
    }).catch((err) => {
    alertDanger(err)
  })
}

/**
 * Update user's details
 * @param userCredential
 * @returns {Promise<void>}
 */
export async function updateUserState(userCredential) {
  store.commit('app/setVerifyEmailError', '')
  store.commit('app/logIn', true)
  const id = userCredential.user.toJSON().uid
  const userData = await getUserByDocId(id)
  if (userData) {
    const obj = {
      stripe_id: userData.stripe_id,
      subscription: userData.subscription,
      template: userData.template,
      toneOfVoice: userData.tone_of_voice,
      type: userData.type,
      businessName: userData.business_name,
      created_profile: userData.created_profile
    }
    store.commit('app/setUpdateUser', obj)
    router.push({ name: 'Dashboard' })
  } else {
    router.push({ name: 'CreateProfile' })
  }
}
