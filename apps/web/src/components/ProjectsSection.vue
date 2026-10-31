<script setup lang="ts">
import type { Project } from "@portfolio/shared";
import { computed, onMounted, ref } from "vue";
import { fetchPublishedProjects } from "../api/client";
import ProjectCard from "./ProjectCard.vue";
import SectionHeading from "./SectionHeading.vue";

const emit = defineEmits<{
  loaded: [];
}>();

const projects = ref<Project[]>([]);
const loading = ref(true);
const error = ref("");
const featuredCount = computed(
  () => projects.value.filter((project) => project.featured).length,
);

async function loadProjects(): Promise<void> {
  loading.value = true;
  error.value = "";
  try {
    projects.value = await fetchPublishedProjects();
  } catch {
    error.value = "项目暂时无法加载，请稍后重试。";
  } finally {
    loading.value = false;
    emit("loaded");
  }
}

onMounted(loadProjects);
</script>

<template>
  <section id="projects" class="content-section" aria-labelledby="projects-title">
    <SectionHeading
      index="01"
      eyebrow="SELECTED WORK"
      title="精选项目"
      heading-id="projects-title"
    />
    <div class="project-intro-row">
      <p class="section-intro">
        先看最能说明能力的工作。点击卡片会打开对应项目，源码与线上演示仍可分别访问。
      </p>
      <div v-if="!loading && !error" class="project-overview" aria-label="项目概览">
        <span class="project-overview__signal" />
        <strong>{{ featuredCount }}</strong>
        <span>FEATURED</span>
        <i />
        <span>{{ projects.length }} TOTAL</span>
      </div>
    </div>

    <div v-if="loading" class="project-loading" aria-live="polite">
      <span />
      <span />
      正在载入项目…
    </div>

    <div v-else-if="error" class="empty-state" role="alert">
      <p>{{ error }}</p>
      <button type="button" class="button button--outline" @click="loadProjects">
        重新加载
      </button>
    </div>

    <div v-else-if="projects.length" class="project-list">
      <ProjectCard
        v-for="(project, index) in projects"
        :key="project.id"
        :project="project"
        :class="{ 'project-card--lead': project.featured && index === 0 }"
      />
    </div>

    <div v-else class="empty-state">
      <p>还没有已发布的项目。</p>
      <p class="text-sm text-white/40">请从管理端新增并发布作品。</p>
    </div>
  </section>
</template>
