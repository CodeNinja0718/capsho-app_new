import type { Editor } from '@tiptap/core'

export interface ChildNodes {

  default: string
  description: string
  expression: string
  key: string
  multiple: boolean
  multiple_max: number
  multiple_min: number
  name: string
  placeholder: string
  type: string
  validations: string
  values: string
  ui: {
    [key: string]: number|string|null
  }
}

export interface ParentNodes {
  fields: ChildNodes[]
  key: string
  name: string
}

export interface AppComponentProps {
  content: ParentNodes[]
  editor: Editor
}

export interface ImageAttrsOptions {
  alt?: string
  caption?: string
  src?: string
  title?: string
}

export interface DialogProps extends AppComponentProps {
  blockType: string
  imageAttrs?: ImageAttrsOptions
}

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
  currentTarget: T;
}
