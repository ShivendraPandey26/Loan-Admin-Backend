import express from "express";
import { login, viewerSignup } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", viewerSignup);

router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    account: req.user,
  });
});

export default router;
