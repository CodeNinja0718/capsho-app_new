import { boot } from 'quasar/wrappers'
import { componentRegistration } from 'src/components/_globals.js'

export default boot(async ({ app }) => {
  componentRegistration({ app })
})
