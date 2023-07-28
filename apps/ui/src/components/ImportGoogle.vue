<script setup>
import { onMounted, ref } from 'vue'
import { useFileList } from 'src/composables/fileList'

const { allowedMediaMimeTypes } = useFileList()
const emit = defineEmits(['picked', 'cancel'])
// const attachments = ref([])
const pickerApiLoaded = ref(false)
const developerKey = 'AIzaSyAWFP0u2oXENrTeZ8Fa8S29kAyiERs7JhY'
const clientId = '422826676670-ou8r88r3fgropig5h6knf6k9u1fj3kg1.apps.googleusercontent.com'
// const scope = 'https://www.googleapis.com/auth/drive'
const oauthToken = ref(null)

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly'

const gapiContent = ref('')
const gapiError = ref('')
const showSignIn = ref(true)
const showSignOut = ref(false)

let tokenClient
let gapiInited = false
let gisInited = false
/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  window.gapi.load('client', initializeGapiClient)
  // eslint-disable-next-line no-undef
  window.gapi.client.load('drive', 'v3')
  // eslint-disable-next-line no-undef
  window.gapi.load('picker')
  // eslint-disable-next-line no-undef
  window.gapi.load('drive-share')
  // eslint-disable-next-line no-undef
  // window.gapi.load('drive-realtime')
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await window.gapi.client.init({
    apiKey: developerKey,
    discoveryDocs: [DISCOVERY_DOC]
  })
  gapiInited = true
  maybeEnableButtons()
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPES,
    callback: '' // defined later
  })
  gisInited = true
  maybeEnableButtons()
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    showSignIn.value = true
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp)
    }
    showSignOut.value = true
    await createPicker()
  }

  if (window.gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' })
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' })
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignOutClick() {
  const token = window.gapi.client.getToken()
  if (token !== null) {
    window.google.accounts.oauth2.revoke(token.access_token)
    window.gapi.client.setToken('')
    gapiContent.value = ''
    showSignIn.value = true
    showSignOut.value = false
  }
}

onMounted(() => {
  const gDrive = document.createElement('script')
  gDrive.setAttribute('type', 'text/javascript')
  gDrive.setAttribute('src', 'https://apis.google.com/js/api.js')
  const gapi = document.createElement('script')
  gapi.setAttribute('type', 'text/javascript')
  gapi.setAttribute('src', 'https://accounts.google.com/gsi/client')
  document.head.appendChild(gDrive)
  document.head.appendChild(gapi)
  gapiLoaded()
  gisLoaded()
})

// Create and render a Picker object for picking user Photos.
function createPicker() {
  const audioMimeTypes = allowedMediaMimeTypes.filter((type) => type.includes('audio')).join()
  const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
  view.setMimeTypes(audioMimeTypes)
  view.setSelectFolderEnabled(true)
  view.setIncludeFolders(true)
  const picker = new window.google.picker.PickerBuilder()
    .setAppId(developerKey)
    .setOAuthToken(window.gapi.auth.getToken().access_token)
    .addView(view)
    .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
    .setCallback(pickerCallback)
    .build()
  picker.setVisible(true)
}

function showPicker () {
  const audioMimeTypes = allowedMediaMimeTypes.filter((type) => type.includes('audio')).join()
  return new Promise(
    (resolve, reject) => {
      const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
      view.setMimeTypes(audioMimeTypes)
      view.setSelectFolderEnabled(true)
      view.setIncludeFolders(true)
      const picker = new window.google.picker.PickerBuilder()
        .setAppId(developerKey)
        .setOAuthToken(window.gapi.auth.getToken().access_token)
        .addView(view)
        .setCallback(async function (data) {
          if (data.action === 'picked') {
            const id = data.docs[0].id
            const file = await window.gapi.client.drive.files.get({
              fileId: id,
              alt: 'media'
            })
            console.log(file, file.body)
            resolve(id)
          } else if (data.action === 'cancel') {
            reject('cancel')
          }
        })
        .build()
      picker.setVisible(true)
    })
}

async function pickerCallback(data) {
  if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
    const docs = data.docs
    const attachments = []
    for (let i = 0; i < docs.length; i++) {
      const attachment = {
        _id: '',
        title: '',
        name: '',
        type: '',
        description: '',
        extension: '',
        iconURL: '',
        size: '',
        user: '',
        link: '',
        mimeType: '',
        thumb: null,
        thumb_list: null
      }
      attachment._id = docs[i].id
      attachment.title = docs[i].name
      attachment.name = docs[i].name + '.' + docs[i].mimeType.split('/')[1]
      attachment.type = 'gDrive'
      attachment.description = 'Shared with GDrive'
      attachment.extension =
        '.' +
        docs[i].mimeType.substring(docs[i].mimeType.lastIndexOf('.') + 1)
      attachment.iconURL = docs[i].iconUrl
      attachment.size = docs[i].sizeBytes
      // attachment.user = JSON.parse(localStorage.getItem("user"))
      attachment.thumb = null
      attachment.thumb_list = null
      attachment.link = docs[i].url
      attachment.mimeType = docs[i].mimeType
      attachments.push(attachment)
    }
    // eslint-disable-next-line no-undef
    const file = await gapi.client.drive.files.get({
      fileId: attachments[0]._id,
      fields: 'webContentLink'
    })
    emit('picked', {
      ...attachments[0],
      link: file.result.webContentLink
    })
  }
  oauthToken.value = null
  pickerApiLoaded.value = false
}

window.gapi.load('client:auth2', function() {
  window.gapi.auth2.init({ client_id: clientId })
})
</script>

<template>
  <q-btn
    align="left"
    class="full-width"
    color="white"
    no-caps
    padding="6px 24px"
    rounded
    text-color="grey-10"
    unelevated
    @click="handleAuthClick">
    <q-avatar size="24px">
      <q-img src="~assets/drive.png" />
    </q-avatar>
    <div class="q-pl-sm">
      Import from Google Drive
    </div>
  </q-btn>
  <div class="hidden">
    <template>
      <div class="row no-wrap">
        <div class="col-11">
          Import from Google Drive
        </div>
        <q-avatar
          class="q-pl-sm"
          size="24px">
          <q-img src="~assets/drive.png" />
        </q-avatar>
      </div>
    </template>
  </div>
  <div class="hidden">
    <q-btn
      label="Test gapi"
      @click="createPicker" />
    <q-btn
      label="Execute"
      @click="showPicker" />
    <q-btn
      v-if="showSignOut"
      label="Sign out gapi"
      @click="handleSignOutClick" />
    <div>
      <div v-if="gapiError">
        {{ gapiError }}
      </div>
      <div v-html="gapiContent"></div>
    </div>
  </div>
</template>

<style scoped>
/*button {*/
/*  background: #031629;*/
/*  box-shadow: 0 0 2px 0 rgba(3, 22, 41, 0.11),*/
/*  0 6px 16px 0 rgba(3, 22, 41, 0.08);*/
/*  !*font-family: SFProDisplay-Regular, serif;*!*/
/*  font-size: 14px;*/
/*  !*color: #ffffff;*!*/
/*  letter-spacing: 0.4px;*/
/*  padding: 12px 30px;*/
/*  border-radius: 4px;*/
/*  outline: none;*/
/*  cursor: pointer;*/
/*  transition: all 0.25s;*/
/*}*/

/*button:hover {*/
/*  background-color: rgba(65, 184, 131, 1);*/
/*  border-color: transparent;*/
/*}*/
</style>
