import { Response } from "express";
import * as userService from "../services/userService";
import { AuthenticatedRequest } from "../../../../libs/auth/middleware";

export async function getUser(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  try {
    const user = await userService.findUserById(id);
    if (!user) return res.status(404).json({ error: "not found" });
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}

export async function getMyApplications(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const applications = await userService.findUserApplications(userId);
    return res.json(applications);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}
