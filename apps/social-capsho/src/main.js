import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import 'tw-elements'
import router from './router'
import store from '@/store'
import { firestorePlugin } from 'vuefire'
import VueClipboard from 'vue3-clipboard'
import componentRegistration from '@/components/_Global/_globals'
import VueGtag from 'vue-gtag-next'
import FontAwesomeIcon from '@/utils/fontawesome'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'

const app = createApp(App).use(Quasar, quasarUserOptions)

componentRegistration({ app })

app.use(router)
app.use(store)
app.use(VueClipboard, {
  autoSetContainer: true,
  appendToBody: true
})

app.use(VueGtag,
  {
    appName: 'Capsho-Frontend',
    property: {
      id: process.env.VUE_APP_GTAG_ID,
      params: {
        anonymize_ip: true
      }
    },
    useDebugger: process.env.NODE_ENV === `development`
  })
app.use(firestorePlugin)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
