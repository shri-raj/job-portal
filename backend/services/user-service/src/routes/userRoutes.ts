import { Router } from "express";
import { getUser, getMyApplications } from "../controllers/userController";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController";
import { verifyTokenMiddleware } from "../../../../libs/auth/middleware";

const router = Router();

router.get("/me/profile", verifyTokenMiddleware, getMyProfile);
router.put("/me/profile", verifyTokenMiddleware, updateMyProfile);
router.get("/me/applications", verifyTokenMiddleware, getMyApplications);

router.get("/:id", getUser);

export default router;
