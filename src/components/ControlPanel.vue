<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const cat = ref<string>()
const catId = ref('')
const loading = ref(false)

async function fetchRandomCat() {
  const baseUrl = 'https://cataas.com/cat'
  const url = catId.value ? `${baseUrl}/${catId.value}` : baseUrl
  return await fetch(url)
}

async function loadCatImageFromFile() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return await fetch('src/assets/cat.jpeg')
}

const getCat = async () => {
  const catFetchFn = import.meta.env.DEV ? loadCatImageFromFile : fetchRandomCat
  loading.value = true
  const response = await catFetchFn()
  cat.value = URL.createObjectURL(await response.blob())
  loading.value = false
}

watchEffect(getCat)
</script>

<template>
  <div class="layout">
    <aside>
      <h2>Control Panel</h2>
      <button @click="fetchRandomCat" :aria-busy="loading">
        {{ loading ? 'Loading...' : 'Find Random Cat' }}
      </button>
    </aside>

    <div class="wrapper">
      <img v-if="cat" :src="cat" alt="Random Cat" />
    </div>
  </div>
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
