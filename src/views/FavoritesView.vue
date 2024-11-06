<script setup lang="ts">
import FavoritesList from '@/components/FavoritesList.vue'
</script>

<template>
  <div class="scrollable-container">
    <FavoritesList />
  </div>
</template>

<style scoped>
.scrollable-container {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}
</style>
