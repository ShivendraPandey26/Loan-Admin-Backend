import mongoose from "mongoose";
import Product from "../models/Product.js";
import { reEvaluateAllApplicants } from "../services/reEvaluationService.js";

// GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products
export const createProduct = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    let product;
    let evaluationSummary;

    await session.withTransaction(async () => {
      [product] = await Product.create([req.validatedBody], { session });

      evaluationSummary = await reEvaluateAllApplicants(session);
    });

    return res.status(201).json({
      success: true,
      message: "Product created and applicants re-evaluated successfully",
      data: {
        product,
        evaluation: evaluationSummary,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

// PATCH /api/products/:id
export const updateProduct = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    let updatedProduct;
    let evaluationSummary;

    await session.withTransaction(async () => {
      const product = await Product.findById(req.params.id).session(session);

      if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
      }

      Object.assign(product, req.validatedBody);

      await product.save({ session });

      updatedProduct = product;

      evaluationSummary = await reEvaluateAllApplicants(session);
    });

    return res.status(200).json({
      success: true,
      message: "Product updated and applicants re-evaluated successfully",
      data: {
        product: updatedProduct,
        evaluation: evaluationSummary,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    let deletedProduct;
    let evaluationSummary;

    await session.withTransaction(async () => {
      const product = await Product.findById(req.params.id).session(session);

      if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
      }

      deletedProduct = product;

      await Product.deleteOne({ _id: product._id }, { session });

      evaluationSummary = await reEvaluateAllApplicants(session);
    });

    return res.status(200).json({
      success: true,
      message: "Product deleted and applicants re-evaluated successfully",
      data: {
        product: deletedProduct,
        evaluation: evaluationSummary,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};
