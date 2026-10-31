<script setup lang="ts">
import type { Project } from "@portfolio/shared";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ApiError, fetchAdminProjects } from "../../api/client";
import AppIcon from "../../components/AppIcon.vue";

const projects = ref<Project[]>([]);
const loading = ref(true);
const error = ref("");
const router = useRouter();

async function loadProjects(): Promise<void> {
  loading.value = true;
  error.value = "";
  try {
    projects.value = await fetchAdminProjects();
  } catch (caught) {
    if (caught instanceof ApiError && caught.status === 401) {
      await router.replace({ name: "admin-login" });
      return;
    }
    error.value = caught instanceof Error ? caught.message : "无法加载作品。";
  } finally {
    loading.value = false;
  }
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

onMounted(loadProjects);
</script>

<template>
  <main class="admin-main">
    <div class="admin-title-row">
      <div>
        <p class="eyebrow">CONTENT / PROJECTS</p>
        <h1>作品管理</h1>
        <p class="mt-2 text-sm text-white/45">公开页只会展示“已发布”的作品。</p>
      </div>
      <RouterLink :to="{ name: 'admin-project-new' }" class="button button--primary">
        <AppIcon name="plus" :size="17" />
        新增作品
      </RouterLink>
    </div>

    <div v-if="loading" class="admin-state">正在读取作品…</div>
    <div v-else-if="error" class="admin-state admin-state--error" role="alert">
      <p>{{ error }}</p>
      <button type="button" class="button button--outline" @click="loadProjects">
        <AppIcon name="refresh" :size="16" />
        重试
      </button>
    </div>
    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>作品</th>
            <th>状态</th>
            <th>排序</th>
            <th>更新时间</th>
            <th><span class="sr-only">操作</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td>
              <p class="font-medium text-white">{{ project.title }}</p>
              <div class="mt-2 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="admin-mini-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </td>
            <td>
              <span
                :class="[
                  'admin-status',
                  project.published ? 'admin-status--published' : 'admin-status--draft',
                ]"
              >
                {{ project.published ? "已发布" : "草稿" }}
              </span>
              <span v-if="project.featured" class="ml-2 admin-mini-tag">精选</span>
            </td>
            <td class="tabular-nums text-white/55">{{ project.sortOrder }}</td>
            <td class="text-white/45">{{ formatDate(project.updatedAt) }}</td>
            <td>
              <RouterLink
                :to="{ name: 'admin-project-edit', params: { id: project.id } }"
                class="admin-edit-link"
              >
                <AppIcon name="edit" :size="16" />
                编辑
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
