import { shallowMount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

describe('[<BaseButton/> Component]', () => {
  test('it mounts', () => {
    const wrapper = shallowMount(BaseButton)
    expect(wrapper.exists()).toBe(true)
  })

  test('renders its content', () => {
    const slotContent = '<span>foo</span>'
    const wrapper = shallowMount(BaseButton, {
      slots: {
        default: slotContent
      }
    })
    expect(wrapper.element.innerHTML).toContain(slotContent)
  })
})
