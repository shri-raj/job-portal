import { Request, Response } from "express";
import * as jobService from "../services/jobService";

export async function createJob(req: Request, res: Response) {
  try {
    const job = await jobService.createJob(req.body);
    return res.status(201).json(job);
  } catch (err: any) {
    if (err?.validation) {
      return res.status(400).json({ errors: err.validation });
    }
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}

export async function listJobs(req: Request, res: Response) {
  try {
    const jobs = await jobService.listJobs();
    return res.json(jobs);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}
