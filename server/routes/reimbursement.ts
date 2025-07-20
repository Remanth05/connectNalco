import { RequestHandler } from "express";
import {
  Reimbursement,
  ReimbursementRequest,
  ApiResponse,
  ApprovalAction,
} from "@shared/api";
import { mockReimbursements, mockUsers } from "../data/mockData";

// In-memory storage
let reimbursements = [...mockReimbursements];

// Get reimbursements for an employee
export const getReimbursements: RequestHandler = (req, res) => {
  const { employeeId } = req.params;

  try {
    const employeeReimbursements = reimbursements.filter(
      (reimb) => reimb.employeeId === employeeId,
    );
    res.json({ success: true, data: employeeReimbursements });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch reimbursements" });
  }
};

// Get all reimbursements (for authority/admin)
export const getAllReimbursements: RequestHandler = (req, res) => {
  const { status, department } = req.query;

  try {
    let filteredReimbursements = [...reimbursements];

    if (status) {
      filteredReimbursements = filteredReimbursements.filter(
        (reimb) => reimb.status === status,
      );
    }

    if (department) {
      const departmentEmployees = mockUsers
        .filter((user) => user.department === department)
        .map((user) => user.employeeId);
      filteredReimbursements = filteredReimbursements.filter((reimb) =>
        departmentEmployees.includes(reimb.employeeId),
      );
    }

    res.json({ success: true, data: filteredReimbursements });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch reimbursements" });
  }
};

// Submit reimbursement request
export const submitReimbursement: RequestHandler = (req, res) => {
  const { employeeId } = req.params;
  const reimbursementData: ReimbursementRequest = req.body;

  try {
    const employee = mockUsers.find((user) => user.employeeId === employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    const newReimbursement: Reimbursement = {
      id: `REIMB${String(reimbursements.length + 1).padStart(3, "0")}`,
      employeeId,
      employeeName: employee.name,
      type: reimbursementData.type,
      amount: reimbursementData.amount,
      currency: "INR",
      description: reimbursementData.description,
      submittedDate: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    reimbursements.push(newReimbursement);

    res.status(201).json({
      success: true,
      data: newReimbursement,
      message: "Reimbursement request submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to submit reimbursement request",
    });
  }
};

// Process reimbursement (approve/reject)
export const processReimbursement: RequestHandler = (req, res) => {
  const { reimbursementId } = req.params;
  const { action, reason }: ApprovalAction = req.body;
  const { userId } = req.body;

  try {
    const reimbursementIndex = reimbursements.findIndex(
      (reimb) => reimb.id === reimbursementId,
    );

    if (reimbursementIndex === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Reimbursement not found" });
    }

    const reimbursement = reimbursements[reimbursementIndex];

    if (reimbursement.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Reimbursement has already been processed",
      });
    }

    const processingUser = mockUsers.find((user) => user.employeeId === userId);
    if (!processingUser) {
      return res
        .status(404)
        .json({ success: false, error: "Processing user not found" });
    }

    const updatedReimbursement = {
      ...reimbursement,
      status:
        action === "approve" ? ("approved" as const) : ("rejected" as const),
      approvedBy: processingUser.name,
      approvedDate: new Date().toISOString().split("T")[0],
    };

    if (action === "reject" && reason) {
      updatedReimbursement.rejectedReason = reason;
    }

    reimbursements[reimbursementIndex] = updatedReimbursement;

    // Log department activity for interconnection
    console.log(
      `Department ${processingUser.department}: Reimbursement ${action}d for ${reimbursement.employeeName} by ${processingUser.name}`,
    );
    console.log(
      `Amount: ₹${reimbursement.amount} for ${reimbursement.type} - ${reimbursement.description}`,
    );

    // Update department budget tracking if approved
    if (action === "approve") {
      console.log(
        `Department ${processingUser.department} budget impact: -₹${reimbursement.amount}`,
      );
    }

    // Notify employee about status change (in real system would send email/notification)
    console.log(
      `Notification sent to ${reimbursement.employeeName}: Reimbursement ${action}d`,
    );

    res.json({
      success: true,
      data: updatedReimbursement,
      message: `Reimbursement ${action}d successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to process reimbursement" });
  }
};

// Get pending reimbursements for authority
export const getPendingReimbursements: RequestHandler = (req, res) => {
  const { authorityId } = req.params;

  try {
    const authority = mockUsers.find((user) => user.employeeId === authorityId);
    if (!authority) {
      return res
        .status(404)
        .json({ success: false, error: "Authority not found" });
    }

    const departmentEmployees = mockUsers
      .filter((user) => user.department === authority.department)
      .map((user) => user.employeeId);

    const pendingReimbursements = reimbursements.filter(
      (reimb) =>
        reimb.status === "pending" &&
        departmentEmployees.includes(reimb.employeeId),
    );

    res.json({ success: true, data: pendingReimbursements });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch pending reimbursements",
    });
  }
};

// Get reimbursement statistics
export const getReimbursementStats: RequestHandler = (req, res) => {
  const { employeeId } = req.params;

  try {
    const employeeReimbursements = reimbursements.filter(
      (reimb) => reimb.employeeId === employeeId,
    );

    const stats = {
      total: employeeReimbursements.length,
      pending: employeeReimbursements.filter((r) => r.status === "pending")
        .length,
      approved: employeeReimbursements.filter((r) => r.status === "approved")
        .length,
      rejected: employeeReimbursements.filter((r) => r.status === "rejected")
        .length,
      totalAmount: employeeReimbursements.reduce((sum, r) => sum + r.amount, 0),
      approvedAmount: employeeReimbursements
        .filter((r) => r.status === "approved")
        .reduce((sum, r) => sum + r.amount, 0),
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch reimbursement stats" });
  }
};
