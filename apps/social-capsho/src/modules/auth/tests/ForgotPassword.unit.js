import { mount } from '@vue/test-utils'
import ForgotPassword from '../pages/ForgotPassword.vue'
import BaseInput from '@/components/_Global/BaseInput.vue'
import { createStore } from '@/store'
import router from '@/router/'

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn(() => Promise.resolve())
  }
})

const store = createStore()
let wrapper

function mountEventList(config = {}) {
  config.mountOptions = config.mountOptions || {}
  config.plugins = config.plugins || {}
  return mount(ForgotPassword, {
    global: {
      plugins: [createStore(config.plugins.store), router],
      stubs: ['router-link', 'router-view'],
      components: {
        'base-input': BaseInput
      },
      mocks: {
        sendEmail: jest.fn(() => Promise.resolve())
      }
    },
    ...config.mountOptions
  })
}

describe('>>> ForgotPassword Component', () => {
  beforeEach(() => {
    wrapper = mountEventList()
  })

  test('if email is not empty verifies that sendEmail() & router.push(\'/sign-in\') was called', async () => {
    // router.push('/forgot-password')
    // await router.isReady()

    const forgotPasswordMockFunction = jest
      .spyOn(wrapper.vm, 'sendEmail')
      .mockImplementation(() => {
        return jest.fn(() => Promise.resolve(router.push('/sign-in')))
      })

    const emailSelector = '[data-testid=forgot-email-input]'
    const buttonSelector = '[data-testid=forgot-submit-button]'

    const emailInput = wrapper.get(emailSelector)
    const submitButton = wrapper.get(buttonSelector)

    await emailInput.setValue('test@email.com')

    expect(emailInput.element.value).toBe('test@email.com')

    expect(store.getters.verifyEmailError).toBeNull()

    await submitButton.trigger('click')

    expect(forgotPasswordMockFunction).toHaveBeenCalledTimes(1)

    return forgotPasswordMockFunction()(emailInput.element.value).then(() => {
      expect(wrapper.vm.$route.path).toBe('/sign-in')
    })
  })

  test('submit button will be disabled if email value is empty', () => {
    const forgotPasswordMockFunction = jest
      .spyOn(wrapper.vm, 'sendEmail')
      .mockImplementation(() => {
        return jest.fn(() => Promise.resolve())
      })

    const emailSelector = '[data-testid=forgot-email-input]'
    const buttonSelector = '[data-testid=forgot-submit-button]'

    const emailInput = wrapper.get(emailSelector)
    const submitButton = wrapper.get(buttonSelector)

    emailInput.element.value = ''
    emailInput.trigger('input')

    expect(emailInput.element.value).toBe('')

    expect(store.getters.verifyEmailError).toBeNull()

    expect(submitButton.element.disabled).toBe(true)
  })
})
