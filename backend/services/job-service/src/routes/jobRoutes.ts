import { Router } from "express";
import {
  createJob,
  listJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController";
import {
  applyForJob,
  getJobApplications,
} from "../controllers/applicationController";
import {
  verifyTokenMiddleware,
  hasRole,
} from "../../../../libs/auth/middleware";

const router = Router();

// --- Job Routes (CRUD for recruiters) ---
router.post("/jobs", verifyTokenMiddleware, hasRole(["recruiter"]), createJob);
router.get("/jobs", listJobs); // Public search/filter endpoint
router.put(
  "/jobs/:jobId",
  verifyTokenMiddleware,
  hasRole(["recruiter"]),
  updateJob
);
router.delete(
  "/jobs/:jobId",
  verifyTokenMiddleware,
  hasRole(["recruiter"]),
  deleteJob
);

// --- Application Routes ---
router.post(
  "/jobs/:jobId/apply",
  verifyTokenMiddleware,
  hasRole(["user", "recruiter"]),
  applyForJob
);
router.get(
  "/jobs/:jobId/applications",
  verifyTokenMiddleware,
  hasRole(["recruiter"]),
  getJobApplications
);

export default router;
