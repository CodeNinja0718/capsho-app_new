/* eslint-disable */

export default {
  template: '<button @click="handleButtonClick" :disabled="!pickerApiLoaded"><slot/></button>',
  props: ['config'],
  data() {
    return {
      picked: {},
      pickerApiLoaded: false,
      oauthToken: ''
    }
  },
  methods: {
    handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        this.oauthToken = authResult.access_token
        this.createPicker()
      } else {
        return console.warn(authResult.details)
      }
    },
    handleButtonClick() {
      window.gapi.auth2.authorize({
        client_id: this.config.clientId,
        scope: this.config.scope
      }, this.handleAuthResult)
    },
    createPicker () {
      if (this.pickerApiLoaded && this.oauthToken) {
        const pickerBuilder = new google.picker.PickerBuilder()
          .setOAuthToken(this.oauthToken)
          .setDeveloperKey(this.config.developerKey)
          .setCallback(this.pickerCallback)

        this.$emit('build', pickerBuilder)

        if (!this.$listeners.build) { pickerBuilder.addView(google.picker.ViewId.DOCS) }

        const picker = pickerBuilder.build()
        picker.setVisible(true)
      }
    },
    pickerCallback(data) {
      if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        this.$emit('picked', data)
      }
    }
  },
  mounted () {
    if (!window.gapi) { return console.warn('Google API not loaded') }
    window.gapi.load('auth2')
    window.gapi.load('picker', () => {
      this.pickerApiLoaded = true
    })
  }
}
