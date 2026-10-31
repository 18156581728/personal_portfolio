<script setup lang="ts">
import { skillGroups } from "../data/skills";
import SectionHeading from "./SectionHeading.vue";
</script>

<template>
  <section id="skills" class="content-section" aria-labelledby="skills-title">
    <SectionHeading
      index="03"
      eyebrow="TOOLKIT"
      title="技能与工具"
      heading-id="skills-title"
    />
    <div class="skills-grid">
      <article
        v-for="(group, index) in skillGroups"
        :key="group.id"
        class="skill-card"
        data-reveal
        :style="{ '--reveal-delay': `${index * 70}ms` }"
      >
        <div class="flex items-center justify-between">
          <h3>{{ group.title }}</h3>
          <span class="skill-card__number">0{{ index + 1 }}</span>
        </div>
        <div class="mt-5 flex flex-wrap gap-2">
          <span v-for="skill in group.items" :key="skill" class="tech-pill">
            {{ skill }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>
