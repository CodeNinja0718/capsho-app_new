import { createStore as vuexCreateStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import profile from '../modules/profile/store'
import podcast from '../modules/podcast/store'
import app from './app'
import notifications from './notifications'

const storeConfiguration = {
  strict: true,
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })
  ],
  modules: {
    app,
    profile,
    podcast,
    notifications
  },
}

const defaultOverrides = {
  state: () => {
    return {}
  }
}

function makeState(initialState, overrideState) {
  return {
    ...(typeof initialState === 'function' ? initialState() : initialState),
    ...overrideState()
  }
}

export function createStore(storeOverrides = defaultOverrides) {
  return vuexCreateStore({
    ...storeConfiguration,
    ...storeOverrides,
    ...{
      modules: {
        app,
        profile,
        podcast,
        notifications
      },
      state: makeState(storeConfiguration.state, storeOverrides.state)
    }
  })
}

export default createStore()
