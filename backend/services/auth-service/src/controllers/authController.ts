import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../schema";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({
      error: parsed.error.format ? parsed.error.format() : parsed.error,
    });

  try {
    const result = await authService.registerUser(parsed.data);
    return res.status(201).json(result);
  } catch (err: any) {
    if (err?.code === "P2002" || err?.message === "email_exists") {
      return res.status(409).json({ error: "email exists" });
    }
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({
      error: parsed.error.format ? parsed.error.format() : parsed.error,
    });

  try {
    const token = await authService.loginUser(parsed.data);
    if (!token) return res.status(401).json({ error: "invalid credentials" });
    return res.json({ token });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "internal error" });
  }
}
