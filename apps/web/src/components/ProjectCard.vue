<script setup lang="ts">
import type { Project } from "@portfolio/shared";
import { computed, ref } from "vue";
import AppIcon from "./AppIcon.vue";

const props = defineProps<{
  project: Project;
}>();

const imageFailed = ref(false);

const initial = computed(() => {
  const cleaned = props.project.title.replace(/^示例\s*·\s*/, "").trim();
  return cleaned.slice(0, 1).toUpperCase() || "P";
});

const hasCover = computed(() => Boolean(props.project.coverUrl) && !imageFailed.value);
const projectUrl = computed(() => {
  if (isHttpUrl(props.project.liveUrl)) return props.project.liveUrl;
  if (isHttpUrl(props.project.repoUrl)) return props.project.repoUrl;
  return null;
});
const opensSource = computed(
  () => !isHttpUrl(props.project.liveUrl) && isHttpUrl(props.project.repoUrl),
);
const tagLabels: Record<string, string> = {
  agent: "AI Agent",
  backend: "Backend",
  frontend: "Frontend",
  fullstack: "Full Stack",
};

function isHttpUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function openProject(): void {
  if (!projectUrl.value) return;
  window.open(projectUrl.value, "_blank", "noopener,noreferrer");
}

function handleCardKeydown(event: KeyboardEvent): void {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  openProject();
}
</script>

<template>
  <article
    class="project-card"
    data-reveal
    :class="{
      'project-card--featured': project.featured,
      'project-card--clickable': projectUrl,
    }"
    :data-accent="project.tags[0] || 'fullstack'"
    :role="projectUrl ? 'link' : undefined"
    :tabindex="projectUrl ? 0 : undefined"
    :aria-label="projectUrl ? `在新标签页打开项目：${project.title}` : undefined"
    @click="openProject"
    @keydown="handleCardKeydown"
  >
    <div class="project-card__cover">
      <img
        v-if="hasCover"
        :src="project.coverUrl!"
        :alt="`${project.title} 项目封面`"
        loading="lazy"
        decoding="async"
        @error="imageFailed = true"
      />
      <div v-else class="project-cover-fallback" aria-hidden="true">
        <span class="project-cover-fallback__orb" />
        <span class="project-cover-fallback__grid" />
        <strong>{{ initial }}</strong>
        <small>PROJECT / {{ String(project.sortOrder).padStart(2, "0") }}</small>
      </div>
      <span v-if="project.featured" class="featured-badge">FEATURED</span>
      <span v-if="projectUrl" class="project-open-mark" aria-hidden="true">
        <AppIcon name="arrow-right" :size="18" />
      </span>
    </div>

    <div class="project-card__body">
      <div class="flex flex-wrap items-center gap-2">
        <span
          v-for="tag in project.tags"
          :key="tag"
          :class="['project-tag', tag === 'agent' ? 'project-tag--agent' : '']"
        >
          {{ tagLabels[tag] || tag }}
        </span>
      </div>

      <h3>{{ project.title }}</h3>
      <p v-if="project.problem" class="project-card__problem">{{ project.problem }}</p>
      <p class="project-card__description">{{ project.description }}</p>

      <dl v-if="project.role || project.outcome" class="project-details">
        <div v-if="project.role">
          <dt>我的角色</dt>
          <dd>{{ project.role }}</dd>
        </div>
        <div v-if="project.outcome">
          <dt>结果</dt>
          <dd>{{ project.outcome }}</dd>
        </div>
      </dl>

      <div class="mt-5 flex flex-wrap gap-2">
        <span v-for="tech in project.techStack" :key="tech" class="tech-pill">
          {{ tech }}
        </span>
      </div>

      <div class="project-card__links">
        <a
          v-if="isHttpUrl(project.liveUrl)"
          :href="project.liveUrl"
          class="project-link"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
          @keydown.stop
        >
          在线访问
          <AppIcon name="external" :size="15" />
        </a>
        <a
          v-if="isHttpUrl(project.repoUrl)"
          :href="project.repoUrl"
          class="project-link"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
          @keydown.stop
        >
          查看源码
          <AppIcon name="github" :size="16" />
        </a>
        <span
          v-if="!isHttpUrl(project.liveUrl) && !isHttpUrl(project.repoUrl)"
          class="internal-badge"
        >
          内部项目 / 链接暂未公开
        </span>
        <span v-else-if="projectUrl" class="project-open-hint">
          {{ opensSource ? "打开源码" : "打开项目" }}
          <AppIcon name="external" :size="14" />
        </span>
      </div>
    </div>
  </article>
</template>
