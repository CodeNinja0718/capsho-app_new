import type { User, UserCredential } from 'firebase/auth'
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  verifyBeforeUpdateEmail
} from 'firebase/auth'
import { useNotification } from 'src/composables/useNotification'
import { useAuthStore } from 'stores/auth-store'
import { logtail } from 'boot/logtail'
import { slackFrontendErrors } from 'boot/axios'
import { IsDomainBannedResponse } from 'src/services/auth-api'
import { Loading } from 'quasar'

const { triggerNegative, triggerPositive, triggerInfo } = useNotification()
export function lookUpDomain(email: string, showLoading = true) {
  const authStore = useAuthStore()
  if (showLoading) {
    Loading.show()
  }
  return authStore
    .$authFunctions
    .lookUpDomain({ email })
    .then((response: IsDomainBannedResponse) => {
      return response.result
    })
    .finally(() => {
      Loading.hide()
    })
}
/**
 * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createuserwithemailandpassword
 * @param {String} email - A Valid email
 * @param {String} password - Password
 * @return {Promise<UserCredential>} - UserCredentials https://firebase.google.com/docs/reference/js/firebase.auth#usercredential
 */
export async function createUserWithEmail (
  {
    email,
    password
  }:
    {
      email: string,
      password: string
    }
): Promise<UserCredential | null> {
  const auth = getAuth()
  const isDomainBanned = await lookUpDomain(String(email))
  if (isDomainBanned) {
    return null
  }
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return userCredential
    })
    .catch((err) => {
      logtail?.warn('auth.ts - createUserWithEmail', {
        code: err.code,
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          text: err.code,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: createUserWithEmail',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email || email || 'no email'
              }
            }
          ]
        }
      }))
      // if (err.code === 'auth/email-already-in-use') {
      //   authStore.router.push({ name: 'AuthSignIn' })
      // }
      // if (err.code === 'auth/email-already-in-use' && !auth.currentUser?.emailVerified) {
      //   verifyEmail()
      // } else if (err.code === 'auth/email-already-in-use' && !authStore.user.isDoneOnBoardingFlow) {
      //   authStore.router.push({ name: 'AuthSignUpUserDetails' })
      // } else {
      //   authStore.router.push({ name: 'AuthSignIn' })
      // }
      return null
    })
}

/**
 * Create user with gmail account
 */
export async function signInWithGoogle () {
  const auth = getAuth()
  const email = auth.currentUser?.email
  const isDomainBanned = await lookUpDomain(String(email))
  if (isDomainBanned) {
    return null
  }
  const googleProvider = new GoogleAuthProvider()
  return signInWithPopup(auth, googleProvider)
    .then((userCredential) => {
      return userCredential.user
    })
    .catch((err) => {
      logtail?.error('auth.ts - signInWithGoogle', {
        error: err
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: signInWithGoogle',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.code
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? 'no email'
              }
            }
          ]
        }
      }))
      return err
    })
}

function getErrorMessage (error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}
interface MessagesIndex {
  [index: string]: string;
}
function getAuthErrorMessage (errorCode: string) {
  const firebaseErrors: MessagesIndex = {
    'auth/user-not-found': 'User not found with given email',
    'auth/wrong-password': 'Wrong email and/or password',
    'auth/invalid-email': 'Wrong email and/or password'
  }
  return firebaseErrors[errorCode]
}
/**
 * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithemailandpassword
 * @param {String} email
 * @param {String} password
 * @return {Promise} - UserCredentials https://firebase.google.com/docs/reference/js/firebase.auth#usercredential
 */
export async function signInWithEmail ({ email, password }: { email: string, password: string }) {
  const auth = getAuth()
  const authStore = useAuthStore()
  const isDomainBanned = await lookUpDomain(String(email))
  if (isDomainBanned) {
    return null
  }
  try {
    return setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user
            if (user) {
              return user
            }
          })
          .catch((error) => {
            const errorCode = error.code
            const errorMessage = getAuthErrorMessage(errorCode) || error.message
            triggerNegative(errorMessage)
            logtail?.warn('auth.ts - signInWithEmail', {
              message: errorMessage,
              code: errorCode
            })
            const blocks = [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: ':ghost: signInWithEmail',
                  emoji: true
                }
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `${errorCode}`
                }
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `${errorMessage}`
                }
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `${email}`
                }
              }
            ]
            Promise.resolve(slackFrontendErrors({
              method: 'POST',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              data: { blocks }
            }))
            if (errorCode === 'auth/user-not-found') {
              authStore.router.push({ name: 'AuthSignUp' })
            }
          })
      })
  } catch (err) {
    triggerNegative(getErrorMessage(err))
  }
}

/**
 * Sign's in temporary
 * @returns {Promise<UserCredential>}
 */
export async function signInTemporary () {
  const auth = getAuth()
  return await signInAnonymously(auth)
}

/**
 * Send verification email
 */
export function verifyEmail () {
  const auth = getAuth()
  const actionCodeSettings = {
    url: window.location.origin + '/auth/login'
  }
  if (auth.currentUser) {
    sendEmailVerification(auth.currentUser, actionCodeSettings).then(() => {
      const success = {
        message: 'We’ve sent you a verification email with a link inside.',
        caption: 'Just click on the link and then continue!'
      }
      triggerInfo(success.message, true, success.caption)
    }).catch((err) => {
      logtail?.error('auth.ts - verifyEmail', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: verifyEmail',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.code
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? 'no email'
              }
            }
          ]
        }
      }))
      triggerNegative(err.message)
    })
  }
}

export async function deleteAuthUserOnFail () {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    await deleteUser(user)
  }
}

/**
 * Send reset password email
 * @param {String} email
 */
export function resetPassword (email: string) {
  const auth = getAuth()
  const user = auth.currentUser
  if (user && user.email) {
    email = user.email
  }
  sendPasswordResetEmail(auth, email)
    .then(() => {
      if (user) {
        logOut()
      }
      triggerPositive('Reset password link was sent to your email.')
    }).catch((err) => {
      logtail?.error('auth.ts - resetPassword', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: resetPassword',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.code
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email || email || 'no email'
              }
            }
          ]
        }
      }))
      triggerNegative(err.message)
    })
}

/**
 * Updates password
 * @param {String} email
 * @param {String} oldPassword
 * @param {String} newPassword
 */
export function setPassword ({ email, oldPassword, newPassword }: { email: string, oldPassword: string, newPassword: string }) {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    reauthenticateUser(email, oldPassword)
      .then(() => {
        updatePassword(user, newPassword)
          .then(() => {
            triggerPositive('Success! Your password has been updated!')
          })
          .catch((err) => {
            logtail?.error('auth.ts - setPassword -> reauthenticateUser -> updatePassword', {
              message: err.message
            })
            triggerNegative(err.message)
          })
      })
      .catch((err) => {
        logtail?.error('auth.ts - setPassword', {
          message: err.message
        })
        Promise.resolve(slackFrontendErrors({
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: ':ghost: setPassword',
                  emoji: true
                }
              },
              {
                type: 'divider'
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: err.code
                }
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: err.message
                }
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: auth.currentUser?.email || email || 'no email'
                }
              }
            ]
          }
        }))
        triggerNegative(err.message)
      })
  }
}

export async function verifyBeforeUpdate (newEmail: string) {
  const auth = getAuth()
  const user = auth.currentUser
  try {
    if (user) {
      await verifyBeforeUpdateEmail(user, newEmail)
      const success = {
        message: 'We’ve sent you a verification email with a link inside.',
        caption: 'Just click on the link and then continue!'
      }
      triggerInfo(success.message, true, success.caption)
    }
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('auth.ts - verifyBeforeUpdate', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: verifyBeforeUpdate',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? 'no email'
              }
            }
          ]
        }
      }))
      triggerNegative(err.message)
    }
  }
}

export async function reauthenticateUser (email: string, password: string) {
  const auth = getAuth()
  const user = auth.currentUser
  const credential = EmailAuthProvider.credential(email, password)
  return await reauthenticateWithCredential(<User>user, credential)
}

/**
 * Log out and remove user from session storage
 */
export function logOut () {
  const auth = getAuth()
  signOut(auth)
    .catch((err) => {
      logtail?.error('auth.ts - logOut', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: logOut',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.code
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: auth.currentUser?.email ?? 'no email'
              }
            }
          ]
        }
      }))
      triggerNegative(err.message)
    })
}
