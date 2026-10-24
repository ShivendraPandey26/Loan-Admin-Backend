import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import applicantRoutes from "./routes/applicantRoutes.js";

// middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { overview } from "./config/overview.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers and middleware
app.use(helmet());

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "https://loanadmins.vercel.app",
    ],
  }),
);

app.use(express.json({ limit: "1mb" }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);

// Health check route and overview route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: overview,
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Loan Admin API is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/applicants", applicantRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
