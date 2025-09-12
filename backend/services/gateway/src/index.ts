import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { morganMiddleware, logger } from "../../../libs/logger";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
  override: true,
});

const app = express();
app.use(cors());
app.use(morganMiddleware);

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:4001";
const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:4002";
const JOB_SERVICE_URL = process.env.JOB_SERVICE_URL || "http://localhost:4003";

app.get("/health", (req, res) => res.json({ ok: true, service: "gateway" }));

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "",
    },
  })
);

app.use(
  "/api/users",
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
  })
);

app.use(
  "/api/jobs",
  createProxyMiddleware({
    target: JOB_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
  })
);

const port = process.env.PORT || 4000;
app.listen(port, () => logger.info(`Gateway listening on ${port}`));
