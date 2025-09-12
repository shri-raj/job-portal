import { Router } from "express";
import { getUser, getMyApplications } from "../controllers/userController";
import { verifyTokenMiddleware } from "../../../../libs/auth/middleware";

const router = Router();

// A user must be logged in to get their own applications
router.get("/me/applications", verifyTokenMiddleware, getMyApplications);

// This route can be used to get public info about any user
router.get("/:id", getUser);

export default router;
