<script setup lang="ts">
import { experiences } from "../data/experience";
import { profile } from "../data/profile";
import AppIcon from "./AppIcon.vue";
import SectionHeading from "./SectionHeading.vue";
</script>

<template>
  <section id="experience" class="content-section" aria-labelledby="experience-title">
    <SectionHeading
      index="04"
      eyebrow="EXPERIENCE"
      title="工作经历"
      heading-id="experience-title"
    />

    <div class="experience-list">
      <component
        :is="experience.companyUrl ? 'a' : 'article'"
        v-for="experience in experiences"
        :key="experience.id"
        class="experience-item"
        data-reveal
        :href="experience.companyUrl"
        :target="experience.companyUrl ? '_blank' : undefined"
        :rel="experience.companyUrl ? 'noopener noreferrer' : undefined"
      >
        <p class="experience-item__date">
          {{ experience.start }} — {{ experience.end }}
        </p>
        <div>
          <h3>
            {{ experience.title }}
            <span class="text-white/35">·</span>
            <span class="experience-item__company">{{ experience.company }}</span>
            <AppIcon
              v-if="experience.companyUrl"
              name="external"
              :size="15"
              class="ml-1 inline text-white/30"
            />
          </h3>
          <p class="experience-item__summary">{{ experience.summary }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="tech in experience.techStack" :key="tech" class="tech-pill">
              {{ tech }}
            </span>
          </div>
        </div>
      </component>
    </div>

    <a
      v-if="profile.resumeUrl"
      :href="profile.resumeUrl"
      class="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
      target="_blank"
      rel="noopener noreferrer"
    >
      查看完整简历
      <AppIcon name="arrow-right" :size="17" />
    </a>
  </section>
</template>
