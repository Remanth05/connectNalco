import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

// Import route handlers
import {
  getLeaveApplications,
  getAllLeaveApplications,
  submitLeaveApplication,
  processLeaveApplication,
  getLeaveBalance,
  getPendingLeaveApplications,
} from "./routes/leave";

import {
  getReimbursements,
  getAllReimbursements,
  submitReimbursement,
  processReimbursement,
  getPendingReimbursements,
  getReimbursementStats,
} from "./routes/reimbursement";

import {
  getPayslips,
  getPayslip,
  generatePayslip,
  downloadPayslip,
  getPayslipSummary,
} from "./routes/payslip";

import {
  getEmployees,
  getEmployee,
  getEmployeesByDepartment,
  getReportingStructure,
  getDepartments,
  getDepartmentStats,
  searchEmployees,
} from "./routes/employee";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Leave Management Routes
  app.get("/api/leave/employee/:employeeId", getLeaveApplications);
  app.get("/api/leave/all", getAllLeaveApplications);
  app.post("/api/leave/employee/:employeeId/apply", submitLeaveApplication);
  app.patch("/api/leave/:applicationId/process", processLeaveApplication);
  app.get("/api/leave/employee/:employeeId/balance", getLeaveBalance);
  app.get(
    "/api/leave/authority/:authorityId/pending",
    getPendingLeaveApplications,
  );

  // Reimbursement Management Routes
  app.get("/api/reimbursement/employee/:employeeId", getReimbursements);
  app.get("/api/reimbursement/all", getAllReimbursements);
  app.post(
    "/api/reimbursement/employee/:employeeId/submit",
    submitReimbursement,
  );
  app.patch(
    "/api/reimbursement/:reimbursementId/process",
    processReimbursement,
  );
  app.get(
    "/api/reimbursement/authority/:authorityId/pending",
    getPendingReimbursements,
  );
  app.get(
    "/api/reimbursement/employee/:employeeId/stats",
    getReimbursementStats,
  );

  // Payslip Management Routes
  app.get("/api/payslip/employee/:employeeId", getPayslips);
  app.get("/api/payslip/:payslipId", getPayslip);
  app.post("/api/payslip/employee/:employeeId/generate", generatePayslip);
  app.get("/api/payslip/:payslipId/download", downloadPayslip);
  app.get("/api/payslip/employee/:employeeId/summary", getPayslipSummary);

  // Employee Directory Routes
  app.get("/api/employees", getEmployees);
  app.get("/api/employees/:employeeId", getEmployee);
  app.get("/api/employees/department/:department", getEmployeesByDepartment);
  app.get("/api/employees/:managerId/reports", getReportingStructure);
  app.get("/api/departments", getDepartments);
  app.get("/api/departments/:department/stats", getDepartmentStats);
  app.post("/api/employees/search", searchEmployees);

  return app;
}
