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

export interface Template {
  id: string,
  resources: Resource[],
  previewUrl: string,
  templateName: string,
  preview: boolean
}

export interface LayoutContent {
  content: Array<{
    attrs: {
      label: string
      type: 'draggableBlock' | string // draggableBlock
    }
  }>
  type: 'doc'
}

export interface TemplateV2 {
  layout: LayoutContent,
  nonGuestLayout?: LayoutContent,
  guestLayout: LayoutContent,
  title: string
  type: `${'description' | 'showNotes' | 'email' | 'Blog Post(Listicle)' | 'Blog Post(How-to)' | 'Blog Post(Q & A)' | 'ytDescription' | 'laArticle' | 'default'}Layout`
  coverImage: string,
  id?: string
  createdAt?: number // firebase timestamp
}

export interface TemplateV2Creator {
  id: string
  creator: {
    id: string
    name: string
  }
}
