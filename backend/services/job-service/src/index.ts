import express, { Request, Response } from "express";
import { morganMiddleware, logger } from "../../../libs/logger";
import dotenv from "dotenv";
import jobRouter from "./routes/jobRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(morganMiddleware);

app.get("/health", (req: Request, res: Response) =>
  res.json({ ok: true, service: "job" })
);

app.use("/", jobRouter);

const port = process.env.PORT || 4003;
app.listen(port, () => logger.info(`Job service listening on ${port}`));
