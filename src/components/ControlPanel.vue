<script setup lang="ts">
import type { CataasFetchOptions } from '@/api/cataas-api'
import { useCataasFetch } from '@/api/cataas-api'
import {
  useForm,
  type BaseFieldProps,
  type GenericObject,
  type InputBindsConfig,
  type LazyInputBindsConfig,
  type Path,
  type PathValue,
  type PublicPathState
} from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { ref, watchEffect, type MaybeRefOrGetter, type Ref } from 'vue'
import { z } from 'zod'

const cataasFetchOptions = ref<CataasFetchOptions>({})

const { cat, execute, isFetching: loading, error } = useCataasFetch(cataasFetchOptions).image()

const formSchema = z.object({
  id: z.string().default(''),
  gif: z.boolean().default(false),
  filter: z.union([z.literal('mono'), z.literal('negate'), z.literal('custom')]).optional(),
  blur: z.number().min(0).max(1000).default(0),
  text: z.string().default(''),
  fontColor: z.string().length(7).default('#000000'),
  fontBackground: z.string().length(7).optional(),
  fontSize: z.number().min(1).default(12)
})

const {
  values,
  errors,
  defineField: _defineField,
  handleSubmit
} = useForm({ validationSchema: toTypedSchema(formSchema) })

type TValues = typeof values

const defineField = <
  TPath extends Path<TValues>,
  TValue = PathValue<TValues, TPath>,
  TExtras extends GenericObject = GenericObject
>(
  path: MaybeRefOrGetter<TPath>,
  config?: Partial<InputBindsConfig<TValue, TExtras>> | LazyInputBindsConfig<TValue, TExtras>
) => {
  type RetType = [Ref<TValue>, Ref<BaseFieldProps & TExtras & { 'aria-invalid'?: true }>]

  const configFn = typeof config === 'function' ? config : () => config ?? {}

  return _defineField(path, (state: PublicPathState<TValue>) => {
    const newConfig = configFn(state)
    const { props } = newConfig
    const propsFn = typeof props === 'function' ? props : () => props

    const newProps = propsFn(state) ?? {}

    return {
      ...newConfig,
      props: {
        'aria-invalid': state.errors.length > 0 || undefined,
        ...newProps
      }
    }
  }) as RetType
}

const [catId, catIdProps] = defineField('id')

const [gif, gifProps] = defineField('gif')
const [filter, filterProps] = defineField('filter')

const [blur, blurProps] = defineField('blur')

const [text, textProps] = defineField('text')
const [fontColor, fontColorProps] = defineField('fontColor')
const [fontBackground, fontBackgroundProps] = defineField('fontBackground')
const [fontSize, fontSizeProps] = defineField('fontSize')

watchEffect(() => {
  cataasFetchOptions.value = {
    pathParams: { gif: gif.value, text: text.value || undefined },
    queryParams: {
      filter: filter.value,
      fontColor: fontColor.value,
      fontSize: fontSize.value,
      fontBackground: fontBackground.value,
      blur: blur.value
    }
  }
})

const onSubmit = handleSubmit(async (values) => {
  for (const [key, value] of Object.entries(values)) {
    if (!!value === false) {
      delete values[key as keyof typeof values]
    }
  }

  console.log('submitting', values)
  cataasFetchOptions.value = {
    pathParams: values.id ? { id: values.id } : { gif: values.gif, text: values.text },
    queryParams: {
      filter: values.filter,
      fontColor: values.fontColor,
      fontSize: values.fontSize,
      fontBackground: values.fontBackground,
      blur: values.blur
    }
  }
  await execute()
})
</script>

<template>
  <div class="layout">
    <aside>
      <h2>Control Panel</h2>

      <form @submit="onSubmit">
        <div>
          <label for="id">Cat ID</label>
          <input id="id" type="text" v-model="catId" v-bind="catIdProps" />
          <small>{{ errors.id }}</small>
        </div>

        <div>
          <input
            id="gif"
            type="checkbox"
            role="switch"
            :value="true"
            v-model="gif"
            v-bind="gifProps"
          />
          <label for="gif">Gif?</label>
          <small>{{ errors.gif }}</small>
        </div>

        <div>
          <label for="filter">Filter</label>
          <select id="filter" v-model="filter" v-bind="filterProps">
            <option :value="undefined" selected>No Filter</option>
            <option value="mono">Mono</option>
            <option value="negate">Negate</option>
            <option value="custom">Custom</option>
          </select>
          <small>{{ errors.filter }}</small>
        </div>

        <div>
          <label for="blur">Blur</label>
          <input type="range" id="blur" min="0" max="1000" v-model="blur" v-bind="blurProps" />
          <small>{{ errors.blur }}</small>
        </div>

        <div>
          <label for="text">Text</label>
          <input type="text" id="text" v-model="text" v-bind="textProps" />
          <small>{{ errors.text }}</small>

          <label for="font-size">Font Size</label>
          <input type="number" id="font-size" v-model="fontSize" v-bind="fontSizeProps" />
          <small>{{ errors.fontSize }}</small>

          <label for="text-color">Text Color</label>
          <input type="color" id="text-color" v-model="fontColor" v-bind="fontColorProps" />
          <small>{{ errors.fontColor }}</small>

          <label for="font-background">Font Background</label>
          <input
            type="color"
            id="font-background"
            v-model="fontBackground"
            v-bind="fontBackgroundProps"
          />
          <small>{{ errors.fontBackground }}</small>
        </div>

        <button :aria-busy="loading">
          {{ loading ? 'Loading...' : 'Find Random Cat' }}
        </button>
        <small v-if="error" id="error-message">
          An error occurred while fetching the cat image. Please try again. <br />
          <code>{{ JSON.stringify(error, null, 2) }}</code>
        </small>
      </form>
    </aside>

    <div class="wrapper">
      <img v-if="cat" :src="cat" alt="Random Cat" />
      <progress v-if="loading" />
      <p v-if="!cat && !loading">No cat image available! 🙀</p>
      <div>
        {{ values }}
      </div>
    </div>
  </div>
</template>

<style scoped>
form > * {
  margin: 2em 0;
}

img {
  max-height: 100%;
}

.wrapper {
  height: 600px;
}

.layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: var(--pico-grid-row-gap);
  height: 100%;
}

/* bootstrap small breakpoint */
@media (min-width: 768px) {
  .layout {
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 1fr;
    grid-column-gap: var(--pico-grid-column-gap);
    gap: 0px 20px;
    grid-auto-flow: row;
  }
}
</style>
