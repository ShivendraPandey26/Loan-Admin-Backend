import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: (value) =>
          value instanceof Date &&
          !Number.isNaN(value.getTime()) &&
          value <= new Date(),
        message: "Date of birth must be a valid date in the past",
      },
    },

    creditScore: {
      type: Number,
      required: true,
      min: 300,
      max: 900,
    },

    employmentType: {
      type: String,
      enum: ["Salaried", "Self-Employed"],
      required: true,
    },

    salaryType: {
      type: String,
      enum: ["DAT", "Cash", "Cheque"],
      required: true,
    },

    monthlySalary: {
      type: Number,
      required: [true, "Monthly salary is required"],
      min: [0, "Monthly salary cannot be negative"],
    },

    status: {
      type: String,
      enum: ["Active", "Rejected"],
      default: "Rejected",
      required: true,
    },

    eligibleProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    lastEvaluatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Applicant = mongoose.model("Applicant", applicantSchema);

export default Applicant;
