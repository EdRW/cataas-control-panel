<script setup lang="ts">
import { useCataasFetch, type CataasFetchOptions } from '@/composables/cataas-api'
import { computed, ref, watch } from 'vue'
import ControlPanelForm, { type FormSubmitEvent } from './ControlPanelForm.vue'

const jsonFetchOptions = ref<CataasFetchOptions>({ queryParams: { json: true } })
const cataasFetchOptions = ref<CataasFetchOptions>({})

const {
  cat: catJson,
  execute: executeJson,
  isFetching: loadingJson,
  error: errorJson
} = useCataasFetch(jsonFetchOptions).json()

const {
  cat,
  execute,
  isFetching: loadingImg,
  error: errorImg
} = useCataasFetch(cataasFetchOptions, { immediate: false }).image()

const loading = computed(() => loadingJson.value || loadingImg.value)
const error = computed(() => errorJson.value || errorImg.value)

watch(catJson, async (cat) => {
  if (cat) {
    console.log('Cat JSON:', cat)
    const { queryParams = {} } = jsonFetchOptions.value
    const { json, ...rest } = queryParams

    cataasFetchOptions.value = {
      pathParams: { id: cat._id },
      queryParams: {
        ...rest
      }
    }
    await execute()
    return
  }
})

const onSubmit = async (values: FormSubmitEvent) => {
  jsonFetchOptions.value = {
    pathParams: {
      text: values.text,
      ...(values.id ? { id: values.id } : { gif: values.gif, tag: [] })
    },
    queryParams: {
      filter: values.filter,
      fontColor: values.fontColor,
      fontSize: values.fontSize,
      fontBackground: values.fontBackground,
      blur: values.blur,
      json: true
    }
  }
  await executeJson()
}
</script>

<template>
  <ControlPanelForm
    @random-clicked="onSubmit"
    @modify-clicked="onSubmit"
    :loading
    :id="catJson?._id"
    :tags="catJson?.tags"
  >
    <template v-if="loading">
      <div class="progress-wrapper">
        <progress />
        <p class="text-center">😻</p>
      </div>
    </template>
    <img v-if="cat && !loading" :src="cat" alt="Random Cat" />
    <p v-if="!cat && !loading">No cat image available! 🙀</p>
  </ControlPanelForm>

  <small v-if="error" id="error-message">
    An error occurred while fetching the cat image. Please try again. <br />
    <code>{{ JSON.stringify(error, null, 2) }}</code>
  </small>
</template>

<style scoped>
.progress-wrapper {
  width: 100%;
}

img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 10px;
}
</style>
