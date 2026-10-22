import jwt from "jsonwebtoken";
import Account from "../models/Account.js";

export const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token required",
      });
    }

    const token = authorization.slice(7);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const account = await Account.findById(decoded.sub).select(
      "_id name email role",
    );

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Account no longer exists",
      });
    }

    req.user = {
      id: account._id.toString(),
      name: account.name,
      email: account.email,
      role: account.role,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    next(error);
  }
};
