<script setup lang="ts">
import { RouterLink } from "vue-router";
import { profile } from "../data/profile";
import AppIcon from "./AppIcon.vue";
import SectionHeading from "./SectionHeading.vue";
</script>

<template>
  <section id="contact" class="content-section contact-section" aria-labelledby="contact-title">
    <SectionHeading
      index="05"
      eyebrow="CONTACT"
      title="接下来聊聊？"
      heading-id="contact-title"
    />
    <div class="contact-panel" data-reveal>
      <div class="contact-panel__aurora" aria-hidden="true" />
      <p class="relative text-lg leading-8 text-white/60">
        对后端、全栈或 Agent 相关机会感兴趣，欢迎直接发邮件。也可以先看看
        <RouterLink to="/projects" class="text-link">这些项目</RouterLink>。
      </p>
      <div class="relative mt-8 flex flex-wrap items-center gap-3">
        <a :href="`mailto:${profile.email}`" class="button button--primary">
          <AppIcon name="mail" :size="17" />
          发邮件
        </a>
        <a
          v-for="social in profile.socials.filter((item) => item.icon !== 'mail')"
          :key="social.label"
          :href="social.href"
          class="button button--outline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AppIcon :name="social.icon" :size="17" />
          {{ social.label }}
        </a>
      </div>
      <p class="relative mt-8 text-sm text-white/55">{{ profile.email }}</p>
    </div>
  </section>
</template>
