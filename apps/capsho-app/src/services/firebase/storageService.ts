import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { useNotification } from 'src/composables/useNotification'
import { AudioFile, ImageFile } from 'src/models/uploadableFile'
import { logtail } from 'boot/logtail'
import { slackFrontendErrors } from 'boot/axios'

/**
 * @typedef {Object} AudioFile
 * @property {File | undefined} file
 * @property {String} id
 * @property {String} name
 */

/**
 * Uploads file to storage
 * @param {AudioFile} fileData
 * @param {string} storagePath
 * @return {Promise<string>}
 */
export async function uploadFileToStorage(fileData: AudioFile, storagePath = 'podcasts/') {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    throw new Error('User must be authenticated!')
  }
  if (!fileData.file) {
    throw new Error('File is missing!')
  }
  const storage: FirebaseStorage = getStorage()
  storage.maxUploadRetryTime = 50000
  const storageRef = ref(storage, storagePath + user.uid + '/' + fileData.id)
  const { triggerWarning } = useNotification()
  try {
    await uploadBytes(storageRef, fileData.file)
    return await getDownloadURL(storageRef)
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('storageService.ts - uploadPodcast', {
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
                text: ':ghost: uploadPodcast',
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
      triggerWarning(err.message)
    }
  }
}

export async function uploadGoogleDriveFileToStorage(data: Uint8Array, id: string, storagePath = 'podcasts/') {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    throw new Error('User must be authenticated!')
  }
  // if (!fileData.file) {
  //   throw new Error('File is missing!')
  // }
  const storage: FirebaseStorage = getStorage()
  storage.maxUploadRetryTime = 50000
  const storageRef = ref(storage, storagePath + user.uid + '/' + id)
  const { triggerWarning } = useNotification()
  try {
    await uploadBytes(storageRef, data)
    return await getDownloadURL(storageRef)
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('storageService.ts - uploadPodcast', {
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
                text: ':ghost: uploadPodcast',
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
      triggerWarning(err.message)
    }
  }
}

export async function saveImage(imgData: ImageFile) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user || !imgData.file) {
    return null
  }
  const storage = getStorage()
  const storageRef = ref(storage, 'logotypes/' + user.uid)
  const { triggerWarning } = useNotification()
  try {
    await uploadBytes(storageRef, imgData.file)
    return await getDownloadURL(storageRef)
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('storageService.ts - saveImage', {
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
                text: ':ghost: saveImage',
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
      triggerWarning(err.message)
    }
  }
}

export async function saveImageForFolder(imgData: ImageFile) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user || !imgData.file) {
    return null
  }
  const storage = getStorage()
  const storageRef = ref(storage, 'folders/' + generateUUID())
  const { triggerWarning } = useNotification()
  try {
    await uploadBytes(storageRef, imgData.file)
    return await getDownloadURL(storageRef)
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('storageService.ts - saveImage', {
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
                text: ':ghost: saveImageForFolder',
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
      triggerWarning(err.message)
    }
  }
}

function generateUUID() { // Public Domain/MIT
  let d = new Date().getTime() // Timestamp
  let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0 // Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 // random number between 0 and 16
    if (d > 0) { // Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else { // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}
