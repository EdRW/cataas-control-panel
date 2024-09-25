<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1>CataaS Control Panel</h1>
    <nav>
      <RouterLink to="/">Controls</RouterLink>
      <RouterLink to="/favorites">Favorites</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
