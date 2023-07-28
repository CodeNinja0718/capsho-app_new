import { ref } from 'vue'
import { useNotification } from 'src/composables/useNotification'
import { UploadableFile, UploadableImage } from 'src/models/uploadableFile'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { useFolderStore } from 'src/stores/folder-store'

export function useFileList () {
  const files = ref([])
  const store = useUploadPodcastStore()
  const folderStore = useFolderStore()
  const { triggerWarning } = useNotification()
  const allowedMediaFileExtensions = Object.freeze([
    '.3ga',
    '.8svx',
    '.aac',
    '.ac3',
    '.aif',
    '.aiff',
    '.alac',
    '.amr',
    '.ape',
    '.au',
    '.dss',
    '.flac',
    '.flv',
    '.m4a',
    '.m4b',
    '.m4p',
    '.m4r',
    '.mp3',
    '.mpga',
    '.ogg',
    '.oga',
    '.mogg',
    '.opus',
    '.qcp',
    '.tta',
    '.voc',
    '.wav',
    '.wma',
    '.wv',
    '.webm',
    '.MTS',
    '.M2TS',
    '.TS',
    '.mov',
    '.mp2',
    '.mp4',
    '.m4v',
    '.mxf'
  ])
  const allowedMediaMimeTypes = Object.freeze([
    'audio/mpeg',
    'audio/mpeg-4',
    'audio/x-m4a',
    'audio/wav',
    'audio/x-wav',
    'audio/mp3',
    'audio/x-mp3',
    'video/x-m4v',
    'video/mp4'
  ])

  // const allowedGoogleDriveMimeTypes = Object.freeze([
  //   'audio/mpeg',
  //   'audio/mpeg-4',
  //   'audio/x-m4a',
  //   'audio/wav',
  //   'audio/x-wav',
  //   'audio/mp3',
  //   'audio/x-mp3',
  // ])

  const allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg'
  ]

  function addFiles (newFiles) {
    const isMaxFileNumber = checkMaxFileNumber(newFiles)
    if (isMaxFileNumber) {
      onRejected({ message: 'Allowed max number of files is 1' })
      return null
    }
    const isAudioFiles = checkFileType(newFiles)
    if (!isAudioFiles) {
      const errorMessage = {
        message: 'Oops! Your audio file is in a format we don’t recognize.',
        caption: 'Please upload it as an mp3, mp4, wav or mov file.'
      }
      onRejected(errorMessage)
      return null
    }
    const newUploadableFiles = [...newFiles].map((file) => new UploadableFile(file)).filter((file) => !fileExists(file.id))
    files.value = files.value.concat(newUploadableFiles)
    store.podcastFile = files.value[0]
  }

  function addImages (newImages) {
    const isMaxFileNumber = checkMaxFileNumber(newImages)
    if (isMaxFileNumber) {
      onRejected({ message: 'Allowed max number of files is 1' })
      return null
    }
    const isImages = checkImageType(newImages)
    if (!isImages) {
      const errorMessage = {
        message: 'Oops! Your image file is in a format we don’t recognize.',
        caption: 'Please upload it as a png, jpg/jpeg file.'
      }
      onRejected(errorMessage)
      return null
    }
    const newUploadableImages = [...newImages].map((file) => new UploadableImage(file)).filter((file) => !fileExists(file.id))
    files.value = files.value.concat(newUploadableImages)
    folderStore.folderFile = files.value[0]
  }

  function fileExists (otherId) {
    return files.value.some(({ id }) => id === otherId)
  }

  function removeFile (file) {
    const index = files.value.indexOf(file)

    if (index > -1) files.value.splice(index, 1)
  }

  function checkFileType (files) {
    return files.every(file => allowedMediaMimeTypes.includes(file.type))
  }

  function checkImageType (files) {
    return files.every(file => allowedImageTypes.includes(file.type))
  }

  function checkMaxFileNumber (files) {
    return files.length > 1
  }

  function filterFileType (files) {
    const isMaxFileNumber = checkMaxFileNumber(files)
    if (isMaxFileNumber) {
      const errorMessage = {
        message: 'Uh oh, we have a little mix-up!',
        caption: 'You’ve uploaded more than one audio file but we need your episode audio to be added as one file'
      }
      onRejected(errorMessage)
      return null
    }
    return files.filter(file => allowedMediaMimeTypes.includes(file.type))
  }

  function filterImageType (files) {
    const isMaxFileNumber = checkMaxFileNumber(files)
    if (isMaxFileNumber) {
      const errorMessage = {
        message: 'Uh oh, we have a little mix-up!',
        caption: 'You’ve uploaded more than one image file but we need your folder image to be added as one file'
      }
      onRejected(errorMessage)
      return null
    }
    return files.filter(file => allowedImageTypes.includes(file.type))
  }

  function onRejected (errorMessage) {
    triggerWarning(errorMessage.message, true, errorMessage.caption)
  }

  return {
    files,
    addFiles,
    removeFile,
    filterFileType,
    onRejected,
    addImages,
    filterImageType,
    allowedMediaMimeTypes,
    allowedMediaFileExtensions
  }
}
