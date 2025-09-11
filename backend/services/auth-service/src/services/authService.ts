import prisma from "../../../../prisma/client";
import { hashPassword, comparePassword, signToken } from "../auth";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  roles?: string[];
}) {
  const { name, email, password, roles = ["user"] } = data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err: any = new Error("email_exists");
    err.code = "P2002";
    throw err;
  }
  const pwHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: pwHash, roles },
  });

  const token = signToken({
    sub: user.id,
    email: user.email,
    roles: user.roles,
  });
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    },
  };
}

export async function loginUser(data: { email: string; password: string }) {
  const { email, password } = data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await comparePassword(password, user.password);
  if (!ok) return null;

  return signToken({ sub: user.id, email: user.email, roles: user.roles });
}
