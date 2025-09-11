import express from "express";
import fs from "fs";
import path from "path";
import { morganMiddleware, logger } from "../../../libs/logger";
import dotenv from "dotenv";

dotenv.config();

const DATA_PATH =
  process.env.RAG_DATA_PATH || path.join(__dirname, "..", "data");

const app = express();
app.use(express.json());
app.use(morganMiddleware);

// Load small dataset into memory
let documents: { id: string; text: string }[] = [];
try {
  const p = path.isAbsolute(DATA_PATH)
    ? DATA_PATH
    : path.join(process.cwd(), DATA_PATH);
  if (fs.existsSync(p)) {
    const files = fs.readdirSync(p);
    documents = files.map((f) => ({
      id: f,
      text: fs.readFileSync(path.join(p, f), "utf-8"),
    }));
  }
} catch (e) {
  logger.warn("Could not load RAG data", e);
}

app.get("/health", (req, res) => res.json({ ok: true, service: "rag" }));

// Simple retrieval endpoint: returns top-k docs that contain any query term
app.post("/retrieve", (req, res) => {
  const { query, k = 3 } = req.body;
  if (!query) return res.status(400).json({ error: "query required" });
  const terms = query.toLowerCase().split(/\W+/).filter(Boolean);
  const scored = documents
    .map((d) => {
      const score = terms.reduce(
        (s, t) => (d.text.toLowerCase().includes(t) ? s + 1 : s),
        0
      );
      return { ...d, score };
    })
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
  res.json({ results: scored });
});

// RAG Q&A: naive merge of retrieved docs plus simple template answer
app.post("/qa", (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "question required" });
  const terms = question.toLowerCase().split(/\W+/).filter(Boolean);
  const matched = documents
    .filter((d) => terms.some((t) => d.text.toLowerCase().includes(t)))
    .slice(0, 3);
  const answer =
    matched.map((m) => `From ${m.id}: ${m.text.slice(0, 200)}`).join("\n\n") ||
    "No relevant documents found.";
  res.json({ answer, sources: matched.map((m) => m.id) });
});

const port = process.env.PORT || 4004;
app.listen(port, () =>
  logger.info(`RAG service listening on ${port}, documents=${documents.length}`)
);
