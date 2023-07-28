import { mount } from '@vue/test-utils'
import BrandLogoUpload from './BrandLogoUpload.vue'
import { createStore } from '@/store'
import { getAuth } from 'firebase/auth'
const actions = { auth: { handler: () => {}, logout: () => jest.fn() } };
let wrapper
function mountEventList(config = {}) {
  config.mountOptions = config.mountOptions || {}
  config.plugins = config.plugins || {}
  return mount(BrandLogoUpload, {
    global: {
      plugins: [createStore({
        modules: {
          app: {
            actions,
            state() {
              return {}
            }
          }
        }
      })],
      mocks: {
        useBrandLogo: jest.fn(() => {}),
        selectImage: jest.fn(),
        handleSelectedImage: jest.fn(() => null)
      }
    },
    ...config.mountOptions
  })
}

jest.mock(getAuth)
jest.mock('useAuth')

describe('[<BrandLogoUpload/> Component]', () => {
  beforeEach(() => {
    wrapper = mountEventList()
  })
  test('it mounts', () => {
    console.log(wrapper)
    expect(wrapper.exists()).toBe(true)
  })

  test('it takes the file from the event', () => {
    const file = { size: 1000, type: 'image/png', name: 'avatar.png' }
    // const event = {
    //   target: {
    //     files: [file]
    //   }
    // }

    let handleSelectedImage = jest
      .spyOn(wrapper.vm, 'handleSelectedImage')
      .mockImplementation(() => {})

    const fileInputWrapper = wrapper.find('input')
    fileInputWrapper.trigger('change')
    expect(wrapper.vm.takeFile(event)).toEqual(file)
    expect(handleSelectedImage).toHaveBeenCalled()
  })

  test('it emits an invalid-image event if an invalid file is selected', () => {

    // create mock image, will fail validation due to non image type
    const invalid_image_file = {
      type: 'text/html',
      size: 1000
    }

    // const event = {
    //   target: {
    //     files: [invalid_image_file]
    //   }
    // }

    let handleSelectedImage = jest
      .spyOn(wrapper.vm, 'handleSelectedImage')
      .mockImplementation(() => {})

    const fileInputWrapper = wrapper.find('input')
    fileInputWrapper.trigger('change')
    expect(handleSelectedImage).toHaveBeenCalled()
    expect(wrapper.emitted()['invalid-file']).toBeDefined()
  })
})
