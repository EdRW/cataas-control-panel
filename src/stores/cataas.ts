import { defineStore } from 'pinia'
import { ref, toValue, type MaybeRefOrGetter } from 'vue'

export const useCataasStore = defineStore('counter', () => {
  const cat = ref<string>()
  const loading = ref(false)

  function getCat() {}

  return { cat, loading, increment }
})

async function fetchRandomCat(catId: MaybeRefOrGetter<string>) {
  const catIdValue = toValue(catId)
  const baseUrl = 'https://cataas.com/cat'
  const url = catIdValue ? `${baseUrl}/${catIdValue}` : baseUrl
  return await fetch(url)
}

async function loadCatImageFromFile() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return await fetch('src/assets/cat.jpeg')
}
