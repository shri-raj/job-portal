import { Router } from "express";
import { getUser } from "../controllers/userController";

const router = Router();

router.get("/users/:id", getUser);

export default router;
