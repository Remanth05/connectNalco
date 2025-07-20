import { RequestHandler } from "express";
import {
  LeaveApplication,
  LeaveBalance,
  LeaveApplicationRequest,
  ApiResponse,
  ApprovalAction,
} from "@shared/api";
import {
  mockLeaveApplications,
  mockLeaveBalances,
  mockUsers,
} from "../data/mockData";

// In-memory storage (in real app, this would be a database)
let leaveApplications = [...mockLeaveApplications];
let leaveBalances = [...mockLeaveBalances];

// Get leave applications for an employee
export const getLeaveApplications: RequestHandler = (req, res) => {
  const { employeeId } = req.params;

  try {
    const applications = leaveApplications.filter(
      (app) => app.employeeId === employeeId,
    );
    res.json({ success: true, data: applications });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch leave applications" });
  }
};

// Get all leave applications (for authority/admin)
export const getAllLeaveApplications: RequestHandler = (req, res) => {
  const { status, department } = req.query;

  try {
    let filteredApplications = [...leaveApplications];

    if (status) {
      filteredApplications = filteredApplications.filter(
        (app) => app.status === status,
      );
    }

    if (department) {
      // Filter by department (would need user department data)
      const departmentEmployees = mockUsers
        .filter((user) => user.department === department)
        .map((user) => user.employeeId);
      filteredApplications = filteredApplications.filter((app) =>
        departmentEmployees.includes(app.employeeId),
      );
    }

    res.json({ success: true, data: filteredApplications });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch leave applications" });
  }
};

// Submit leave application
export const submitLeaveApplication: RequestHandler = (req, res) => {
  const { employeeId } = req.params;
  const applicationData: LeaveApplicationRequest = req.body;

  try {
    // Find employee details
    const employee = mockUsers.find((user) => user.employeeId === employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    // Calculate days between start and end date
    const startDate = new Date(applicationData.startDate);
    const endDate = new Date(applicationData.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // Create new leave application
    const newApplication: LeaveApplication = {
      id: `LEAVE${String(leaveApplications.length + 1).padStart(3, "0")}`,
      employeeId,
      employeeName: employee.name,
      leaveType: applicationData.leaveType,
      startDate: applicationData.startDate,
      endDate: applicationData.endDate,
      days,
      reason: applicationData.reason,
      status: "pending",
      appliedDate: new Date().toISOString().split("T")[0],
      handoverDetails: applicationData.handoverDetails,
    };

    leaveApplications.push(newApplication);

    res.status(201).json({
      success: true,
      data: newApplication,
      message: "Leave application submitted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to submit leave application" });
  }
};

// Approve/Reject leave application (for authority/admin)
export const processLeaveApplication: RequestHandler = (req, res) => {
  const { applicationId } = req.params;
  const { action, reason }: ApprovalAction = req.body;
  const { userId } = req.body; // The authority/admin processing the request

  try {
    const applicationIndex = leaveApplications.findIndex(
      (app) => app.id === applicationId,
    );

    if (applicationIndex === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Leave application not found" });
    }

    const application = leaveApplications[applicationIndex];

    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Leave application has already been processed",
      });
    }

    // Find the processing user
    const processingUser = mockUsers.find((user) => user.employeeId === userId);
    if (!processingUser) {
      return res
        .status(404)
        .json({ success: false, error: "Processing user not found" });
    }

    // Update application
    const updatedApplication = {
      ...application,
      status:
        action === "approve" ? ("approved" as const) : ("rejected" as const),
      approvedBy: processingUser.name,
      approvedDate: new Date().toISOString().split("T")[0],
    };

    if (action === "reject" && reason) {
      updatedApplication.rejectedReason = reason;
    }

    leaveApplications[applicationIndex] = updatedApplication;

    // Update leave balance if approved and notify related systems
    if (action === "approve") {
      const balanceIndex = leaveBalances.findIndex(
        (balance) => balance.employeeId === application.employeeId,
      );

      if (balanceIndex !== -1) {
        const balance = leaveBalances[balanceIndex];
        const updatedBalance = {
          ...balance,
          totalUsed: balance.totalUsed + application.days,
          totalRemaining: balance.totalRemaining - application.days,
        };

        // Update specific leave type balance
        switch (application.leaveType) {
          case "annual":
            updatedBalance.annual = Math.max(
              0,
              balance.annual - application.days,
            );
            break;
          case "sick":
            updatedBalance.sick = Math.max(0, balance.sick - application.days);
            break;
          case "casual":
            updatedBalance.casual = Math.max(
              0,
              balance.casual - application.days,
            );
            break;
        }

        leaveBalances[balanceIndex] = updatedBalance;

        // Log department activity for interconnection
        console.log(
          `Department ${processingUser.department}: Leave ${action}d for ${application.employeeName} by ${processingUser.name}`,
        );

        // Update employee status in mock data if needed
        const employeeIndex = mockUsers.findIndex(
          (user) => user.employeeId === application.employeeId,
        );
        if (employeeIndex !== -1) {
          // Could update employee status, last leave date, etc.
          console.log(
            `Employee ${application.employeeName} leave balance updated. Remaining: ${updatedBalance.totalRemaining} days`,
          );
        }
      }
    }

    res.json({
      success: true,
      data: updatedApplication,
      message: `Leave application ${action}d successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to process leave application" });
  }
};

// Get leave balance for an employee
export const getLeaveBalance: RequestHandler = (req, res) => {
  const { employeeId } = req.params;

  try {
    const balance = leaveBalances.find(
      (balance) => balance.employeeId === employeeId,
    );

    if (!balance) {
      // Create default balance if not found
      const defaultBalance: LeaveBalance = {
        employeeId,
        annual: 21,
        sick: 12,
        casual: 7,
        totalAllocated: 40,
        totalUsed: 0,
        totalRemaining: 40,
      };
      leaveBalances.push(defaultBalance);
      return res.json({ success: true, data: defaultBalance });
    }

    res.json({ success: true, data: balance });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch leave balance" });
  }
};

// Get pending leave applications for authority
export const getPendingLeaveApplications: RequestHandler = (req, res) => {
  const { authorityId } = req.params;

  try {
    // Find authority user
    const authority = mockUsers.find((user) => user.employeeId === authorityId);
    if (!authority) {
      return res
        .status(404)
        .json({ success: false, error: "Authority not found" });
    }

    // Get employees under this authority's department
    const departmentEmployees = mockUsers
      .filter((user) => user.department === authority.department)
      .map((user) => user.employeeId);

    // Filter pending applications from department employees
    const pendingApplications = leaveApplications.filter(
      (app) =>
        app.status === "pending" &&
        departmentEmployees.includes(app.employeeId),
    );

    res.json({ success: true, data: pendingApplications });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch pending applications" });
  }
};
