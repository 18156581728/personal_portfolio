<script setup lang="ts">
import { RouterLink } from "vue-router";
import { profile } from "../data/profile";
import AppIcon from "./AppIcon.vue";

defineProps<{
  menuOpen: boolean;
}>();

defineEmits<{
  openMenu: [];
}>();
</script>

<template>
  <header class="mobile-header lg:hidden">
    <RouterLink to="/" class="brand-mark" aria-label="返回首页">
      {{ profile.englishName }}
    </RouterLink>
    <div class="flex items-center gap-2">
      <a
        v-if="profile.resumeUrl"
        :href="profile.resumeUrl"
        class="compact-resume"
        target="_blank"
        rel="noopener noreferrer"
      >
        简历
      </a>
      <button
        type="button"
        class="menu-button"
        aria-label="打开导航菜单"
        aria-controls="mobile-navigation"
        :aria-expanded="menuOpen"
        @click="$emit('openMenu')"
      >
        <AppIcon name="menu" :size="22" />
      </button>
    </div>
  </header>
</template>
