import { Response } from "express";
import * as applicationService from "../services/applicationService";
import { AuthenticatedRequest } from "../../../../libs/auth/middleware";

export async function applyForJob(req: AuthenticatedRequest, res: Response) {
  try {
    const { jobId } = req.params;
    const userId = req.user.sub;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const application = await applicationService.createApplication({
      jobId,
      userId,
    });
    return res.status(201).json(application);
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res
        .status(409)
        .json({ error: "You have already applied for this job." });
    }
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}

export async function getJobApplications(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { jobId } = req.params;
    const applications = await applicationService.findApplicationsByJob(jobId);
    return res.json(applications);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}
