import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Account from "../models/Account.js";

dotenv.config();

const seedAccounts = async () => {
  try {
    if (
      !process.env.MONGODB_URI ||
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.VIEWER_EMAIL ||
      !process.env.VIEWER_PASSWORD
    ) {
      throw new Error("Database and seed credentials are required");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const accounts = [
      {
        name: "Admin",
        email: process.env.ADMIN_EMAIL.trim().toLowerCase(),
        password: process.env.ADMIN_PASSWORD,
        role: "Admin",
      },
      {
        name: "Viewer",
        email: process.env.VIEWER_EMAIL.trim().toLowerCase(),
        password: process.env.VIEWER_PASSWORD,
        role: "Viewer",
      },
    ];

    for (const data of accounts) {
      const passwordHash = await bcrypt.hash(data.password, 12);

      await Account.findOneAndUpdate(
        { email: data.email },
        {
          $setOnInsert: {
            name: data.name,
            email: data.email,
            password: passwordHash,
            role: data.role,
          },
        },
        {
          upsert: true,
          runValidators: true,
        },
      );
    }

    console.log("Seed accounts created or already exist");
  } catch (error) {
    console.error("Account seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAccounts();
