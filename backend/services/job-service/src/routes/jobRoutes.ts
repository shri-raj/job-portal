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

router.post("/", verifyTokenMiddleware, hasRole(["recruiter"]), createJob);
router.get("/", listJobs); // Public search/filter endpoint
router.put("/:jobId", verifyTokenMiddleware, hasRole(["recruiter"]), updateJob);
router.delete(
  "/:jobId",
  verifyTokenMiddleware,
  hasRole(["recruiter"]),
  deleteJob
);

router.post(
  "/:jobId/apply",
  verifyTokenMiddleware,
  hasRole(["user", "recruiter"]),
  applyForJob
);
router.get(
  "/:jobId/applications",
  verifyTokenMiddleware,
  hasRole(["recruiter"]),
  getJobApplications
);

export default router;
