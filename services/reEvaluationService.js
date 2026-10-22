import Applicant from "../models/Applicant.js";
import Product from "../models/Product.js";
import { evaluateApplicant } from "./eligibilityService.js";

export async function reEvaluateAllApplicants(session) {
  const products = await Product.find().session(session).lean();

  const applicants = await Applicant.find().session(session).lean();

  const evaluationDate = new Date();
  const operations = [];

  for (const applicant of applicants) {
    const result = evaluateApplicant(applicant, products, evaluationDate);

    operations.push({
      updateOne: {
        filter: { _id: applicant._id },
        update: {
          $set: {
            status: result.status,
            eligibleProducts: result.eligibleProducts,
            lastEvaluatedAt: result.evaluatedAt,
          },
        },
      },
    });
  }

  if (operations.length > 0) {
    await Applicant.bulkWrite(operations, { session });
  }

  return {
    applicantsEvaluated: applicants.length,
    productsConsidered: products.length,
    evaluatedAt: evaluationDate,
  };
}
