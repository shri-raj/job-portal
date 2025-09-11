import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../prisma/client";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function comparePassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
