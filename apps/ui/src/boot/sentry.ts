import { boot } from 'quasar/wrappers'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import { AppErrorService } from 'src/services/app-error-service'
import { CONSTANTS } from 'src/config'

export default boot(async ({ app, router }) => {
  app.config.errorHandler = (error) => {
    AppErrorService.onError(error)
  }
  Sentry.init({
    app,
    dsn: CONSTANTS.APP.SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', 'https://my.capsho.com/', /^\//]
      })
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    logErrors: true,
    trackComponents: true,
    release: 'capsho-app-quasar@0.1.1'
  })
})
