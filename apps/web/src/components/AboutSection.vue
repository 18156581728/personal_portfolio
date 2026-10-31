<script setup lang="ts">
import { profile } from "../data/profile";
import SectionHeading from "./SectionHeading.vue";
</script>

<template>
  <section id="about" class="content-section" aria-labelledby="about-title">
    <SectionHeading
      index="02"
      eyebrow="ABOUT"
      title="关于我"
      heading-id="about-title"
    />
    <div class="about-grid" data-reveal>
      <div class="about-copy">
        <p v-for="paragraph in profile.about" :key="paragraph">{{ paragraph }}</p>
      </div>
      <aside class="now-card" aria-label="当前状态">
        <span class="now-card__pulse" />
        <p class="text-xs tracking-[0.18em] text-white/35">CURRENTLY</p>
        <p class="mt-3 text-base font-medium text-white">寻找后端 / 全栈机会</p>
        <p class="mt-2 text-sm leading-6 text-white/50">
          关注可落地的 Agent 工作流与工程效率。
        </p>
        <div class="now-card__grid" aria-hidden="true" />
      </aside>
    </div>
  </section>
</template>
