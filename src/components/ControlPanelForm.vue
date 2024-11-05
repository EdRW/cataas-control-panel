<script setup lang="ts">
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
import { watchEffect, type MaybeRefOrGetter, type Ref } from 'vue'
import { z } from 'zod'

const props = defineProps<{
  loading: boolean
  tags?: string[]
  id?: string
}>()

export type FormSubmitEvent = Partial<FormSchema>
const emit = defineEmits<{
  submit: [values: FormSubmitEvent]
}>()

const maxBlur = 50

const formSchema = z.object({
  id: z.string().default(''),
  gif: z.boolean().default(false),
  filter: z.union([z.literal('mono'), z.literal('negate'), z.literal('custom')]).optional(),
  blur: z.coerce.number().min(0).max(maxBlur).default(0),
  text: z.string().default(''),
  fontColor: z.string().length(7).default('#000000'),
  fontBackground: z.string().length(7).optional(),
  fontSize: z.number().min(1).default(12)
})

type FormSchema = z.infer<typeof formSchema>

const {
  values,
  errors,
  defineField: _defineField,
  handleSubmit,
  isSubmitting,
  setFieldValue
} = useForm({ validationSchema: toTypedSchema(formSchema) })

watchEffect(() => {
  if (props.id) {
    setFieldValue('id', props.id)
  }
})

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

// This could be generalized as filterObjectProperties using a predicate
function removeEmptyValues<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => !!v)) as Partial<T>
}

const onSubmit = handleSubmit(async (allValues) => {
  const values = removeEmptyValues(allValues)
  console.log('submitting', values)
  emit('submit', values)
})
</script>

<template>
  <form @submit="onSubmit" class="layout">
    <aside>
      <h2>Control Panel</h2>
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
        <input type="range" id="blur" min="0" :max="maxBlur" v-model="blur" v-bind="blurProps" />
        <small>{{ errors.blur }}</small>
      </div>
    </aside>

    <slot></slot>

    <aside>
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

      <button :aria-busy="loading || isSubmitting">
        {{ loading || isSubmitting ? 'Loading...' : 'Find Random Cat' }}
      </button>
    </aside>
  </form>
</template>

<style scoped>
form > * {
  margin: 2em 0;
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
    grid-template-columns: 1fr 3fr 1fr;
    grid-template-rows: 1fr;
    grid-column-gap: var(--pico-grid-column-gap);
    gap: 0px 20px;
    grid-auto-flow: row;
  }
}
</style>
