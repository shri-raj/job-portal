import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function comparePassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
