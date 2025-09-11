import prisma from "../../../../prisma/client";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
  postedBy: z.string().min(1),
});

const partialJobSchema = jobSchema.partial();

type JobData = z.infer<typeof jobSchema>;
type PartialJobData = z.infer<typeof partialJobSchema>;

export async function createJob(data: JobData) {
  const parsed = jobSchema.safeParse(data);
  if (!parsed.success) {
    const validation = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    const err: any = new Error("validation_error");
    err.validation = validation;
    throw err;
  }

  return prisma.job.create({
    data: {
      ...parsed.data,
      location: parsed.data.location ?? "Unknown",
    },
  });
}

export async function updateJob(
  jobId: string,
  userId: string,
  data: PartialJobData
) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.postedBy !== userId) {
    throw new Error("Job not found or user not authorized");
  }

  return prisma.job.update({
    where: { id: jobId },
    data,
  });
}

export async function deleteJob(jobId: string, userId: string) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.postedBy !== userId) {
    throw new Error("Job not found or user not authorized");
  }

  await prisma.application.deleteMany({ where: { jobId } });

  return prisma.job.delete({
    where: { id: jobId },
  });
}

export async function listJobs(filters: {
  q?: string;
  location?: string;
  tags?: string[];
}) {
  const { q, location, tags } = filters;
  const where: any = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { company: { contains: q, mode: "insensitive" } },
    ];
  }

  if (location) {
    where.location = { contains: location, mode: "insensitive" };
  }

  if (tags && tags.length > 0) {
    where.tags = { hasSome: tags };
  }

  return prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}
