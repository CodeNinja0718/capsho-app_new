import 'pinia'
import type { ImageAttrsOptions } from 'src/types'

declare module 'pinia' {
  export interface EditorStoreProperties<> extends ImageAttrsOptions {
    show: boolean
    factBox: {
      body: string
      color: string
      open: boolean
      title: string
    },
    quoteBox: {
      quote: string
      author?: string
    }
  }
}
