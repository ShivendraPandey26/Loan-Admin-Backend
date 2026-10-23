export const overview = {
  projectName: "Loan Products Admin Panel with Eligibility Engine",
  projectType: "Full-Stack Web Application",
  description:
    "An admin panel for managing loan products and applicants, with an eligibility engine that evaluates applicants against configured loan criteria.",

  frontend: {
    framework: "React",
    buildTool: "Vite",
    styling: "Tailwind CSS",
    routing: "React Router",
    httpClient: "Axios",
    icons: "Lucide React",
    deployment: "Vercel",
    url: "https://loanadmins.vercel.app",
  },

  backend: {
    runtime: "Node.js",
    framework: "Express.js",
    database: "MongoDB Atlas",
    odm: "Mongoose",
    validation: "Zod",
    authentication: "JWT",
    deployment: "Render",
  },

  mainFeatures: {
    authentication: [
      "Admin login",
      "JWT-based authentication",
      "Session validation",
      "Logout",
    ],
    loanProducts: [
      "List loan products",
      "Search products by name",
      "Filter by employment type",
      "Filter by salary type",
      "Create loan products",
      "View product details",
      "Edit loan products",
      "Delete loan products",
    ],
    applicants: [
      "List applicants",
      "Search applicants",
      "Pagination",
      "Filter applicants by status",
      "Create applicant records",
      "View applicant details",
      "Edit applicant records",
      "Delete applicant records",
      "Evaluate applicant eligibility",
    ],
    eligibilityEngine: [
      "Minimum and maximum age criteria",
      "Minimum credit score",
      "Minimum monthly salary",
      "Allowed employment types",
      "Allowed salary types",
      "Identify eligible loan products",
      "Re-evaluate applicants when loan products change",
    ],
    dashboard: [
      "Total loan products",
      "Total applicants",
      "Eligible applicants count",
      "Rejected applicants count",
    ],
  },

  dataModels: {
    loanProduct: {
      name: "String",
      description: "String",
      minAge: "Number",
      maxAge: "Number",
      minCreditScore: "Number",
      minSalary: "Number",
      allowedEmploymentTypes: ["Salaried", "Self-Employed"],
      allowedSalaryTypes: ["DAT", "Cash", "Cheque"],
    },
    applicant: {
      fullName: "String",
      email: "String",
      phone: "String",
      dateOfBirth: "Date",
      creditScore: "Number",
      employmentType: ["Salaried", "Self-Employed"],
      salaryType: ["DAT", "Cash", "Cheque"],
      monthlySalary: "Number",
    },
  },

  apiEndpoints: {
    products: [
      "GET /api/products",
      "GET /api/products/:id",
      "POST /api/products",
      "PATCH /api/products/:id",
      "DELETE /api/products/:id",
    ],
    applicants: [
      "GET /api/applicants",
      "GET /api/applicants/:id",
      "POST /api/applicants",
      "PATCH /api/applicants/:id",
      "DELETE /api/applicants/:id",
      "POST /api/applicants/:id/evaluate",
      "GET /api/applicants/:id/eligible-products",
    ],
    authentication: ["POST /api/auth/login", "GET /api/auth/me"],
  },

  security: [
    "JWT authentication",
    "Backend request validation using Zod",
    "Protected administrative routes",
    "CORS configuration",
    "Environment variables for configuration",
  ],

  developmentGuidelines: [
    "Reuse existing components and API utilities",
    "Follow the existing project structure",
    "Use JavaScript and JSX",
    "Use Tailwind CSS for styling",
    "Keep the interface clean, professional, and responsive",
    "Use the backend eligibility engine as the source of truth",
    "Handle loading, empty, success, and error states",
    "Do not hardcode API responses or fake dashboard metrics",
    "Verify backend response shapes before integrating new features",
  ],

  deployment: {
    frontend: "https://loanadmins.vercel.app",
    backend: "Render deployment; actual URL to be configured",
    database: "MongoDB Atlas",
    frontendEnvironmentVariable: "VITE_BACKEND_API_URL",
    backendEnvironmentVariable: "CLIENT_URL",
  },

  itemsToVerify: [
    "Eligible and rejected dashboard metrics are connected to real backend data",
    "Production API URL is configured correctly",
    "Product and applicant delete endpoints are deployed and tested",
    "All listed API routes match the backend implementation",
    "Frontend and backend deployments are working correctly",
  ],
};
