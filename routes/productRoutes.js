import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validate.js";

import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidator.js";

const router = express.Router();

// Both roles can view products.
router.get("/", authenticate, getProducts);
router.get("/:id", authenticate, getProductById);

// Only Admin can create or edit products.
router.post(
  "/",
  authenticate,
  allowRoles("Admin"),
  validate(createProductSchema),
  createProduct,
);

router.patch(
  "/:id",
  authenticate,
  allowRoles("Admin"),
  validate(updateProductSchema),
  updateProduct,
);

router.delete("/:id", authenticate, allowRoles("Admin"), deleteProduct);

export default router;
