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
  modifyClicked: [values: FormSubmitEvent]
  randomClicked: [values: FormSubmitEvent]
  saveClicked: [values: FormSubmitEvent]
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
  setFieldValue,
  meta,
  resetForm
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

type FormAction = 'random' | 'save' | 'modify'
const onSubmit = async (action: FormAction) => {
  const onSubmitHandler = handleSubmit((allValues) => {
    const values = removeEmptyValues(allValues)

    if (action === 'random') {
      if (values.id) {
        delete values.id
      }
      console.log('random', values)
      resetForm({
        touched: {},
        values: allValues
      })
      emit('randomClicked', values)
      return
    }

    if (action === 'modify') {
      console.log('submitting', values)
      resetForm({
        touched: {},
        values: allValues
      })
      emit('modifyClicked', values)
      return
    }

    if (action === 'save') {
      console.log('saving', values)
      emit('saveClicked', values)
      return
    }
  })

  await onSubmitHandler()
}
</script>

<template>
  <form class="layout">
    <div class="img-slot-wrapper">
      <slot></slot>
    </div>
    <div class="form-controls-1">
      <div class="grid">
        <div>
          <label for="id">Cat ID</label>
          <input id="id" type="text" v-model="catId" v-bind="catIdProps" />
          <small>{{ errors.id }}</small>
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
      </div>
      <div class="grid">
        <div>
          <label for="gif">Gif?</label>
          <input
            id="gif"
            type="checkbox"
            role="switch"
            :value="true"
            v-model="gif"
            v-bind="gifProps"
          />
          <small>{{ errors.gif }}</small>
        </div>
        <div>
          <label for="blur">Blur</label>
          <input type="range" id="blur" min="0" :max="maxBlur" v-model="blur" v-bind="blurProps" />
          <small>{{ errors.blur }}</small>
        </div>
      </div>
    </div>
    <div class="form-controls-2">
      <div>
        <label for="text">Text</label>
        <input type="text" id="text" v-model="text" v-bind="textProps" />
        <small>{{ errors.text }}</small>

        <fieldset class="grid">
          <div>
            <label for="font-size">Size</label>
            <input
              type="number"
              id="font-size"
              class="size-picker"
              v-model="fontSize"
              v-bind="fontSizeProps"
            />
            <small>{{ errors.fontSize }}</small>
          </div>
          <div>
            <label for="text-color">Color</label>
            <input
              type="color"
              id="text-color"
              class="color-picker"
              v-model="fontColor"
              v-bind="fontColorProps"
            />
            <small>{{ errors.fontColor }}</small>
          </div>

          <div>
            <label for="font-background" class="no-wrap">BG Color</label>
            <input
              type="color"
              id="font-background"
              class="color-picker"
              v-model="fontBackground"
              v-bind="fontBackgroundProps"
            />
            <small>{{ errors.fontBackground }}</small>
          </div>
        </fieldset>
      </div>
    </div>
    <div class="form-controls-3">
      <button :aria-busy="loading || isSubmitting" type="button" @click="onSubmit('random')">
        {{ loading || isSubmitting ? 'Loading...' : 'New Random Cat' }}
      </button>
      <button
        :aria-busy="loading || isSubmitting"
        type="button"
        :disabled="!meta.touched"
        @click="onSubmit('modify')"
      >
        {{ loading || isSubmitting ? 'Loading...' : 'Modify Current Cat' }}
      </button>
      <button :aria-busy="loading || isSubmitting" type="button" @click="onSubmit('save')">
        {{ loading || isSubmitting ? 'Loading...' : 'Save Cat' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
form {
  --square-input-width: calc(
    1rem * var(--pico-line-height) + var(--pico-form-element-spacing-vertical) * 2 +
      var(--pico-border-width) * 2
  );
}

form > * {
  margin: 1em 0;
}

.layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: var(--pico-grid-row-gap);
  height: 100%;
  width: 100%;
}

form button[type='button'] {
  width: 100%;
}

/* bootstrap small breakpoint */
@media (min-width: 768px) {
  .layout {
    grid-column-gap: var(--pico-grid-column-gap);
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 3fr 1fr;
    grid-auto-flow: row;
    grid-template-areas:
      'cat-image form-controls-2'
      'form-controls-1 form-controls-3';
  }

  .img-slot-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    grid-area: cat-image;
    contain: size;
  }

  .form-controls-1 {
    grid-area: form-controls-1;
  }

  .form-controls-2 {
    grid-area: form-controls-2;
  }

  .form-controls-3 {
    grid-area: form-controls-3;
  }

  .size-picker {
    width: var(--square-input-width);
    padding-right: 0;
  }

  .color-picker {
    padding: var(--pico-form-element-spacing-vertical);
    width: var(--square-input-width);
  }
}
</style>
