import { ref } from 'vue'

const DOMAIN = 'https://cataas.com'
const PATH = {
  cat: 'cat',
  gif: 'gif',
  says: 'says'
} as const

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

type FilterParams = {
  filter?: 'mono' | 'negate' | 'custom'
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

export type TextQueryParams = {
  fontSize?: number
  fontColor?: string
  fontBackground?: string
}

type BaseQueryParams = {
  fit?: Fit
  position?: Position
}

export type CatQueryParams = BaseQueryParams & FilterParams & SizeParams & Format & TextQueryParams

export type CatPathParams = {
  text?: string
} & (
  | {
      id?: string
      tag?: undefined
      gif?: undefined
    }
  | {
      id?: undefined
      tag?: string[]
      gif?: boolean
    }
)

export async function cataasFetch(
  catPathParams: CatPathParams = {},
  catQueryParams: CatQueryParams = {}
) {
  // change all catPathParams values to string
  const stringCatQueryParams: { [key: string]: string } = Object.fromEntries(
    Object.entries(catQueryParams)
      .filter(([, value]) => !!value)
      .map(([key, value]) => [key, value?.toString()])
  )

  const queryParams = new URLSearchParams(stringCatQueryParams)

  let url = `${DOMAIN}/${PATH.cat}`

  if (catPathParams.id) {
    url += `/${catPathParams.id}`
  } else if (catPathParams.tag) {
    url += `/${catPathParams.tag.join(',')}`
  }

  if (catPathParams.gif) {
    url += `/${PATH.gif}`
  }

  if (catPathParams.text) {
    url += `/${PATH.says}/${catPathParams.text}`
  }

  if (queryParams.size > 0) {
    url += `?${queryParams.toString()}`
  }

  return await fetch(url)
}

export function useCataasApi(fetchFn?: typeof cataasFetch) {
  const cat = ref<string | null>(null)
  const loading = ref(false)
  const error = ref()

  if (!fetchFn) {
    fetchFn = cataasFetch
  }

  const fetchCat = async (
    options: {
      pathParams?: CatPathParams
      queryParams?: CatQueryParams
    } = {}
  ) => {
    const { pathParams = {}, queryParams = {} } = options

    loading.value = true
    const response = await fetchFn(pathParams, queryParams)
    cat.value = URL.createObjectURL(await response.blob())
    loading.value = false
  }

  return {
    cat,
    fetchCat,
    loading,
    error
  }
}
