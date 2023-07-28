import { Loading } from 'quasar'
import { computed, ref } from 'vue'
import { storageRef } from 'src/services/firebase/base'
import { uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useNotification } from 'src/composables/useNotification'

Loading.setDefaults({
  color: 'primary',
  size: '8px',
  position: 'bottom'
})

export default function useUploadFiles () {
  const uploading = ref(false)
  const filesUploading = ref([])
  const uploadedFiles = ref([])
  const queuedFiles = ref([])
  const canUpload = ref(true)
  // We're working on uploading files
  const isUploading = computed(() => {
    return uploading.value
  })

  const isBusy = computed(() => {
    return uploading.value
  })

  function abort () {
    filesUploading.value.forEach(uploadTask => {
      uploadTask.reject()
    })
    canUpload.value = false
  }

  function uploadFileToFirestore (file) {
    const { triggerNegative } = useNotification()
    if (!(file instanceof File)) {
      return false
    }
    const datetime = new Date().toISOString().split('.')[0]
    const fileSuffix = file.type.split('/')[1],
      uploadImageStorageRef = storageRef(`creative-guest-assets/${datetime}_${file.name}.${fileSuffix}`),
      profileImageStorageRef = uploadBytesResumable(uploadImageStorageRef, file)
    return new Promise((resolve, reject) => {
      // Firebase UploadTask Event
      profileImageStorageRef.on(
        'state_changed',
        (snapshot) => true,
        (err) => {
          triggerNegative(`There was a problem with the upload. ${err}`)
          reject()
        },
        () => {
          queuedFiles.value = []
          filesUploading.value = []
          getDownloadURL(profileImageStorageRef.snapshot.ref)
            .then((link) => {
              uploadedFiles.value.push({
                isImage: file.type.includes('image'),
                isUploaded: true,
                name: file.name,
                type: file.type,
                uploadedDate: datetime,
                url: link
              })
            })
          resolve()
        }
      )
    })
  }

  // Start the uploading process
  /**
   * @param files
   * @returns {Promise<unknown>|null}
   */
  function upload (files) {
    const { triggerNegative } = useNotification()
    if (canUpload.value === false) {
      return null
    }
    uploading.value = true
    Loading.show()
    files.forEach((file) => {
      if (file.isUploaded) {
        uploadedFiles.value.push(file)
      } else {
        filesUploading.value.push(uploadFileToFirestore(file))
      }
    })
    return Promise.all(filesUploading.value)
      .then(() => {
        uploading.value = false
        Loading.hide()
      })
      .catch(err => {
        triggerNegative(`One or more of your files failed to upload. ${err}`)
      })
      .finally(() => {
        filesUploading.value = []
      })
  }

  return {
    isUploading,
    isBusy,
    uploadedFiles,
    abort,
    upload
  }
}
