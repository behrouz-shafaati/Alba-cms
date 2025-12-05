export type Content = {
  id: string // UUID
  title: string
  rows: Row[]
}

export type Row = {
  id: string // UUID
  type: 'row'
  classNames?: // tailwind classess
  {
    manualInputs: string
  }
  styles: { [key: string]: string }
  settings: { rowColumns: string }
  columns: Column[]
}

export type Column = {
  id: string // UUID
  width: number // مثلاً 6 یعنی 6 از 12 (مثل Bootstrap)
  type: 'column'
  classNames?: // tailwind classess
  {
    manualInputs: string
  }
  styles: { [key: string]: string }
  settings: { rowColumns: string }
  blocks: Block[]
}

export type Block = {
  widgetName: string
  id: string // UUID
  title?: string // Optional title for the block
  slug?: string // Optional slug for the block, useful for custom blocks
  // The type is not updatable.
  type:
    | 'row'
    | 'column'
    | 'text'
    | 'write'
    | 'image'
    | 'video'
    | 'gallery'
    | 'form'
    | 'product'
    | 'custom'
    | 'templatePart'
    | 'button'
  content?: object
  classNames?: // tailwind classess
  {
    manualInputs: string
  }
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
  children?: Block[]
}
