<script setup lang="ts">
import { useFavorites, type FavoriteCatId } from '@/composables/useFavorites'
import { ref } from 'vue'
import FavoritesListCard from './FavoritesListCard.vue'

const { favorites, removeFavorite } = useFavorites()
const deleting = ref(false)

const handleDelete = (id: FavoriteCatId) => {
  deleting.value = true
  console.log('Deleting saved cat:', id)

  removeFavorite(id)

  console.log('Favorite deleted:', id)
  deleting.value = false
}

const handleShare = (id: FavoriteCatId) => {
  console.log('Sharing saved cat:', id)
}

const handleEdit = (id: FavoriteCatId) => {
  console.log('Editing saved cat:', id)
}
</script>

<template>
  <div class="grid favorites-grid">
    <template v-for="favorite in favorites" :key="favorite.id">
      <FavoritesListCard
        :favoriteCat="favorite"
        @shareClicked="handleShare"
        @editClicked="handleEdit"
        @deleteClicked="handleDelete"
      />
    </template>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fit, minmax(406px, 1fr));
  }
}
</style>
