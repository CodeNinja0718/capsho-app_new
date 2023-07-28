import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  uploadBytes,
  listAll
} from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import store from '@/store'
import { updateUserInfo } from './authService'
import { useNotification } from '@/composables/useNotification'

export function saveImage(imgData) {
  const auth = getAuth()
  const user = auth.currentUser
  const storage = getStorage()
  const storageRef = ref(storage, 'logotypes/' + user.uid)

  const uploadImgTask = uploadBytesResumable(storageRef, imgData)
  const { alertDanger } = useNotification()
  // TODO: do something with progress
  // maybe show progress bar to user
  uploadImgTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log('Upload is ' + progress + '% done')
    },
    (err) => {
      alertDanger(err)
    },
    () => {
      getDownloadURL(uploadImgTask.snapshot.ref).then(async (downloadURL) => {
        await updateUserInfo({ newPhoto: downloadURL })
        if (store.getters.userData) {
          store.commit('changeUserPhoto', downloadURL)
        }
        return downloadURL
      })
    }
  )
}

export async function uploadPodcast(fileData) {
  const auth = getAuth()
  const user = auth.currentUser
  const storage = getStorage()
  const storageRef = ref(storage, 'podcasts/' + user.uid + '/' + fileData.name)
  const { alertDanger } = useNotification()
  try {
    await uploadBytes(storageRef, fileData)
    return await getDownloadURL(storageRef)
  } catch (e) {
    alertDanger(e.message)
  }
}

export async function deletePodcastFile(url) {
  const { alertDanger } = useNotification()
  try {
    const storage = getStorage()
    const desertRef =ref(storage, url)
    await deleteObject(desertRef)
  } catch (e) {
    alertDanger(e.message)
  }
}

export async function listAllPodcasts() {
  const { alertDanger } = useNotification()
  try {
    const auth = getAuth()
    const user = auth.currentUser
    const storage = getStorage()
    const podcastsRef = ref(storage, 'podcasts/' + user.uid)
    // const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/'
    return await listAll(podcastsRef)
  } catch (e) {
    alertDanger(e.message)
  }
}
