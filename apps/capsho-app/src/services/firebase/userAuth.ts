import { getAuth, updateProfile } from 'firebase/auth'
import { useNotification } from 'src/composables/useNotification'
import { reauthenticateUser, verifyBeforeUpdate } from 'src/services/firebase/auth'
import { useAuthStore } from 'stores/auth-store'
import { logtail } from 'boot/logtail'
import { slackFrontendErrors } from 'boot/axios'

type UserProfile = {
  displayName: string | null
  photoURL: string | null
}

export async function updateUserProfile ({ displayName, photoURL }: UserProfile) {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    const { triggerNegative } = useNotification()
    try {
      if (displayName === null) {
        displayName = user.displayName
      }
      if (photoURL === null) {
        photoURL = user.photoURL
      }
      await updateProfile(user, {
        displayName,
        photoURL
      })
    } catch (err) {
      if (err instanceof Error) {
        logtail?.error('userAuth.ts - updateUserProfile', {
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
                  text: ':ghost: updateUserProfile',
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
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `Name - ${displayName}`
                }
              }
            ]
          }
        }))
        triggerNegative(err.message)
      }
    }
  }
}

export async function updateUserEmail ({ email, newEmail, password }: { email: string, newEmail: string, password: string }) {
  const auth = getAuth()
  const user = auth.currentUser
  const authStore = useAuthStore()
  if (user) {
    const { triggerNegative } = useNotification()
    try {
      reauthenticateUser(email, password)
        .then(() => {
          verifyBeforeUpdate(newEmail)
        })
        .then(() => {
          authStore.logOut()
        })
      // await updateEmail(user, email)
    } catch (err) {
      if (err instanceof Error) {
        logtail?.error('userAuth.ts - updateUserEmail', {
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
                  text: ':ghost: updateUserEmail',
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
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `Previous email - ${email}, new email - ${newEmail}`
                }
              }
            ]
          }
        }))
        triggerNegative(err.message)
      }
    }
  }
}
