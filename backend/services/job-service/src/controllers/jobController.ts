import { Response } from "express";
import * as jobService from "../services/jobService";
import { AuthenticatedRequest } from "../../../../libs/auth/middleware";

export async function createJob(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user.sub; // Get recruiter's ID from token
    const jobData = { ...req.body, postedBy: userId };
    const job = await jobService.createJob(jobData);
    return res.status(201).json(job);
  } catch (err: any) {
    if (err?.validation) {
      return res.status(400).json({ errors: err.validation });
    }
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}

export async function listJobs(req: AuthenticatedRequest, res: Response) {
  try {
    const jobs = await jobService.listJobs();
    return res.json(jobs);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}
