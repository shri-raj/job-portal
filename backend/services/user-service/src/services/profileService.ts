import prisma from "../../../../prisma/client";
import { z } from "zod";

const profileSchema = z.object({
  resumeUrl: z.string().url().optional().nullable(),
  summary: z.string().optional().nullable(),
  skills: z.array(z.string()).optional(),
});

export async function getProfileByUserId(userId: string) {
  // Find the user first to get their profileId
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  return user?.profile;
}

export async function upsertProfile(userId: string, data: unknown) {
  const parsedData = profileSchema.parse(data);

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { profileId: true },
  });

  if (existingUser && existingUser.profileId) {
    return prisma.profile.update({
      where: { id: existingUser.profileId },
      data: parsedData,
    });
  }

  const newProfile = await prisma.profile.create({
    data: parsedData,
  });

  await prisma.user.update({
    where: { id: userId },
    data: { profileId: newProfile.id },
  });

  return newProfile;
}
