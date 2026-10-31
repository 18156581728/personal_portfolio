import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // 允许在受限文件系统环境中把预构建缓存放到项目外部。
  cacheDir: process.env.VITE_CACHE_DIR || "node_modules/.vite",
  optimizeDeps: {
    // 当前 Vite 版本支持直接提供 ESM 依赖；受限环境可按需关闭预打包。
    noDiscovery: process.env.VITE_DISABLE_DEP_OPTIMIZATION === "true",
    include:
      process.env.VITE_DISABLE_DEP_OPTIMIZATION === "true" ? [] : undefined,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
