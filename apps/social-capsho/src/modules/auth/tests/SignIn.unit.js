import { mount } from '@vue/test-utils'
import SignIn from '../pages/SignIn.vue'
import BaseInput from '@/components/_Global/BaseInput.vue'
import { createStore } from '@/store'
import router from '@/router/'

const store = createStore()

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve())
  }
})

let wrapper
const logInEmail = jest.fn(() => Promise.resolve())
const signInGoogle = jest.fn(() => Promise.resolve())

function mountEventList(config = {}) {
  config.mountOptions = config.mountOptions || {}
  config.plugins = config.plugins || {}
  return mount(SignIn, {
    global: {
      plugins: [createStore(config.plugins.store), router],
      stubs: ['router-link', 'router-view'],
      components: {
        'base-input': BaseInput
      },
      mocks: {
        logInEmail,
        signInGoogle
      }
    },
    ...config.mountOptions
  })
}

describe('>>> SignIn Component', () => {
  beforeEach(async () => {
    router.push('/sign-in')
    await router.isReady()
    wrapper = mountEventList()
  })

  test('it signs in with email and password', async () => {
    const emailSignInMockFunction = jest
      .spyOn(wrapper.vm, 'logInEmail')
      .mockImplementation(() => {
        return jest.fn(({ email, password }) => {
          return new Promise((resolve, reject) => {
            if (email && password) {
              store.commit('logIn', true)
              resolve('Successfully signed in')
            } else {
              reject('User not found')
            }
          })
        })
      })

    const emailSelector = '[data-testid=login-email-input]'
    const passwordSelector = '[data-testid=login-password-input]'
    const buttonSelector = '[data-testid=login-submit-button]'

    const emailInput = wrapper.get(emailSelector)
    const passwordInput = wrapper.get(passwordSelector)
    const submitButton = wrapper.get(buttonSelector)

    await emailInput.setValue('test@email.com')
    await passwordInput.setValue('password123')

    expect(emailInput.element.value).toBe('test@email.com')
    expect(passwordInput.element.value).toBe('password123')

    expect(store.getters.isLoggedIn).toBe(false)

    await submitButton.trigger('click')

    expect(emailSignInMockFunction).toHaveBeenCalledTimes(1)

    return emailSignInMockFunction()({
      email: emailInput.element.value,
      password: passwordInput.element.value
    }).then((data) => {
      expect(data).toBe('Successfully signed in')
      expect(store.getters.isLoggedIn).toBe(true)
    })
  })
})
