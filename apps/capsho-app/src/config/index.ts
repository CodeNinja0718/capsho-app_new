const APP = {
  API_BASE_URL: 'https://us-central1-capsho-abdf4.cloudfunctions.net',
  API_SPELLING_URL: 'https://capsho-spelling-names-4tbp2friba-uc.a.run.app/spelling',
  API_SPELLING_URL_DEV: 'http://localhost:5000/spelling',
  API_SPELLING_URL_DOCKER: 'http://localhost:8090/spelling',
  ENV: process.env.NODE_ENV,
  FIREBASE_CONFIG: Object.freeze({
    apiKey: process.env.VUE_APP_API_KEY,
    appId: process.env.VUE_APP_APP_ID,
    authDomain: process.env.VUE_APP_AUTH_DOMAIN,
    messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
    projectId: process.env.VUE_APP_PROJECT_ID,
    storageBucket: process.env.VUE_APP_STORAGE_BUCKET
  }),
  INTERCOM_APP_ID: process.env.VUE_APP_INTERCOM_ID,
  LOGTAIL_TOKEN: process.env.VUE_APP_LOGTAIL_TOKEN || '',
  PRO_PLAN_COUPON_ID: process.env.VUE_APP_PRO_COUPON_ID,
  SENTRY_DSN: 'https://436283ff664d4c67bc3da3deddf3f2f7@o1165525.ingest.sentry.io/6255660',
  SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/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'
}

const APP_DEV = {
  API_BASE_URL: 'https://us-central1-capsho-development.cloudfunctions.net',
  API_SPELLING_URL: 'https://capsho-spelling-names-4tbp2friba-uc.a.run.app/spelling',
  API_SPELLING_URL_DEV: 'http://localhost:5000/spelling',
  API_SPELLING_URL_DOCKER: 'http://localhost:8090/spelling',
  ENV: process.env.NODE_ENV,
  FIREBASE_CONFIG: Object.freeze({
    apiKey: process.env.VUE_APP_DEV_API_KEY,
    appId: process.env.VUE_APP_DEV_APP_ID,
    authDomain: process.env.VUE_APP_DEV_AUTH_DOMAIN,
    messagingSenderId: process.env.VUE_APP_DEV_MESSAGING_SENDER_ID,
    projectId: process.env.VUE_APP_DEV_PROJECT_ID,
    storageBucket: process.env.VUE_APP_DEV_STORAGE_BUCKET
  }),
  INTERCOM_APP_ID: process.env.VUE_APP_INTERCOM_ID,
  LOGTAIL_TOKEN: process.env.VUE_APP_LOGTAIL_TOKEN || '',
  PRO_PLAN_COUPON_ID: process.env.VUE_APP_PRO_COUPON_ID,
  SENTRY_DSN: 'https://436283ff664d4c67bc3da3deddf3f2f7@o1165525.ingest.sentry.io/6255660',
  SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/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'
}

export const CONSTANTS = Object.freeze({
  APP: process.env.DEV ? APP_DEV : APP
})
