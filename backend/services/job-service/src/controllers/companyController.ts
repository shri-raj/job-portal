import { Request, Response } from "express";
import * as companyService from "../services/companyService";

export async function createCompany(req: Request, res: Response) {
  try {
    const company = await companyService.createCompany(req.body);
    return res.status(201).json(company);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res
        .status(400)
        .json({ error: "Invalid data", details: err.errors });
    }
    if (err.code === "P2002") {
      // Handle unique constraint violation for company name
      return res
        .status(409)
        .json({ error: "A company with this name already exists." });
    }
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}

export async function getCompany(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const company = await companyService.findCompanyById(id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    return res.json(company);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}

export async function listCompanies(req: Request, res: Response) {
  try {
    const companies = await companyService.listCompanies();
    return res.json(companies);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}
