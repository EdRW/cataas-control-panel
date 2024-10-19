const DOMAIN = 'https://cataas.com'

export type Type = 'square' | 'medium' | 'small' | 'xsmall'
export type Fit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside'

export type Position =
  | 'top'
  | 'right top'
  | 'right'
  | 'right bottom'
  | 'bottom'
  | 'left bottom'
  | 'left'
  | 'left top'
  | 'center'

type FilterParams =
  | {
      filter?: 'mono' | 'negate'
    }
  | {
      filter?: 'custom'
      blur?: number

      r?: number
      g?: number
      b?: number

      brightness?: number
      saturation?: number
      hue?: number
      lightness?: number
    }

type SizeParams =
  | {
      type?: Type
      width?: undefined
      height?: undefined
    }
  | {
      type?: undefined
      width?: number
      height?: number
    }

type Format =
  | {
      html?: boolean
      json?: undefined
    }
  | {
      html?: undefined
      json?: boolean
    }

export type CatQueryParams = {
  fit?: Fit
  position?: Position
} & FilterParams &
  SizeParams &
  Format

function fn(a: CatQueryParams) {
  if (a.html) {
    a.json
  }
  if (a.filter === 'custom') {
    a.blur
  }
}
