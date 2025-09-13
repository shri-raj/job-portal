import prisma from "../../../../prisma/client";
import { z } from "zod";

const companySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  website: z.string().url().optional().nullable(),
  location: z.string().min(1),
});

export async function createCompany(data: unknown) {
  const parsedData = companySchema.parse(data);
  return prisma.company.create({
    data: parsedData,
  });
}

export async function findCompanyById(id: string) {
  return prisma.company.findUnique({
    where: { id },
    include: { jobs: { orderBy: { createdAt: "desc" } } },
  });
}

export async function listCompanies() {
  return prisma.company.findMany({
    orderBy: { name: "asc" },
  });
}
