import { createRouter, createWebHistory } from "vue-router";
import { checkSession } from "./api/client";
import HomePage from "./pages/HomePage.vue";

function normalizeAdminPath(value: string | undefined): string {
  const raw = value?.trim() || "/_studio";
  return `/${raw.replace(/^\/+|\/+$/g, "")}`;
}

export const ADMIN_BASE = normalizeAdminPath(import.meta.env.VITE_ADMIN_PATH);
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to) {
    // 公开页各区块由首页组件统一控制滚动，路由层不再产生 #hash。
    return to.meta.admin ? { top: 0 } : false;
  },
  routes: [
    {
      path: "/:section(projects|about|skills|experience|contact)?",
      name: "home",
      component: HomePage,
    },
    {
      path: `${ADMIN_BASE}/login`,
      name: "admin-login",
      component: () => import("./pages/admin/LoginPage.vue"),
      meta: { admin: true },
    },
    {
      path: ADMIN_BASE,
      component: () => import("./pages/admin/AdminLayout.vue"),
      meta: { admin: true, requiresAuth: true },
      children: [
        {
          path: "",
          name: "admin-projects",
          component: () => import("./pages/admin/ProjectListPage.vue"),
        },
        {
          path: "new",
          name: "admin-project-new",
          component: () => import("./pages/admin/ProjectFormPage.vue"),
        },
        {
          path: ":id/edit",
          name: "admin-project-edit",
          component: () => import("./pages/admin/ProjectFormPage.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

function setRobots(isAdmin: boolean): void {
  const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  robots?.setAttribute("content", isAdmin ? "noindex, nofollow" : "index, follow");
}

router.beforeEach(async (to) => {
  setRobots(Boolean(to.meta.admin));
  if (!to.meta.requiresAuth) return true;

  const authenticated = await checkSession();
  if (authenticated) return true;

  return {
    name: "admin-login",
    query: { redirect: to.fullPath },
  };
});

export { router };
