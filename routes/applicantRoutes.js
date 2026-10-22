import express from "express";

import {
  createApplicant,
  getApplicants,
  getApplicantById,
  getEligibleProducts,
  updateApplicant,
} from "../controllers/applicantController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validate.js";

import {
  createApplicantSchema,
  updateApplicantSchema,
} from "../validators/applicantValidator.js";

const router = express.Router();

// Both roles can view applicants.
router.get("/", authenticate, getApplicants);

router.get("/:id/eligible-products", authenticate, getEligibleProducts);

router.get("/:id", authenticate, getApplicantById);

// Only Admin can add applicants.
router.post(
  "/",
  authenticate,
  allowRoles("Admin"),
  validate(createApplicantSchema),
  createApplicant,
);

// Only Admin can update applicants.
router.patch(
  "/:id",
  authenticate,
  allowRoles("Admin"),
  validate(updateApplicantSchema),
  updateApplicant,
);

export default router;
