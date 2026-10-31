<script setup lang="ts">
import { useRouter } from "vue-router";
import { logout } from "../../api/client";
import AppIcon from "../../components/AppIcon.vue";

const router = useRouter();

async function handleLogout(): Promise<void> {
  await logout().catch(() => undefined);
  await router.replace({ name: "admin-login" });
}
</script>

<template>
  <div class="admin-shell">
    <header class="admin-header">
      <div class="admin-header__inner">
        <RouterLink :to="{ name: 'admin-projects' }" class="admin-brand">
          <span class="admin-brand__dot" />
          PORTFOLIO / STUDIO
        </RouterLink>
        <div class="flex items-center gap-2">
          <a href="/" class="admin-header__link">查看站点</a>
          <button type="button" class="admin-header__link" @click="handleLogout">
            <AppIcon name="logout" :size="16" />
            退出
          </button>
        </div>
      </div>
    </header>
    <RouterView />
  </div>
</template>
