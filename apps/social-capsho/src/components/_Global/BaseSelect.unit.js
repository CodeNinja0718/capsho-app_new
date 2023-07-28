import { mount } from '@vue/test-utils'
import BaseSelect from './BaseSelect.vue'

describe('[<BaseSelect/> Component]', () => {
  let wrapper
  const optionsProp = [
    {
      label: 'All',
      value: 'all'
    },
    {
      label: 'Wood',
      value: 'wood'
    },
    {
      label: 'Cotton',
      value: 'cotton'
    },
    {
      label: 'Steel',
      value: 'steel'
    }
  ]

  function createComponent () {
    wrapper = mount(BaseSelect, {
      propsData: {
        options: optionsProp
      }
    })
  }

  beforeEach(() => {
    createComponent()
  })

  test('it mounts', () => {
    expect(wrapper.exists()).toBe(true)
  })

  test('asserting required prop options', () => {
    expect(wrapper.props('options')).toStrictEqual(optionsProp)
  })

  test('selects an option element and updates v-model bound data', async () => {
    const options = wrapper.find('select').findAll('option')
    await options.at(3).setSelected()
    expect(wrapper.find('option:checked').element.value).toBe(optionsProp[3].value)
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe(optionsProp[3].value)
  })
})
