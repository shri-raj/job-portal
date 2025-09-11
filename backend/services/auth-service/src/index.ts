import express, { Request, Response } from "express";
import { morganMiddleware, logger } from "../../../libs/logger";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes";

import path from "path";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
  override: true,
});
const app = express();
app.use(express.json());
app.use(morganMiddleware);

app.get("/health", (req: Request, res: Response) =>
  res.json({ ok: true, service: "auth" })
);

app.use("/", authRouter);

const port = process.env.PORT || 4001;
app.listen(port, () => logger.info(`Auth service listening on ${port}`));
