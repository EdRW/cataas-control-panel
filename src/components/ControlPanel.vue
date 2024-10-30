<script setup lang="ts">
import type { CataasFetchOptions } from '@/api/cataas-api'
import { useCataasFetch } from '@/api/cataas-api'
import { ref } from 'vue'
import ControlPanelForm, { type FormSubmitEvent } from './ControlPanelForm.vue'

const cataasFetchOptions = ref<CataasFetchOptions>({})

const { cat, execute, isFetching: loading, error } = useCataasFetch(cataasFetchOptions).image()

const onSubmit = async (values: FormSubmitEvent) => {
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
}
</script>

<template>
  <div>
    <ControlPanelForm @submit="onSubmit" :loading>
      <div class="wrapper">
        <template v-if="loading">
          <progress />
          <p class="text-center">😻</p>
        </template>
        <img v-if="cat" :src="cat" alt="Random Cat" />
        <p v-if="!cat && !loading">No cat image available! 🙀</p>
      </div>
    </ControlPanelForm>
  </div>

  <small v-if="error" id="error-message">
    An error occurred while fetching the cat image. Please try again. <br />
    <code>{{ JSON.stringify(error, null, 2) }}</code>
  </small>
</template>

<style scoped>
img {
  max-height: 100%;
}

.wrapper {
  height: 600px;
}
</style>
