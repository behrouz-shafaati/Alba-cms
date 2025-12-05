export type PageContent = {
  id: string // UUID
  title: string
  slug: string
  template: string
  category: string
  rows: PageRow[]
}

export type PageRow = {
  id: string // UUID
  type: 'row'
  styles: { [key: string]: string }
  settings: { rowColumns: string }
  columns: PageColumn[]
}

export type PageColumn = {
  id: string // UUID
  width: number // مثلاً 6 یعنی 6 از 12 (مثل Bootstrap)
  blocks: PageBlock[]
}

export type PageBlock = {
  id: string // UUID
  title?: string // Optional title for the block
  slug?: string // Optional slug for the block, useful for custom blocks
  // The type is not updatable.
  type:
    | 'row'
    | 'column'
    | 'text'
    | 'image'
    | 'video'
    | 'gallery'
    | 'form'
    | 'product'
    | 'custom'
  content?: object
  styles: {
    padding?: string
    margin?: string
    backgroundColor?: string
    borderRadius?: string
    visibility: {
      desktop: boolean
      tablet: boolean
      mobile: boolean
    }
    [key: string]: any
  }
  settings?: {
    [key: string]: any
  }
  children?: PageBlock[]
}
