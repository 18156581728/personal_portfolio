<script setup lang="ts">
import { RouterLink } from "vue-router";
import AppIcon from "./AppIcon.vue";
</script>

<template>
  <footer class="site-footer">
    <p>Vue 3 · TypeScript · Tailwind CSS · Node.js</p>
    <p>© {{ new Date().getFullYear() }} · Designed &amp; built with care.</p>
    <RouterLink to="/" class="inline-flex items-center gap-2 hover:text-white">
      回到顶部
      <AppIcon name="arrow-up" :size="15" />
    </RouterLink>
  </footer>
</template>
