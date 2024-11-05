<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="container">
      <h1 class="text-center">CataaS Control Panel</h1>
      <nav>
        <ul>
          <li><RouterLink to="/">Controls</RouterLink></li>
          <li><RouterLink to="/favorites">Favorites</RouterLink></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <RouterView />
  </main>

  <footer class="container">
    <div class="text-center">
      <small> Copyright &copy; 2024 - Edmund Rosewright. All rights reserved. </small>
    </div>
  </footer>
</template>

<style scoped>
main {
  border: 1px solid var(--pico-primary-border);
  border-radius: 12px;
  padding: calc(var(--pico-spacing) * 2);
  scrollbar-width: thin;
}

/* bootstrap small breakpoint */
@media (min-width: 768px) {
  main {
    overflow: hidden;
  }
}

h1 {
  padding-top: var(--pico-spacing);
}
</style>
