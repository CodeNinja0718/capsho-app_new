import { defineStore, DocumentStateProperties } from 'pinia'
import { Template, Resource } from 'src/models/template'
import * as lib from './lib'
import type { Unsubscribe } from '@firebase/firestore'

export const useDocumentStore = defineStore('document', {
  state: () => ({
    resources: [] as Resource[],
    preview: false,
    selectedItem: -1,
    templates: [] as Template[],
    templatesListener: {} as Unsubscribe
  } as unknown as DocumentStateProperties),
  getters: {
    getResources: (state) => {
      return state.resources
    }
  },
  actions: {
    // get all templates of user
    getAllTemplates () {
      Promise.resolve(this.$fbServices.listAllTemplates())
    },

    // add new template
    async addTemplate(previewUrl: string, templateName: string) {
      const ress = [] as Resource[]
      this.resources.forEach(res => {
        if (res.type === 'text') {
          ress.push({
            ...res,
            content: {
              type: 'doc',
              content: [{
                type: 'paragraph',
                attrs: {
                  textAlign: 'left'
                }
              }]
            }
          })
        } else if (res.type === 'image') {
          ress.push({
            ...res,
            content: {
              image: {
                alt: '',
                src: 'http://via.placeholder.com/600x350'
              },
              caption: {
                text: '',
                position: ''
              }
            }
          })
        }
      })

      const data = {
        resources: ress,
        preview: true,
        templateName,
        previewUrl
      }
      await this.$fbServices.createTemplateDocument(data)
    },

    // get resources from server
    getTemplate (templateId: string) {
      this.resources = []
      this.$fbServices.getTemplateById(templateId)
        .then((template: Template) => {
          this.resources = template.resources
          this.preview = template.preview
        })
    },

    async deleteTemplate (templateId: string) {
      await this.$fbServices.deleteTemplate(templateId)
    },

    // getLastX
    getLastY() {
      if (this.resources.length > 0) {
        const yArr = this.resources.map((res: Resource) => (res.h + res.y))
        return Math.max.apply(null, yArr)
      } else {
        return 0
      }
    },

    // Add new Text field
    addTextGridItem(subType: string) {
      const g = lib.guid()
      const width = 900
      let w, h
      switch (subType) {
      case 'Title':
        w = width
        h = 80
        break
      case 'Intro': {
        w = width
        h = 200
        break
      }
      case 'SubTitle': {
        w = width
        h = 70
        break
      }
      case 'SubDetail': {
        w = width
        h = 200
        break
      }
      case 'Conclusion': {
        w = width
        h = 200
        break
      }
      default:
        break
      }
      const k = {
        x: 0,
        y: this.getLastY(),
        w,
        h,
        i: g,
        order: 20,
        type: 'text',
        subtype: subType,
        content: {
          type: 'doc',
          content: [{
            type: 'paragraph',
            attrs: {
              textAlign: 'left'
            }
          }]
        }
      }
      this.resources.push(k as Resource)
    },

    // Add new Image field
    addImageGridItem() {
      const g = lib.guid()
      const k = {
        x: 0,
        y: this.getLastY(),
        w: 792,
        h: 450,
        i: g,
        order: 10,
        type: 'image',
        content: {
          image: {
            alt: '',
            src: 'http://via.placeholder.com/600x350'
          },
          caption: {
            text: '',
            position: ''
          }
        }
      }
      this.resources.push(k as Resource)
    },

    // Add new Quote field
    addQuoteItem() {
      const g = lib.guid()
      const k = {
        x: 0,
        y: this.getLastY(),
        w: 200,
        h: 70,
        i: g,
        order: 20,
        type: 'quote',
        content: {
          type: 'doc',
          content: [
            {
              type: 'blockQuote',
              content: [
                {
                  type: 'quoteContent',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Quote'
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'quoteAuthor',
                  content: [
                    {
                      type: 'text',
                      text: 'quote'
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
      this.resources.push(k as Resource)
    },

    // Add new Date field
    addDateItem() {
      const g = lib.guid()
      const k = {
        x: 0,
        y: this.getLastY(),
        w: 160,
        h: 50,
        i: g,
        order: 20,
        type: 'date',
        content: {
          timestamp: Date.now()
        }
      }
      this.resources.push(k as Resource)
    },

    // Set data to the item
    setItem(payload: {key: number, data: Resource}) {
      if (payload.key > -1) {
        this.resources[payload.key] = payload.data
      }
    },

    // set selectedItem index
    setSelectedItemIndex(key: number) {
      if (key > -1) {
        this.selectedItem = key
      }
    },

    // Set content to the TextWidget
    setTextContent(content: string) {
      const updatedContent = {
        ...this.resources[this.selectedItem],
        content: {
          type: 'doc',
          content: [{
            type: 'paragraph',
            attrs: {
              textAlign: 'left'
            },
            content: [{
              type: 'text',
              text: content
            }]
          }]
        }
      }
      if (this.selectedItem > -1) {
        this.resources[this.selectedItem] = updatedContent
      }
    },
    // Remove Item
    removeItem(payload: { key: number }) {
      if (payload.key > -1) {
        this.resources.splice(payload.key, 1)
      }
    },

    // Toggle preview/edit mode
    togglePreview() {
      this.preview = !this.preview
    }

  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: sessionStorage,
        paths: ['documents', 'id']
      }
    ]
  }
})
