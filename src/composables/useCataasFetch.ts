import { useFetch, type UseFetchOptions, type UseFetchReturn } from '@vueuse/core'
import type { Nullable } from 'vitest'
import { computed, ref, toValue, watch, watchEffect, type MaybeRefOrGetter } from 'vue'
import { z } from 'zod'

const DOMAIN = 'https://cataas.com'
const PATH = {
  cat: 'cat',
  gif: 'gif',
  says: 'says',
  api: 'api',
  tags: 'tags'
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

type SizeParams = {
  type?: Type
  width?: number
  height?: number
}

type Format = {
  html?: boolean
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

export type CataasFetchOptions = {
  pathParams?: CatPathParams
  queryParams?: CatQueryParams
}

function constructUrl(options: CataasFetchOptions): string {
  const { pathParams = {}, queryParams: optionsQueryParams = {} } = options

  // change all catPathParams values to string
  const stringCatQueryParams: { [key: string]: string } = Object.fromEntries(
    Object.entries(optionsQueryParams)
      .filter(([, value]) => !!value)
      .map(([key, value]) => [key, value?.toString()])
  )

  const queryParams = new URLSearchParams(stringCatQueryParams)

  let url = `${DOMAIN}/${PATH.cat}`

  if (pathParams.id) {
    url += `/${pathParams.id}`
  } else if (pathParams.tag && pathParams.tag.length > 0) {
    url += `/${pathParams.tag.join(',')}`
  }

  if (pathParams.gif) {
    url += `/${PATH.gif}`
  }

  if (pathParams.text) {
    url += `/${PATH.says}/${pathParams.text}`
  }

  if (queryParams.size > 0) {
    url += `?${queryParams.toString()}`
  }

  return url
}

const CataasJsonResponse = z.object({
  _id: z.string(),
  mimetype: z.string(),
  size: z.number().nullable(),
  tags: z.array(z.string()),
  createdAt: z.string().datetime(),
  editedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
})

export type CataasJsonResponse = z.infer<typeof CataasJsonResponse>

export function useCataasFetch(
  options: MaybeRefOrGetter<CataasFetchOptions> = {},
  configs: UseFetchOptions = {}
) {
  const url = computed(() => constructUrl(toValue(options)))
  const baseFetch = useFetch(url, configs).get()

  type ResponseData<T> = { data: T | null; opts: CataasFetchOptions; contentType: Nullable<string> }

  function wrapFetch<T, Cat>(
    fetch: UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>,
    fn: (resp: ResponseData<T>) => Cat
  ) {
    const cat = ref<Cat | null>(null)

    watch(fetch.data, (data) => {
      const opts = toValue(options)

      const contentType = fetch.response.value?.headers.get('content-type')

      cat.value = fn({ data, opts, contentType })
    })
    return {
      ...fetch,
      cat
    }
  }

  function getJson() {
    const jsonFetch = baseFetch.json()

    return wrapFetch(jsonFetch, ({ data, opts, contentType }) => {
      const isJsonContent = contentType?.includes('application/json')

      if (!(opts.queryParams?.json === true && isJsonContent)) {
        jsonFetch.error.value = new Error(`Invalid content type: ${contentType}, expected json`)
      }

      const result = CataasJsonResponse.safeParse(data)
      if (!result.success) {
        jsonFetch.error.value = result.error
        console.error(result.error.toString(), data)
      }

      return result.data ?? null
    })
  }

  function getHtml() {
    const htmlFetch = baseFetch.text()

    return wrapFetch(htmlFetch, ({ data, opts, contentType }) => {
      const isHTMLContent = contentType?.includes('html')

      if (!opts.queryParams?.html && isHTMLContent) {
        htmlFetch.error.value = new Error(`Invalid content type: ${contentType}, expected html`)
      }

      return data
    })
  }

  function getBlob() {
    const blobFetch = baseFetch.blob()

    return wrapFetch(blobFetch, ({ data, opts, contentType }) => {
      const isImageContent = contentType?.includes('image')

      if (opts.queryParams?.html || opts.queryParams?.json) {
        blobFetch.error.value = new Error(
          'html and json query parameters are not supported for fetching images'
        )
      } else if (!isImageContent || !(data instanceof Blob)) {
        blobFetch.error.value = new Error(`Invalid content type: ${contentType}, expected image`)
      }

      return data
    })
  }

  function getImage() {
    const cat = ref<string | null>(null)
    const blobFetch = getBlob()

    watchEffect(() => {
      if (blobFetch.cat.value) {
        cat.value = URL.createObjectURL(blobFetch.cat.value)
      }
    })

    return {
      ...blobFetch,
      cat
    }
  }

  return {
    ...baseFetch,
    json() {
      return getJson()
    },
    html() {
      return getHtml()
    },
    blob() {
      return getBlob()
    },
    image() {
      return getImage()
    }
  }
}

export function useCataasTags(configs: UseFetchOptions = {}) {
  const url = [DOMAIN, PATH.api, PATH.tags].join('/')

  const { data, ...rest } = useFetch(url, configs).get().json()

  // TODO: properly handle error
  const tags = computed(() => {
    const tags = z.array(z.string()).safeParse(data.value)?.data ?? []
    return tags.filter((tag) => tag !== '' && tag.length > 1)
  })

  return {
    tags,
    ...rest
  }
}
