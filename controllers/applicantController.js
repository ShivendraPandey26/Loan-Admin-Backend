import mongoose from "mongoose";
import Applicant from "../models/Applicant.js";
import Product from "../models/Product.js";
import { evaluateApplicant } from "../services/eligibilityService.js";

// POST /api/applicants
export const createApplicant = async (req, res, next) => {
  try {
    const applicant = new Applicant({
      ...req.validatedBody,
      dateOfBirth: new Date(`${req.validatedBody.dateOfBirth}T00:00:00.000Z`),
    });

    const products = await Product.find().lean();
    const evaluationDate = new Date();

    const result = evaluateApplicant(applicant, products, evaluationDate);

    applicant.status = result.status;
    applicant.eligibleProducts = result.eligibleProducts;
    applicant.lastEvaluatedAt = result.evaluatedAt;

    await applicant.save();

    res.status(201).json({
      success: true,
      message: "Applicant created and evaluated successfully",
      data: {
        applicant,
        age: result.age,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/applicants
export const getApplicants = async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const status = req.query.status;

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100",
      });
    }

    if (status !== undefined && !["Active", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Active or Rejected",
      });
    }

    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [applicants, total] = await Promise.all([
      Applicant.find(filter)
        .populate("eligibleProducts", "name")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit),
      Applicant.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: applicants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/applicants/:id
// export const getApplicantById = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid applicant ID",
//       });
//     }

//     const applicant = await Applicant.findById(id).populate(
//       "eligibleProducts",
//       "name description minAge maxAge minCreditScore minSalary",
//     );

//     if (!applicant) {
//       return res.status(404).json({
//         success: false,
//         message: "Applicant not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: applicant,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

/**
GET /api/applicants/:id
         or 
GET /api/applicants/:fullName
**/
export const getApplicantByIdAndName = async (req, res, next) => {
  try {
    const { id } = req.params;

    let applicants;

    if (mongoose.isValidObjectId(id)) {
      const applicant = await Applicant.findById(id).populate(
        "eligibleProducts",
        "name description minAge maxAge minCreditScore minSalary",
      );

      if (!applicant) {
        return res.status(404).json({
          success: false,
          message: "Applicant not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: applicant,
      });
    }

    applicants = await Applicant.find({
      fullName: { $regex: id, $options: "i" },
    }).populate(
      "eligibleProducts",
      "name description minAge maxAge minCreditScore minSalary",
    );

    if (applicants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applicants found",
      });
    }

    return res.status(200).json({
      success: true,
      count: applicants.length,
      data: applicants,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/applicants/:id/eligible-products
export const getEligibleProducts = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid applicant ID",
      });
    }

    const applicant = await Applicant.findById(id).populate(
      "eligibleProducts",
      "name description minAge maxAge minCreditScore minSalary",
    );

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    res.status(200).json({
      success: true,
      status: applicant.status,
      lastEvaluatedAt: applicant.lastEvaluatedAt,
      count: applicant.eligibleProducts.length,
      data: applicant.eligibleProducts,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/applicants/:id
export const updateApplicant = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid applicant ID",
      });
    }

    const applicant = await Applicant.findById(req.params.id);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    Object.assign(applicant, req.validatedBody);

    const products = await Product.find().lean();
    const evaluationDate = new Date();

    const result = evaluateApplicant(applicant, products, evaluationDate);

    applicant.status = result.status;
    applicant.eligibleProducts = result.eligibleProducts;
    applicant.lastEvaluatedAt = result.evaluatedAt;

    await applicant.save();

    return res.status(200).json({
      success: true,
      message: "Applicant updated successfully",
      data: {
        applicant,
        age: result.age,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/applicants/:id/evaluate
export const evaluateApplicantEligibility = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid applicant ID",
      });
    }

    const applicant = await Applicant.findById(id);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    const products = await Product.find().lean();
    const evaluationDate = new Date();

    const result = evaluateApplicant(applicant, products, evaluationDate);

    applicant.status = result.status;
    applicant.eligibleProducts = result.eligibleProducts;
    applicant.lastEvaluatedAt = result.evaluatedAt;

    await applicant.save();

    await applicant.populate(
      "eligibleProducts",
      "name description minAge maxAge minCreditScore minSalary",
    );

    return res.status(200).json({
      success: true,
      message: "Eligibility evaluated successfully",
      data: {
        applicant,
        age: result.age,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/applicants/:id
export const deleteApplicant = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid applicant ID",
      });
    }

    const applicant = await Applicant.findByIdAndDelete(id);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applicant deleted successfully",
      data: {
        applicant,
      },
    });
  } catch (error) {
    next(error);
  }
};
