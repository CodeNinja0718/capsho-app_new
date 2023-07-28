// if (process.env.NODE_ENV === 'development') {
//   module.exports = {
//     INTERCOM_APP_ID: process.env.VUE_APP_DEV_INTERCOM_ID
//   }
// } else if (process.env.NODE_ENV === 'production') {
//   module.exports = {
//     INTERCOM_APP_ID: process.env.VUE_APP_INTERCOM_ID
//   }
// }

module.exports = {
  INTERCOM_APP_ID: process.env.VUE_APP_INTERCOM_ID,
  DEEPGRAM_API_KEY: process.env.VUE_APP_DEV_DEEPGRAM_API_KEY,
  EMAILJS_SERVICE_ID: process.env.VUE_APP_EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID: process.env.VUE_APP_EMAILJS_TEMPLATE_ID,
  EMAILJS_USER_ID: process.env.VUE_APP_EMAILJS_USER_ID,
  ASSEMBLY_API_KEY: process.env.VUE_APP_ASSEMBLY_API_KEY
}
