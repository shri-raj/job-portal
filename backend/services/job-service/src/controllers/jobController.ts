import { Request, Response } from "express";
import * as jobService from "../services/jobService";
import { AuthenticatedRequest } from "../../../../libs/auth/middleware";

export async function createJob(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user.sub;
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

export async function updateJob(req: AuthenticatedRequest, res: Response) {
  try {
    const { jobId } = req.params;
    const userId = req.user.sub;
    const updatedJob = await jobService.updateJob(jobId, userId, req.body);
    return res.json(updatedJob);
  } catch (err: any) {
    if (err.message === "Job not found or user not authorized") {
      return res.status(403).json({ error: err.message });
    }
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}

export async function deleteJob(req: AuthenticatedRequest, res: Response) {
  try {
    const { jobId } = req.params;
    const userId = req.user.sub;
    await jobService.deleteJob(jobId, userId);
    return res.status(204).send();
  } catch (err: any) {
    if (err.message === "Job not found or user not authorized") {
      return res.status(403).json({ error: err.message });
    }
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}

export async function listJobs(req: Request, res: Response) {
  try {
    const { q, location, tags } = req.query;

    const filters = {
      q: q as string | undefined,
      location: location as string | undefined,
      tags: typeof tags === "string" ? tags.split(",") : undefined,
    };

    const jobs = await jobService.listJobs(filters);
    return res.json(jobs);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}
