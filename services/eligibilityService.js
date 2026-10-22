function calculateAge(dateOfBirth, evaluationDate = new Date()) {
  const dob = new Date(dateOfBirth);
  const today = new Date(evaluationDate);

  if (
    Number.isNaN(dob.getTime()) ||
    Number.isNaN(today.getTime()) ||
    dob > today
  ) {
    throw new Error("Invalid date of birth or evaluation date");
  }

  let age = today.getUTCFullYear() - dob.getUTCFullYear();

  const hasBirthdayOccurred =
    today.getUTCMonth() > dob.getUTCMonth() ||
    (today.getUTCMonth() === dob.getUTCMonth() &&
      today.getUTCDate() >= dob.getUTCDate());

  if (!hasBirthdayOccurred) {
    age--;
  }

  return age;
}

export function evaluateApplicant(
  applicant,
  products,
  evaluationDate = new Date(),
) {
  const age = calculateAge(applicant.dateOfBirth, evaluationDate);

  const eligibleProducts = products.filter((product) => {
    const ageMatches = age >= product.minAge && age <= product.maxAge;

    const creditScoreMatches = applicant.creditScore >= product.minCreditScore;

    const employmentMatches = product.allowedEmploymentTypes.includes(
      applicant.employmentType,
    );

    const salaryTypeMatches = product.allowedSalaryTypes.includes(
      applicant.salaryType,
    );

    const salaryMatches = applicant.monthlySalary >= product.minSalary;

    return (
      ageMatches &&
      creditScoreMatches &&
      employmentMatches &&
      salaryTypeMatches &&
      salaryMatches
    );
  });

  return {
    status: eligibleProducts.length > 0 ? "Active" : "Rejected",
    eligibleProducts: eligibleProducts.map((product) => product._id),
    age,
    evaluatedAt: new Date(evaluationDate),
  };
}
