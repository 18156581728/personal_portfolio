<script setup lang="ts">
import { RouterLink } from "vue-router";
import { profile } from "../data/profile";
import AppIcon from "./AppIcon.vue";

defineProps<{
  compact?: boolean;
}>();
</script>

<template>
  <div :class="compact ? 'identity identity--compact' : 'identity'">
    <p class="eyebrow">
      <span class="eyebrow__dot" />
      {{ profile.englishName }} / PORTFOLIO
    </p>

    <div class="mt-5">
      <h1 class="hero-name">{{ profile.name }}</h1>
      <h2 class="hero-role">{{ profile.role }}</h2>
    </div>

    <p class="hero-headline">{{ profile.headline }}</p>

    <div class="mt-6 flex flex-wrap gap-2" aria-label="个人信息标签">
      <span v-for="tag in profile.tags" :key="tag" class="status-pill">
        {{ tag }}
      </span>
      <span class="status-pill status-pill--location">{{ profile.location }}</span>
    </div>

    <div class="mt-8 flex flex-wrap items-center gap-3">
      <RouterLink to="/projects" class="button button--primary">
        查看项目
        <AppIcon name="arrow-right" :size="17" />
      </RouterLink>
      <a
        v-if="profile.resumeUrl"
        :href="profile.resumeUrl"
        class="button button--outline"
        target="_blank"
        rel="noopener noreferrer"
      >
        下载简历
      </a>
    </div>

    <div class="mt-8 flex items-center gap-3" aria-label="社交链接">
      <a
        v-for="social in profile.socials"
        :key="social.label"
        :href="social.href"
        class="icon-link"
        :aria-label="social.label"
        :target="social.href.startsWith('mailto:') ? undefined : '_blank'"
        :rel="social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'"
      >
        <AppIcon :name="social.icon" :size="19" />
      </a>
      <span class="ml-1 h-px w-14 bg-white/15" aria-hidden="true" />
      <span class="text-xs tracking-[0.16em] text-white/35">OPEN TO WORK</span>
    </div>
  </div>
</template>
