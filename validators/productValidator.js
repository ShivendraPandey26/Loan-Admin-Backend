import { z } from "zod";

const productFields = {
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional(),
  minAge: z.number().int().min(18).max(100),
  maxAge: z.number().int().min(18).max(100),
  minCreditScore: z.number().int().min(300).max(900),
  allowedEmploymentTypes: z
    .array(z.enum(["Salaried", "Self-Employed"]))
    .min(1)
    .refine((values) => new Set(values).size === values.length, {
      message: "Employment types cannot contain duplicates",
    }),
  allowedSalaryTypes: z
    .array(z.enum(["DAT", "Cash", "Cheque"]))
    .min(1)
    .refine((values) => new Set(values).size === values.length, {
      message: "Salary types cannot contain duplicates",
    }),
  minSalary: z.number().finite().min(0),
};

export const createProductSchema = z
  .object(productFields)
  .strict()
  .refine((data) => data.minAge <= data.maxAge, {
    message: "Minimum age cannot exceed maximum age",
    path: ["minAge"],
  });

export const updateProductSchema = z
  .object(productFields)
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  })
  .refine(
    (data) =>
      data.minAge === undefined ||
      data.maxAge === undefined ||
      data.minAge <= data.maxAge,
    {
      message: "Minimum age cannot exceed maximum age",
      path: ["minAge"],
    },
  );
