<script setup lang="ts">
import { cataasFetch, useCataasApi, type CatQueryParams } from '@/api/cataas-api'
import { onMounted, ref } from 'vue'

const catFetchFn = import.meta.env.DEV ? loadCatImageFromFile : cataasFetch
const { cat, fetchCat, loading, error } = useCataasApi()

const catId = ref('')

const gif = ref(false)
const filter = ref<CatQueryParams['filter']>()

const blur = ref(0)

const text = ref('')
const fontColor = ref('#000000')
const fontBackground = ref()
const fontSize = ref<number>()

async function loadCatImageFromFile() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return await fetch('src/assets/cat.jpeg')
}

const getCat = async () => {
  fetchCat({
    pathParams: { gif: gif.value, text: text.value || undefined },
    queryParams: {
      filter: filter.value,
      fontColor: fontColor.value,
      fontSize: fontSize.value,
      fontBackground: fontBackground.value,
      blur: blur.value
    }
  })
}

onMounted(getCat)
</script>

<template>
  <div class="layout">
    <aside>
      <h2>Control Panel</h2>

      <form @submit.prevent="getCat">
        <div>
          <input type="radio" id="static" :value="false" v-model="gif" />
          <label for="static">Static</label>

          <input type="radio" id="gif" :value="true" v-model="gif" />
          <label for="gif">Gif</label>
        </div>

        <fieldset>
          <input type="radio" id="no-filter" :value="undefined" v-model="filter" />
          <label for="no-filter">No Filter</label>

          <input type="radio" id="mono-filter" value="mono" v-model="filter" />
          <label for="mono-filter">Mono</label>

          <input type="radio" id="negate-filter" value="negate" v-model="filter" />
          <label for="negate-filter">Negate</label>

          <input type="radio" id="custom-filter" value="custom" v-model="filter" />
          <label for="custom-filter">Custom</label>
        </fieldset>

        <div>
          <label for="blur">Blur</label>
          <input type="range" id="blur" min="0" max="10" v-model="blur" />
        </div>

        <div>
          <label for="text">Text</label>
          <input type="text" id="text" v-model="text" />

          <label for="font-size">Font Size</label>
          <input type="number" id="font-size" v-model="fontSize" />

          <label for="text-color">Text Color</label>
          <input type="color" id="text-color" v-model="fontColor" />

          <label for="font-background">Font Background</label>
          <input type="color" id="font-background" v-model="fontBackground" />
        </div>

        <button :aria-busy="loading">
          {{ loading ? 'Loading...' : 'Find Random Cat' }}
        </button>
      </form>
    </aside>

    <div class="wrapper">
      <img v-if="cat" :src="cat" alt="Random Cat" />
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
