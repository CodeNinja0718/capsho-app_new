import { mount } from '@vue/test-utils'
import Register from '../pages/Register.vue'
import BaseInput from '@/components/_Global/BaseInput.vue'
import { createStore } from '@/store'
import router from '@/router/'

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve())
  }
})

let wrapper
const store = createStore()
const registerUser = jest.fn(() => Promise.resolve())

function mountEventList(config = {}) {
  config.mountOptions = config.mountOptions || {}
  config.plugins = config.plugins || {}
  return mount(Register, {
    global: {
      plugins: [createStore(config.plugins.store), router],
      stubs: ['router-link', 'router-view'],
      components: {
        'base-input': BaseInput
      },
      mocks: {
        registerUser
      }
    },
    ...config.mountOptions
  })
}

describe('>>> Register Component', () => {
  beforeEach(async () => {
    wrapper = mountEventList()
  })

  test('verifies that registerUser() & router.push(\'/create-profile\') was called', async () => {
    router.push('/register')
    await router.isReady()

    const emailSingUpMockFunction = jest
      .spyOn(wrapper.vm, 'registerUser')
      .mockImplementation(() => {
        return jest.fn(({ email, password }) => {
          return new Promise((resolve, reject) => {
            if (email && password) {
              store.commit('app/logIn', true)
              router.push('/create-profile')
              resolve('Successfully signed up')
            } else {
              reject('User not found')
            }
          })
        })
      })

    const emailSelector = '[data-testid=register-email-input]'
    const passwordSelector = '[data-testid=register-password-input]'
    const buttonSelector = '[data-testid=register-submit-button]'

    const emailInput = wrapper.get(emailSelector)
    const passwordInput = wrapper.get(passwordSelector)
    const submitButton = wrapper.get(buttonSelector)

    await emailInput.setValue('test@email.com')
    await passwordInput.setValue('password123')

    expect(emailInput.element.value).toBe('test@email.com')
    expect(passwordInput.element.value).toBe('password123')

    await submitButton.trigger('click')
    expect(emailSingUpMockFunction).toHaveBeenCalledTimes(1)

    return emailSingUpMockFunction()({
      email: emailInput.element.value,
      password: passwordInput.element.value
    }).then((data) => {
      expect(data).toBe('Successfully signed up')
      expect(store.getters.isLoggedIn).toBe(true)
      expect(wrapper.vm.$route.path).toBe('/create-profile')
    })
  })

  test('submit button will be disabled if no email', async () => {
    const emailSingUpMockFunction = jest
      .spyOn(wrapper.vm, 'registerUser')
      .mockImplementation(() => Promise.resolve())

    const emailSelector = '[data-testid=register-email-input]'
    const passwordSelector = '[data-testid=register-password-input]'
    const buttonSelector = '[data-testid=register-submit-button]'

    const emailInput = wrapper.get(emailSelector)
    const passwordInput = wrapper.get(passwordSelector)
    const submitButton = wrapper.get(buttonSelector)

    emailInput.element.value = ''
    emailInput.trigger('input')

    await passwordInput.setValue('password123')

    expect(emailInput.element.value).toBe('')
    expect(passwordInput.element.value).toBe('password123')

    expect(submitButton.element.disabled).toBe(true)
  })

  test('submit button will be disabled if no password', async () => {
    const emailSingUpMockFunction = jest
      .spyOn(wrapper.vm, 'registerUser')
      .mockImplementation(() => Promise.resolve())

    const emailSelector = '[data-testid=register-email-input]'
    const passwordSelector = '[data-testid=register-password-input]'
    const buttonSelector = '[data-testid=register-submit-button]'

    const emailInput = wrapper.get(emailSelector)
    const passwordInput = wrapper.get(passwordSelector)
    const submitButton = wrapper.get(buttonSelector)

    await emailInput.setValue('test@email.com')
    passwordInput.element.value = ''
    passwordInput.trigger('input')

    expect(emailInput.element.value).toBe('test@email.com')
    expect(passwordInput.element.value).toBe('')

    expect(submitButton.element.disabled).toBe(true)
  })
})
