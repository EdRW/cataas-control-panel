<script setup lang="ts">
import { useCataasFetch, type CataasFetchOptions } from '@/composables/useCataasFetch'
import { type FavoriteCat, type FavoriteCatId } from '@/composables/useFavorites'
import { computed } from 'vue'

const props = defineProps<{
  favoriteCat: FavoriteCat
}>()

const emit = defineEmits<{
  shareClicked: [value: FavoriteCatId]
  editClicked: [value: FavoriteCatId]
  deleteClicked: [value: FavoriteCatId]
}>()

const cataasFetchOptions = computed<CataasFetchOptions>(() => {
  const { text, queryParams } = props.favoriteCat.customization ?? {}
  return {
    pathParams: {
      id: props.favoriteCat.cataasId,
      text
    },
    queryParams
  }
})

const { cat, isFetching: loading, error } = useCataasFetch(cataasFetchOptions).image()
</script>

<template>
  <article>
    <div class="body text-center">
      <template v-if="loading">
        <div class="progress-wrapper">
          <progress />
          <p class="text-center">😻</p>
        </div>
      </template>
      <img v-if="cat && !loading" :src="cat" alt="Favorite Cat" />
      <p v-if="!cat && !loading">No cat image available! 🙀</p>

      <small v-if="error" id="error-message">
        An error occurred while fetching the cat image. Please try refreshing the page. <br />
        <code>{{ JSON.stringify(error, null, 2) }}</code>
      </small>
    </div>
    <footer class="grid">
      <!-- <button @click="() => emit('shareClicked', favoriteCat.id)">Share</button>
      <button @click="() => emit('editClicked', favoriteCat.id)">Edit</button> -->
      <button class="outline secondary" @click="() => emit('deleteClicked', favoriteCat.id)">
        Delete
      </button>
    </footer>
  </article>
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

article {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 2;
}
</style>
