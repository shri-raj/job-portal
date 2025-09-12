import { Router } from "express";
import { getUser, getMyApplications } from "../controllers/userController";
import { verifyTokenMiddleware } from "../../../../libs/auth/middleware";

const router = Router();

router.get("/me/applications", verifyTokenMiddleware, getMyApplications);

router.get("/:id", getUser);

export default router;
