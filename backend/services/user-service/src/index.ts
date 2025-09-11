import express, { Request, Response } from "express";
import { morganMiddleware, logger } from "../../../libs/logger";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes";

import path from "path";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
  override: true,
});
const app = express();
app.use(express.json());
app.use(morganMiddleware);

app.get("/health", (req: Request, res: Response) =>
  res.json({ ok: true, service: "user" })
);

app.use("/", userRouter);

const port = process.env.PORT || 4002;
app.listen(port, () => logger.info(`User service listening on ${port}`));
