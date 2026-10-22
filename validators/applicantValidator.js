import { z } from "zod";

export const createApplicantSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),

    dateOfBirth: z.iso
      .date()
      .refine(
        (value) => value <= new Date().toISOString().slice(0, 10),
        "Date of birth cannot be in the future",
      ),

    creditScore: z.number().int().min(300).max(900),

    employmentType: z.enum(["Salaried", "Self-Employed"]),

    salaryType: z.enum(["DAT", "Cash", "Cheque"]),

    monthlySalary: z.number().finite().min(0),
  })
  .strict();

export const updateApplicantSchema = createApplicantSchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
