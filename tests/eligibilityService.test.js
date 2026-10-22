import test from "node:test";
import assert from "node:assert/strict";

import { evaluateApplicant } from "../services/eligibilityService.js";

const evaluationDate = new Date("2026-10-22T12:00:00Z");

const applicant = {
  dateOfBirth: new Date("1996-06-15T00:00:00Z"),
  creditScore: 720,
  employmentType: "Salaried",
  salaryType: "Cheque",
  monthlySalary: 30000,
};

const product = {
  _id: "product-1",
  minAge: 21,
  maxAge: 58,
  minCreditScore: 700,
  allowedEmploymentTypes: ["Salaried"],
  allowedSalaryTypes: ["Cheque", "DAT"],
  minSalary: 25000,
};

test("applicant qualifies for a matching product", () => {
  const result = evaluateApplicant(applicant, [product], evaluationDate);

  assert.equal(result.status, "Active");
  assert.deepEqual(result.eligibleProducts, ["product-1"]);
  assert.equal(result.age, 30);
});

test("applicant is rejected when no product matches", () => {
  const result = evaluateApplicant(
    { ...applicant, monthlySalary: 20000 },
    [product],
    evaluationDate,
  );

  assert.equal(result.status, "Rejected");
  assert.deepEqual(result.eligibleProducts, []);
});

test("applicant can qualify for multiple products", () => {
  const secondProduct = {
    ...product,
    _id: "product-2",
    minSalary: 20000,
  };

  const result = evaluateApplicant(
    applicant,
    [product, secondProduct],
    evaluationDate,
  );

  assert.equal(result.status, "Active");
  assert.deepEqual(result.eligibleProducts, ["product-1", "product-2"]);
});

test("applicant must meet the minimum salary", () => {
  const result = evaluateApplicant(
    { ...applicant, monthlySalary: 25000 },
    [product],
    evaluationDate,
  );

  assert.equal(result.status, "Active");
});
