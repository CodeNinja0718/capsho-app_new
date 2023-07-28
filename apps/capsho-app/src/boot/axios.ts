import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { CONSTANTS } from 'src/config'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api = axios.create({ baseURL: CONSTANTS.APP.API_BASE_URL })
const apiV2 = axios.create({ baseURL: CONSTANTS.APP.API_BASE_URL })
const spellingAPI = axios.create({ baseURL: CONSTANTS.APP.API_SPELLING_URL })
spellingAPI.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
spellingAPI.defaults.headers.post['Access-Control-Allow-Origin'] = '*'

const slackFrontendErrors = axios.create({ baseURL: CONSTANTS.APP.SLACK_WEBHOOK_URL })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api
})

export { api, apiV2, spellingAPI, slackFrontendErrors }
