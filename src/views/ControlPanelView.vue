<script setup lang="ts">
import ControlPanel from '../components/ControlPanel.vue'
</script>

<template>
  <div class="scrollable-container">
    <ControlPanel />
  </div>
</template>

<style scoped>
.scrollable-container {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}

@media (min-width: 768px) {
  .scrollable-container {
    overflow: hidden;
  }
}
</style>
