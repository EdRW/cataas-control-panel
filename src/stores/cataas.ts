import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCataasStore = defineStore('counter', () => {
  const cat = ref<string>()
  const loading = ref(false)

  return { cat, loading }
})
