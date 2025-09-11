import { Router } from "express";
import { createJob, listJobs } from "../controllers/jobController";
import {
  applyForJob,
  getJobApplications,
} from "../controllers/applicationController";
import {
  verifyTokenMiddleware,
  hasRole,
} from "../../../../libs/auth/middleware";

const router = Router();

// --- Job Routes ---
// Protect the createJob route: only users with 'recruiter' role can access it.
router.post("/jobs", verifyTokenMiddleware, hasRole(["recruiter"]), createJob);
// listJobs can remain public
router.get("/jobs", listJobs);

// --- Application Routes ---
// Any authenticated user ('user' or 'recruiter') can apply for a job.
router.post(
  "/jobs/:jobId/apply",
  verifyTokenMiddleware,
  hasRole(["user", "recruiter"]),
  applyForJob
);
// Only recruiters can see who applied for a job.
router.get(
  "/jobs/:jobId/applications",
  verifyTokenMiddleware,
  hasRole(["recruiter"]),
  getJobApplications
);

export default router;
