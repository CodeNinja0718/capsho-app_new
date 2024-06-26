
import './styles/quasar.scss'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'

// To be used on app.use(Quasar, { ... })
export default {
  config: {
    loading: {
      delay: 200,
      spinnerSize: 60,
      message: 'Processing your request'
    }
  },
  plugins: [
    'Loading'
  ]
}
