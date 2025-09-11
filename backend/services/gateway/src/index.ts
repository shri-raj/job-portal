import express from "express";
import fetch from "node-fetch";
import { morganMiddleware, logger } from "../../../libs/logger";
import dotenv from "dotenv";

import path from "path";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
  override: true,
});
const app = express();
app.use(express.json());
app.use(morganMiddleware);

app.get("/health", (req, res) => res.json({ ok: true, service: "gateway" }));

app.get("/api/jobs", async (req, res) => {
  const JOB_SERVICE_URL =
    process.env.JOB_SERVICE_URL || "http://localhost:4003";
  const r = await fetch(`${JOB_SERVICE_URL}/jobs`);
  const data = await r.json();
  res.json(data);
});

// Swagger docs endpoint placeholder (we'll generate OpenAPI JSON later)
app.get("/docs.json", (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: { title: "Gateway API", version: "0.1.0" },
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => logger.info(`Gateway listening on ${port}`));
