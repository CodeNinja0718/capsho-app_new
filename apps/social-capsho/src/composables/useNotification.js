import store from '../store'

export function useNotification() {
  const alertPrimary = (message) => {
    store.dispatch('notifications/addNotification', {
      type: 'primary',
      message: message
    })
  }

  const alertWarning = (message) => {
    store.dispatch('notifications/addNotification', {
      type: 'warning',
      message: message
    })
  }

  const alertDanger = (message) => {
    store.dispatch('notifications/addNotification', {
      type: 'danger',
      message: message
    })
  }

  const alertSuccess = (message) => {
    store.dispatch('notifications/addNotification', {
      type: 'success',
      message: message
    })
  }

  const alertDark = (message) => {
    store.dispatch('notifications/addNotification', {
      type: 'dark',
      message: message
    })
  }
  return {
    alertPrimary,
    alertWarning,
    alertDanger,
    alertSuccess,
    alertDark
  }
}
