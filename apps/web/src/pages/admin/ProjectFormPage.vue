<script setup lang="ts">
import type { ProjectInput, ProjectTag } from "@portfolio/shared";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ApiError,
  createProject,
  fetchProject,
  updateProject,
} from "../../api/client";
import AppIcon from "../../components/AppIcon.vue";

const route = useRoute();
const router = useRouter();
const projectId = computed(() =>
  typeof route.params.id === "string" ? route.params.id : "",
);
const isEditing = computed(() => Boolean(projectId.value));
const loading = ref(isEditing.value);
const saving = ref(false);
const error = ref("");
const techStackText = ref("Vue 3, TypeScript, Node.js");

const form = reactive<ProjectInput>({
  title: "",
  description: "",
  repoUrl: null,
  liveUrl: null,
  techStack: [],
  coverUrl: null,
  problem: null,
  role: null,
  outcome: null,
  tags: [],
  featured: false,
  published: true,
  sortOrder: 0,
});

const availableTags: { value: ProjectTag; label: string }[] = [
  { value: "agent", label: "AI Agent" },
  { value: "backend", label: "Backend" },
  { value: "frontend", label: "Frontend" },
  { value: "fullstack", label: "Full Stack" },
];

function optional(value: string | null): string {
  return value || "";
}

function isHttpUrl(value: string | null): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function toggleTag(tag: ProjectTag): void {
  form.tags = form.tags.includes(tag)
    ? form.tags.filter((item) => item !== tag)
    : [...form.tags, tag];
}

function validate(): string {
  if (!form.title.trim()) return "请填写作品标题。";
  if (form.title.trim().length > 40) return "标题不能超过 40 个字。";
  if (!form.description.trim()) return "请填写作品描述。";
  if (!techStackText.value.trim()) return "技术栈至少填写一项。";
  if (
    !isHttpUrl(form.repoUrl) ||
    !isHttpUrl(form.liveUrl) ||
    !isHttpUrl(form.coverUrl)
  ) {
    return "链接必须是完整的 http(s) 地址。";
  }
  return "";
}

function buildPayload(): ProjectInput {
  const splitOptional = (value: string | null) => value?.trim() || null;
  return {
    ...form,
    title: form.title.trim(),
    description: form.description.trim(),
    repoUrl: splitOptional(form.repoUrl),
    liveUrl: splitOptional(form.liveUrl),
    coverUrl: splitOptional(form.coverUrl),
    problem: splitOptional(form.problem),
    role: splitOptional(form.role),
    outcome: splitOptional(form.outcome),
    techStack: [
      ...new Set(
        techStackText.value
          .split(/[,，\n]/)
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ],
    sortOrder: Number(form.sortOrder) || 0,
  };
}

async function handleSubmit(): Promise<void> {
  error.value = validate();
  if (error.value) return;

  saving.value = true;
  try {
    const payload = buildPayload();
    if (isEditing.value) {
      await updateProject(projectId.value, payload);
    } else {
      await createProject(payload);
    }
    await router.push({ name: "admin-projects" });
  } catch (caught) {
    if (caught instanceof ApiError && caught.status === 401) {
      await router.replace({ name: "admin-login" });
      return;
    }
    error.value = caught instanceof Error ? caught.message : "保存失败。";
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  if (!isEditing.value) return;
  try {
    const project = await fetchProject(projectId.value);
    const copied: ProjectInput = {
      title: project.title,
      description: project.description,
      repoUrl: project.repoUrl,
      liveUrl: project.liveUrl,
      techStack: [...project.techStack],
      coverUrl: project.coverUrl,
      problem: project.problem,
      role: project.role,
      outcome: project.outcome,
      tags: [...project.tags],
      featured: project.featured,
      published: project.published,
      sortOrder: project.sortOrder,
    };
    Object.assign(form, copied);
    techStackText.value = copied.techStack.join(", ");
  } catch (caught) {
    if (caught instanceof ApiError && caught.status === 401) {
      await router.replace({ name: "admin-login" });
      return;
    }
    error.value = caught instanceof Error ? caught.message : "无法读取作品。";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="admin-main admin-form-main">
    <div class="admin-form-top">
      <RouterLink :to="{ name: 'admin-projects' }" class="admin-back-link">
        <AppIcon name="arrow-left" :size="16" />
        返回列表
      </RouterLink>
      <div>
        <p class="eyebrow">{{ isEditing ? "EDIT PROJECT" : "NEW PROJECT" }}</p>
        <h1>{{ isEditing ? "编辑作品" : "新增作品" }}</h1>
      </div>
    </div>

    <div v-if="loading" class="admin-state">正在读取作品…</div>
    <form v-else class="project-form" @submit.prevent="handleSubmit">
      <section class="form-section">
        <div class="form-section__intro">
          <span>01</span>
          <div>
            <h2>基础信息</h2>
            <p>招聘方最先看到的内容，保持短而具体。</p>
          </div>
        </div>
        <div class="form-grid">
          <label class="form-field form-field--wide">
            <span class="form-label">标题 *</span>
            <input
              v-model="form.title"
              class="form-input"
              maxlength="40"
              placeholder="例如：Agent 工单协作台"
            />
            <small>{{ form.title.length }} / 40</small>
          </label>
          <label class="form-field form-field--wide">
            <span class="form-label">描述 *</span>
            <textarea
              v-model="form.description"
              class="form-textarea"
              rows="4"
              placeholder="2–3 句话说明方案与你的贡献"
            />
          </label>
          <label class="form-field form-field--wide">
            <span class="form-label">解决的问题</span>
            <input
              v-model="form.problem"
              class="form-input"
              placeholder="谁遇到了什么痛点"
            />
          </label>
          <label class="form-field">
            <span class="form-label">我的角色</span>
            <input
              v-model="form.role"
              class="form-input"
              placeholder="独立开发 / 模块 owner"
            />
          </label>
          <label class="form-field">
            <span class="form-label">结果</span>
            <input
              v-model="form.outcome"
              class="form-input"
              placeholder="优先填写可验证指标"
            />
          </label>
        </div>
      </section>

      <section class="form-section">
        <div class="form-section__intro">
          <span>02</span>
          <div>
            <h2>技术与链接</h2>
            <p>空链接不会在前台生成无效按钮。</p>
          </div>
        </div>
        <div class="form-grid">
          <label class="form-field form-field--wide">
            <span class="form-label">技术栈 *</span>
            <input
              v-model="techStackText"
              class="form-input"
              placeholder="用逗号分隔，例如：Vue 3, TypeScript, Node.js"
            />
            <small>前台会显示为技术标签，最多 12 项。</small>
          </label>
          <label class="form-field">
            <span class="form-label">源码地址</span>
            <input
              :value="optional(form.repoUrl)"
              class="form-input"
              type="url"
              placeholder="https://github.com/..."
              @input="form.repoUrl = ($event.target as HTMLInputElement).value || null"
            />
          </label>
          <label class="form-field">
            <span class="form-label">访问地址</span>
            <input
              :value="optional(form.liveUrl)"
              class="form-input"
              type="url"
              placeholder="https://..."
              @input="form.liveUrl = ($event.target as HTMLInputElement).value || null"
            />
          </label>
          <label class="form-field form-field--wide">
            <span class="form-label">封面图片地址</span>
            <input
              :value="optional(form.coverUrl)"
              class="form-input"
              type="url"
              placeholder="https://.../cover.webp"
              @input="form.coverUrl = ($event.target as HTMLInputElement).value || null"
            />
          </label>
        </div>
      </section>

      <section class="form-section">
        <div class="form-section__intro">
          <span>03</span>
          <div>
            <h2>展示与发布</h2>
            <p>控制分类、精选状态和公开可见性。</p>
          </div>
        </div>
        <div class="form-grid">
          <fieldset class="form-field form-field--wide">
            <legend class="form-label">分类</legend>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                v-for="tag in availableTags"
                :key="tag.value"
                type="button"
                :class="[
                  'choice-pill',
                  { 'choice-pill--active': form.tags.includes(tag.value) },
                ]"
                :aria-pressed="form.tags.includes(tag.value)"
                @click="toggleTag(tag.value)"
              >
                <AppIcon v-if="form.tags.includes(tag.value)" name="check" :size="14" />
                {{ tag.label }}
              </button>
            </div>
          </fieldset>
          <label class="form-field">
            <span class="form-label">排序权重</span>
            <input
              v-model.number="form.sortOrder"
              class="form-input"
              type="number"
              step="1"
            />
            <small>数字越大，展示越靠前。</small>
          </label>
          <div class="form-field">
            <span class="form-label">状态</span>
            <label class="toggle-row">
              <input v-model="form.featured" type="checkbox" />
              <span class="toggle-control" />
              设为精选
            </label>
            <label class="toggle-row">
              <input v-model="form.published" type="checkbox" />
              <span class="toggle-control" />
              公开发布
            </label>
          </div>
        </div>
      </section>

      <p v-if="error" class="form-error" role="alert">{{ error }}</p>

      <div class="form-actions">
        <RouterLink :to="{ name: 'admin-projects' }" class="button button--outline">
          取消
        </RouterLink>
        <button
          type="submit"
          class="button button--primary"
          :disabled="saving"
        >
          {{ saving ? "正在保存…" : isEditing ? "保存修改" : "创建作品" }}
          <AppIcon v-if="!saving" name="check" :size="17" />
        </button>
      </div>
    </form>
  </main>
</template>
