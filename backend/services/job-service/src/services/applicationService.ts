import prisma from "../../../../prisma/client";

export async function createApplication(data: {
  jobId: string;
  userId: string;
}) {
  return prisma.application.create({
    data: {
      jobId: data.jobId,
      userId: data.userId,
    },
  });
}

export async function findApplicationsByJob(jobId: string) {
  return prisma.application.findMany({
    where: { jobId },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });
}
