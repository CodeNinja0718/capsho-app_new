import { mount } from '@vue/test-utils'
import BaseInput from './BaseInput.vue'

describe('[<BaseInput/> Component]', () => {
  let wrapper
  const placeholder = 'First and last name'

  function createComponent () {
    wrapper = mount(BaseInput, {
      propsData: {
        placeholder: placeholder,
        modelValue: 'aaa',
        type: 'text'
      }
    })
  }

  beforeEach(() => {
    createComponent()
  })

  test('it mounts', () => {
    expect(wrapper.exists()).toBe(true)
  })

  test('asserting prop placeholder', () => {
    expect(wrapper.props('placeholder')).toBe(placeholder)
  })

  test('works with v-model', async () => {
    const inputWrapper = wrapper.find('input')
    const inputEl = inputWrapper.element

    // Has the correct starting value
    expect(inputEl.value).toEqual('aaa')

    // Emits an update event with the correct value when edited
    inputEl.value = 'bbb'
    inputWrapper.trigger('input')
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual('bbb')

    // Sets the input to the correct value when props change
    await wrapper.get('[data-test="base-input-text"]').setValue('ccc')
    expect(inputEl.value).toEqual('ccc')
  })

  test('allows a type of "password"', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    mount(BaseInput, {
      propsData: {
        value: 'aaa',
        type: 'password'
      },
    })
    expect(consoleError).not.toBeCalled()
    consoleError.mockRestore()
  })

  test('does NOT allow a type of "checkbox"', () => {
    const consoleError = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {})
    mount(BaseInput, {
      propsData: {
        value: 'aaa',
        type: 'checkbox'
      },
    })
    expect(consoleError.mock.calls[0][0]).toContain(
      'custom validator check failed for prop "type"'
    )
    consoleError.mockRestore()
  })
})
