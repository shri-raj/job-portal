import { Request, Response } from "express";
import * as userService from "../services/userService";

export async function getUser(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await userService.findUserById(id);
    if (!user) return res.status(404).json({ error: "not found" });
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}
