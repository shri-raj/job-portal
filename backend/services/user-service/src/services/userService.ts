import prisma from "../../../../prisma/client";

export async function findUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    roles: user.roles,
  };
}

export async function findUserApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    orderBy: { appliedAt: "desc" },
    include: {
      job: {
        select: {
          title: true,
          company: true,
          location: true,
        },
      },
    },
  });
}
