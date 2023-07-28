<script setup>
import { onMounted, ref, computed } from 'vue'
import { useFileList } from 'src/composables/fileList'
import { mdiDropbox } from '@quasar/extras/mdi-v6'

const { allowedMediaFileExtensions } = useFileList()
const props = defineProps({
  apiKey: {
    type: String,
    required: false
  },
  linkType: {
    type: String,
    default: 'preview'
  },
  multiselect: {
    type: Boolean,
    default: false
  },
  folderselect: {
    type: Boolean,
    default: false
  },
  sizeLimit: {
    type: Number,
    default: 0
  },
  buttonType: {
    type: String,
    default: 'chooser'
  },
  uploadFiles: {
    type: Array,
    default: function () {
      return []
    }
  }
})

const emit = defineEmits(['picked', 'cancel'])

const loaded = ref(!!window.Dropbox)
const scriptLoaded = computed({
  get () {
    return loaded.value
  },
  set (val) {
    loaded.value = val
  }
})
const dropboxChooserIsSupported = ref(false)

onMounted(() => {
  const dropBoxScript = document.createElement('script')
  dropBoxScript.onload = () => {
    scriptLoaded.value = true
    dropboxChooserIsSupported.value = window.Dropbox.isBrowserSupported()
    if (!dropboxChooserIsSupported.value) {
      console.warn('VueDropboxPicker: This browser is not supported')
    }
  }
  dropBoxScript.setAttribute('src', 'https://www.dropbox.com/static/api/2/dropins.js')
  dropBoxScript.setAttribute('id', 'dropboxjs')
  dropBoxScript.setAttribute('data-app-key', '5grywcoat98coj3')
  document.head.appendChild(dropBoxScript)
})
function dropboxIconClicked() {
  const options = {
    extensions: [...allowedMediaFileExtensions],
    success: async (files) => {
      const attachments = []
      // console.log(files)
      for (let i = 0; i < files.length; i++) {
        attachments.push({
          _id: files[i].id,
          title: files[i].name,
          name: files[i].name,
          size: files[i].bytes,
          iconURL: files[i].icon,
          link: files[i].link,
          extension: `. ${files[i].name.split('.')[1]}`
        })
      }
      emit('picked', attachments[0])
    },
    cancel: function () {
      emit('cancel')
    },
    linkType: 'direct',
    multiselect: props.multiselect,
    folderselect: props.folderselect
  }
  if (props.sizeLimit) {
    options.sizeLimit = props.sizeLimit
  }
  window.Dropbox.choose(options)
}
</script>

<template>
  <div v-if="true || scriptLoaded && dropboxChooserIsSupported">
    <q-btn
      align="left"
      class="full-width"
      color="blue"
      no-caps
      padding="6px 24px"
      rounded
      text-color="grey-3"
      unelevated
      @click="dropboxIconClicked">
      <q-avatar size="24px">
        <q-icon :name="mdiDropbox" />
      </q-avatar>
      <div class="q-pl-sm">
        Import from Dropbox
      </div>
    </q-btn>
  </div>
</template>

<style lang="scss">
</style>
