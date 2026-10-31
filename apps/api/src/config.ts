import path from "node:path";
import process from "node:process";

// 本地开发时自动读取 apps/api/.env；部署环境可直接注入同名环境变量。
try {
  process.loadEnvFile(path.resolve(process.cwd(), ".env"));
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
    throw error;
  }
}

const isProduction = process.env.NODE_ENV === "production";
const defaultPassword = "change-me-now";
const adminPassword = process.env.ADMIN_PASSWORD || (isProduction ? "" : defaultPassword);

if (!adminPassword) {
  throw new Error("生产环境必须设置 ADMIN_PASSWORD。");
}

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error("生产环境必须设置 SESSION_SECRET。");
}

if (!process.env.ADMIN_PASSWORD && !isProduction) {
  console.warn("正在使用开发默认管理口令，请在上线前设置 ADMIN_PASSWORD。");
}

export const config = {
  isProduction,
  port: Number(process.env.PORT || 3000),
  adminPath: process.env.ADMIN_PATH || "/_studio",
  adminPassword,
  sessionSecret: process.env.SESSION_SECRET || adminPassword,
  seedDemoProjects:
    process.env.SEED_DEMO_PROJECTS === "true" ||
    (!isProduction && process.env.SEED_DEMO_PROJECTS !== "false"),
  trustProxy: process.env.TRUST_PROXY === "true",
  databasePath: path.resolve(
    process.cwd(),
    process.env.DATABASE_PATH || "./data/portfolio.db",
  ),
};
