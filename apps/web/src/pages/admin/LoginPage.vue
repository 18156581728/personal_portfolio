<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { login } from "../../api/client";
import AppIcon from "../../components/AppIcon.vue";

const route = useRoute();
const router = useRouter();
const password = ref("");
const error = ref("");
const submitting = ref(false);

async function handleSubmit(): Promise<void> {
  if (!password.value || submitting.value) return;
  submitting.value = true;
  error.value = "";
  try {
    await login(password.value);
    const redirect =
      typeof route.query.redirect === "string" ? route.query.redirect : undefined;
    await router.replace(redirect || { name: "admin-projects" });
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : "登录失败。";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main class="admin-login-page">
    <div class="admin-login-page__grid" aria-hidden="true" />
    <div class="admin-login-card">
      <div class="admin-lock">
        <AppIcon name="lock" :size="23" />
      </div>
      <p class="eyebrow mt-6">PRIVATE AREA</p>
      <h1 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
        内容管理
      </h1>
      <p class="mt-3 text-sm leading-6 text-white/50">
        输入管理口令后继续。该页面不会被搜索引擎索引。
      </p>

      <form class="mt-8" @submit.prevent="handleSubmit">
        <label for="admin-password" class="form-label">管理口令</label>
        <input
          id="admin-password"
          v-model="password"
          type="password"
          class="form-input"
          autocomplete="current-password"
          autofocus
          placeholder="输入口令"
          :disabled="submitting"
        />
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button
          type="submit"
          class="button button--primary mt-5 w-full justify-center"
          :disabled="submitting || !password"
        >
          {{ submitting ? "正在验证…" : "进入管理端" }}
          <AppIcon v-if="!submitting" name="arrow-right" :size="17" />
        </button>
      </form>

      <a href="/" class="mt-7 inline-flex items-center gap-2 text-sm text-white/45 hover:text-white">
        <AppIcon name="arrow-left" :size="15" />
        返回公开站点
      </a>
    </div>
  </main>
</template>
