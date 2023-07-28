/* eslint-disable */
import { Unsubscribe } from '@firebase/firestore';
import 'pinia'
import { Template } from 'src/models/template';
export interface Resource {
  x: number,
  y: number,
  w: number,
  h: number,
  i: string,
  order: number,
  type: string,
  subtype: string,
  content: object
}

declare module 'pinia' {
  export interface DocumentStateProperties<> {
    $fbServices: any,
    resources: Resource[],
    preview: boolean,
    selectedItem: number,
    templates: Template[],
    templatesListener: Unsubscribe
  }
}
