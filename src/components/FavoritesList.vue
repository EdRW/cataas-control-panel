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
  <div v-if="favorites.length === 0" class="empty-list-container">
    <h3>No saved cats yet! 😿</h3>
  </div>
  <div v-else class="grid favorites-grid">
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

.empty-list-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
