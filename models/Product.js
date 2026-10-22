import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    minAge: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },

    maxAge: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },

    minCreditScore: {
      type: Number,
      required: true,
      min: 300,
      max: 900,
    },

    allowedEmploymentTypes: {
      type: [
        {
          type: String,
          enum: ["Salaried", "Self-Employed"],
        },
      ],
      required: true,
      validate: {
        validator: (values) => values.length > 0,
        message: "At least one employment type is required",
      },
    },

    allowedSalaryTypes: {
      type: [
        {
          type: String,
          enum: ["DAT", "Cash", "Cheque"],
        },
      ],
      required: true,
      validate: {
        validator: (values) => values.length > 0,
        message: "At least one salary type is required",
      },
    },

    minSalary: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("validate", function () {
  if (this.minAge != null && this.maxAge != null && this.minAge > this.maxAge) {
    this.invalidate(
      "maxAge",
      "Maximum age must be greater than or equal to minimum age",
    );
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
