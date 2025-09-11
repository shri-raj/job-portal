import { Router } from "express";
import { createJob, listJobs } from "../controllers/jobController";

const router = Router();

router.post("/jobs", createJob);
router.get("/jobs", listJobs);

export default router;
