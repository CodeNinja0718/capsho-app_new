import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app'
import { Auth, getAuth, onAuthStateChanged, User } from 'firebase/auth'
import firebaseServices from 'src/services/firebase/index'
import { useAuthStore } from 'stores/auth-store'
import { Functions, getFunctions, httpsCallable } from 'firebase/functions'
import { AuthStateProperties } from 'pinia'
import { getUsersData } from 'src/services/firebase/usersData'
import { CONSTANTS } from 'src/config'

/**
 * @typedef {Object} AuthState
 * @property {Boolean} isAuthenticated
 * @property {Boolean} isReady
 */

/**
 * Returns Firebase's auth service
 * https://firebase.google.com/docs/reference/js/firebase.auth.html#callable
 * @return {Auth} - The Firebase Auth service interface
 */
export const auth = (): Auth => {
  return getAuth()
}

export interface InitialAuthState {
  isAuthenticated: boolean;
  isReady: boolean;
  uid: string;
  businessLogo: string;
  auth: User;
}
/**
 * Handle the auth state of the user and set it in the auth store module.
 * Also sets up redirection if the user loses authentication. The action
 * method will determine where the application routes to.
 * @param  {User | null} currentUser - Firebase currentUser
 */
export const handleOnAuthStateChanged = async (currentUser: User) => {
  const authStore = useAuthStore()
  if (currentUser !== null) {
    await getUsersData()
  }
  const initialAuthState = isAuthenticated(authStore)
  // Save to the store
  await authStore.setAuthState({
    isAuthenticated: (currentUser !== null && authStore.user.isLoggedIn),
    isReady: true,
    auth: currentUser,
    uid: currentUser ? currentUser.uid : ''
  } as InitialAuthState)
  //
  // // If the user loses authentication route
  // // take them to the login page
  if (!currentUser && initialAuthState) {
    authStore.logOut()
      .then(() => {
        authStore.authRouter('AuthPage')
      })
  }
}

/**
 * @param  {AuthState} store - Auth store
 * @return {Boolean} - isAuthenticated
 */
export const isAuthenticated = (store: AuthStateProperties) => {
  return store.isAuthenticated
}

/**
 * Async function providing the application time to
 * wait for firebase to initialize and determine if a
 * user is authenticated or not with only a single observable.
 * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onauthstatechanged
 * @param {AuthState} store - Auth store
 * @returns {Promise} - A promise that return firebase.Unsubscribe
 */
export const ensureAuthIsInitialized = async (store: AuthStateProperties) => {
  if (store.isReady) return true
  // Create the observer only once on init
  return new Promise<User | null>((resolve, reject) => {
    const auth = firebaseServices.auth()
    // Use a promise to make sure that the router will eventually show the route after the auth is initialized.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      if (user !== null) {
        handleOnAuthStateChanged(user)
      }
      resolve(user)
    }, () => {
      return reject(new Error('Looks like there is a problem with the firebase service. Please try again later'))
    })
  })
}

/**
 * Returns Firebase cloud functions
 * https://firebase.google.com/docs/functions/callable#set_up_your_client_development_environment
 * @return {Functions} - The Firebase Functions service interface
 */
export const firebaseFunctions = (app?: FirebaseApp): Functions => {
  return getFunctions(app)
}

/**
 * Convenience method to initialize firebase app
 * https://firebase.google.com/docs/reference/js/firebase?authuser=1#initializeapp
 * @param  {Object} config - FIREBASE_CONFIG during the build process
 * @return {FirebaseApp} - Creates and initializes a Firebase app instance.
 */
export const fBInit = (config: FirebaseOptions) => {
  return initializeApp(config)
}

const FIREBASE_CONFIG = CONSTANTS.APP.FIREBASE_CONFIG
export const fbApp = fBInit(FIREBASE_CONFIG)

export const cloudFunction = (functionName: string) => {
  const fbFunction = firebaseFunctions(fbApp)
  return httpsCallable(fbFunction, functionName)
}
