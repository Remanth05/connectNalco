/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// User types
export interface User {
  employeeId: string;
  name: string;
  email: string;
  role: "employee" | "authority" | "admin";
  department: string;
  designation: string;
  joinDate: string;
  reportingManager?: string;
  phone: string;
  isActive: boolean;
}

// Leave Management
export interface LeaveApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType:
    | "annual"
    | "sick"
    | "casual"
    | "maternity"
    | "paternity"
    | "emergency";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectedReason?: string;
  handoverDetails?: string;
}

export interface LeaveBalance {
  employeeId: string;
  annual: number;
  sick: number;
  casual: number;
  totalAllocated: number;
  totalUsed: number;
  totalRemaining: number;
}

// Reimbursement Management
export interface Reimbursement {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "travel" | "medical" | "food" | "accommodation" | "training" | "other";
  amount: number;
  currency: string;
  description: string;
  receiptUrl?: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected" | "paid";
  approvedBy?: string;
  approvedDate?: string;
  rejectedReason?: string;
  paymentDate?: string;
  paymentReference?: string;
}

// Payslip Management
export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  overtime: number;
  bonus: number;
  grossSalary: number;
  pf: number;
  esi: number;
  tax: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  generatedDate: string;
  paidDate?: string;
  status: "generated" | "paid";
}

// Attendance Management
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workingHours?: number;
  overtimeHours?: number;
  status: "present" | "absent" | "half-day" | "leave" | "holiday";
  location?: string;
  remarks?: string;
}

export interface AttendanceSummary {
  employeeId: string;
  month: string;
  year: number;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  holidays: number;
  totalHours: number;
  overtimeHours: number;
  attendancePercentage: number;
}

// Employee Directory
export interface Employee {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  reportingManager?: string;
  location: string;
  extension?: string;
  profilePicture?: string;
  skills?: string[];
  joinDate: string;
  isActive: boolean;
}

// Facility Management
export interface Facility {
  id: string;
  name: string;
  type:
    | "meeting-room"
    | "conference-hall"
    | "auditorium"
    | "cafeteria"
    | "parking"
    | "other";
  capacity: number;
  location: string;
  amenities: string[];
  isActive: boolean;
}

export interface FacilityBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendees: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  approvedBy?: string;
  rejectedReason?: string;
  bookingDate: string;
}

// Department Management (for Authority users)
export interface Department {
  id: string;
  name: string;
  head: string;
  headEmployeeId: string;
  totalEmployees: number;
  location: string;
  budget: number;
  isActive: boolean;
}

export interface DepartmentStats {
  departmentId: string;
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  pendingApprovals: number;
  avgAttendance: number;
  activeIssues: number;
}

// Issues/Complaints Management
export interface Issue {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  category: "technical" | "hr" | "facility" | "policy" | "grievance" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  assignedTo?: string;
  assignedToName?: string;
  createdDate: string;
  updatedDate: string;
  resolvedDate?: string;
  resolution?: string;
  attachments?: string[];
}

// Admin Management
export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalDepartments: number;
  pendingApprovals: number;
  systemUptime: string;
  storageUsed: string;
  lastBackup: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Request types
export interface LeaveApplicationRequest {
  leaveType: LeaveApplication["leaveType"];
  startDate: string;
  endDate: string;
  reason: string;
  handoverDetails?: string;
}

export interface ReimbursementRequest {
  type: Reimbursement["type"];
  amount: number;
  description: string;
  receiptFile?: File;
}

export interface FacilityBookingRequest {
  facilityId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendees: number;
}

export interface IssueRequest {
  title: string;
  description: string;
  category: Issue["category"];
  priority: Issue["priority"];
  attachments?: File[];
}

// Approval actions
export interface ApprovalAction {
  id: string;
  action: "approve" | "reject";
  reason?: string;
}
