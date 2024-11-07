<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="container text-center">
      <hgroup>
        <h1>CataaS Control Panel 😸</h1>
        <p>
          A frontend for the
          <a href="https://cataas.com" target="_blank" rel="noopener noreferrer"
            >Cat as a Service</a
          >
          REST API
        </p>
      </hgroup>
      <nav>
        <ul>
          <li><RouterLink to="/">Controls</RouterLink></li>
          <li><RouterLink to="/favorites">Favorites</RouterLink></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
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
  overflow: hidden;
}

h1 {
  padding-top: var(--pico-spacing);
}

@media (min-width: 768px) {
  hgroup {
    margin-bottom: calc(var(--pico-spacing) * -1.5);
  }
}
</style>
