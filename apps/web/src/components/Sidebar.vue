<script setup lang="ts">
import { RouterLink } from "vue-router";
import { navigationItems } from "../data/navigation";
import { profile } from "../data/profile";
import AppIcon from "./AppIcon.vue";
import IdentityBlock from "./IdentityBlock.vue";

defineProps<{
  activeSection: string;
}>();

defineEmits<{
  navigate: [id: string];
}>();
</script>

<template>
  <aside class="sidebar hidden lg:flex" aria-label="个人信息与站内导航">
    <RouterLink to="/" class="brand-mark" aria-label="返回首页">
      {{ profile.englishName }}
    </RouterLink>

    <IdentityBlock />

    <nav class="desktop-nav" aria-label="主导航">
      <a
        v-for="item in navigationItems"
        :key="item.id"
        :href="item.href"
        :class="[
          'desktop-nav__item',
          { 'desktop-nav__item--active': activeSection === item.id },
        ]"
        :aria-current="activeSection === item.id ? 'location' : undefined"
        @click.prevent="$emit('navigate', item.id)"
      >
        <span class="desktop-nav__index">{{ item.index }}</span>
        <span class="desktop-nav__line" />
        <span>{{ item.label }}</span>
      </a>
    </nav>

    <a
      v-if="profile.resumeUrl"
      :href="profile.resumeUrl"
      class="sidebar-resume"
      target="_blank"
      rel="noopener noreferrer"
    >
      完整简历
      <AppIcon name="external" :size="15" />
    </a>
  </aside>
</template>
