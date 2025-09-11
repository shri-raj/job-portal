import prisma from "../../../../prisma/client";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
  postedBy: z.string().min(1), // Now expects the recruiter's user ID
});

type JobData = z.infer<typeof jobSchema>;

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

  const job = await prisma.job.create({
    data: {
      ...parsed.data,
      location: parsed.data.location ?? "Unknown",
    },
  });
  return job;
}

export async function listJobs() {
  return prisma.job.findMany({ orderBy: { createdAt: "desc" } });
}
