import { store } from 'quasar/wrappers'
import { createPinia, PiniaPluginContext } from 'pinia'
import fbServices from 'src/services/firebase/index'
import * as authFunctions from 'src/services/auth-api'
import * as cloudFunctions from 'src/services/episode-drafts.js'
import * as cloudFunctionsDev from 'src/services/dummy-api.js' // use dummy data in dev
import * as paymentFunctions from 'src/services/payment.js'
import piniaPersist from 'pinia-plugin-persist'

export default store((/* { ssrContext } */) => {
  function ServicesPlugin ({ store }: PiniaPluginContext) {
    store.$fbServices = fbServices
    store.$authFunctions = authFunctions
    store.$cloudFunctions = process.env.DEV ? cloudFunctionsDev : cloudFunctions
    store.$paymentFunctions = paymentFunctions
  }
  const pinia = createPinia()
  pinia.use(ServicesPlugin)
  pinia.use(piniaPersist)
  return pinia
})
