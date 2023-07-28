import { Notify } from 'quasar'

export function useNotification () {
  return {
    triggerPositive (message: string, multiLine = false, caption = '', timeout = 5000) {
      Notify.create({
        type: 'positive',
        message,
        multiLine,
        caption,
        timeout
      })
    },

    triggerNegative (message: string, multiLine = false, caption = '', timeout = 5000) {
      Notify.create({
        type: 'negative',
        message,
        multiLine,
        caption,
        timeout
      })
    },

    triggerWarning (message: string, multiLine = false, caption = '', timeout = 5000) {
      Notify.create({
        type: 'warning',
        message,
        multiLine,
        caption,
        timeout
      })
    },

    triggerBetaEmailWarning (message: string, multiLine = false, caption = '', timeout = 5000) {
      Notify.create({
        type: 'warning',
        message,
        multiLine,
        caption,
        timeout,
        actions: [
          { label: 'Join', color: 'accent', handler: () => (location.href = 'https://beta.capsho.com/optin') },
          { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
        ]
      })
    },

    triggerInfo (message: string, multiLine = false, caption = '', timeout = 5000) {
      Notify.create({
        type: 'info',
        message,
        multiLine,
        caption,
        timeout
      })
    },

    triggerOngoing (message: string, multiLine = false, caption = '', timeout = 5000) {
      // we need to get the notification reference
      // otherwise it will never get dismissed ('ongoing' type has timeout 0)
      const notify = Notify.create({
        type: 'ongoing',
        message,
        multiLine,
        caption,
        timeout
      })

      // simulate delay
      setTimeout(() => {
        notify({
          type: 'positive',
          message: 'Found the results that you were looking for',
          timeout: 1000
        })
      }, 4000)
    }
  }
}
