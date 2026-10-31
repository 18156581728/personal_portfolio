import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { config } from "./config.js";
import { seedDemoProjects } from "./db.js";
import { apiRouter } from "./routes.js";

if (config.seedDemoProjects) {
  seedDemoProjects();
}

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", config.trustProxy);
app.use(express.json({ limit: "100kb" }));
app.use("/api", apiRouter);

const webDist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../web/dist",
);

if (fs.existsSync(webDist)) {
  app.use(
    express.static(webDist, {
      maxAge: config.isProduction ? "1h" : 0,
      index: false,
    }),
  );
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(webDist, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.json({
      message: "API 已启动。开发时请访问 Vite 地址，或先运行 npm run build。",
    });
  });
}

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);
    res.status(500).json({ message: "服务器内部错误。" });
  },
);

app.listen(config.port, () => {
  console.log(`Portfolio API running at http://localhost:${config.port}`);
  console.log(`Configured admin path: ${config.adminPath}`);
});
