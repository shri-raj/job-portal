import { Response } from "express";
import * as profileService from "../services/profileService";
import { AuthenticatedRequest } from "../../../../libs/auth/middleware";

export async function getMyProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user.sub;
    const profile = await profileService.getProfileByUserId(userId);

    if (!profile) {
      return res.status(200).json({});
    }
    return res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
}

export async function updateMyProfile(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user.sub;
    const profile = await profileService.upsertProfile(userId, req.body);
    return res.status(200).json(profile);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res
        .status(400)
        .json({ error: "Invalid data provided", details: err.errors });
    }
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
}
