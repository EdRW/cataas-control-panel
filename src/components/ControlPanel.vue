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
  <div class="layout">
    <aside>
      <h2>Control Panel</h2>

      <ControlPanelForm @submit="onSubmit" :loading />
    </aside>

    <div class="wrapper">
      <img v-if="cat" :src="cat" alt="Random Cat" />
      <progress v-if="loading" />
      <p v-if="!cat && !loading">No cat image available! 🙀</p>
    </div>
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
