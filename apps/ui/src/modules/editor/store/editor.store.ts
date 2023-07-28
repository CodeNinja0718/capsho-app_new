import { defineStore, EditorStoreProperties } from 'pinia'

export const useEditorStore = defineStore('editor', {
  state: () => ({
    src: 'https://source.unsplash.com/8xznAGy4HcY/800x400',
    alt: '',
    caption: '',
    factBox: {
      body: '',
      color: '',
      open: true,
      title: ''
    },
    quoteBox: {
      quote: '',
      author: ''
    }
  } as EditorStoreProperties)
})
