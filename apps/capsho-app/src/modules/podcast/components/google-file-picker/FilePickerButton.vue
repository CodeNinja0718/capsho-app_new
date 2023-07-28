<template>
  <file-picker-button
    :config="gConfig"
    @picked="showDetails">
    Open Google Drive Dialog
  </file-picker-button>
</template>

<script>
import FilePickerButton from './filePickerButton'
export default {
  components: {
    FilePickerButton
  },
  data() {
    return {
      gConfig: {
        // The Browser API key obtained from the Google API Console.
        developerKey: 'AIzaSyAWFP0u2oXENrTeZ8Fa8S29kAyiERs7JhY',

        // The Client ID obtained from the Google API Console. Replace with your own Client ID.
        clientId: '422826676670-ou8r88r3fgropig5h6knf6k9u1fj3kg1.apps.googleusercontent.com',

        // Scope to use to access user's drive.
        scope: 'https://www.googleapis.com/auth/drive.file'
      }
    }
  },
  methods: {
    showDetails (data) {
      if (data.picked === 'picked') {
        console.log(data.docs)
      }
    }
  }
}
</script>
