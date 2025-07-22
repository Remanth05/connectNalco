import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building2,
  BarChart3,
  UserCheck,
  ClipboardList,
  Loader2,
  Check,
  X,
  Plus,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LeaveApplication, Reimbursement, ApiResponse } from "@shared/api";
import { useDataSync, syncEmployeeUpdate } from "@/hooks/useDataSync";

export default function AuthorityDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for pending approvals
  const [pendingLeaves, setPendingLeaves] = useState<LeaveApplication[]>([]);
  const [pendingReimbursements, setPendingReimbursements] = useState<
    Reimbursement[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dialog states
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [newEmployeeData, setNewEmployeeData] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    designation: "",
    joinDate: "",
    phone: "",
  });
  const [employeeList, setEmployeeList] = useState([
    {
      name: "Rajesh Kumar Singh",
      designation: "HR Executive",
      status: "Active",
      id: "EMP001",
      email: "rajesh.singh@nalco.com",
      phone: "+91-9876543210",
      joinDate: "2022-03-15",
    },
    {
      name: "Sunita Devi",
      designation: "HR Assistant",
      status: "Active",
      id: "EMP002",
      email: "sunita.devi@nalco.com",
      phone: "+91-9876543213",
      joinDate: "2021-07-20",
    },
    {
      name: "Mohammad Alam",
      designation: "Trainee",
      status: "On Leave",
      id: "EMP003",
      email: "mohammad.alam@nalco.com",
      phone: "+91-9876543214",
      joinDate: "2023-11-05",
    },
  ]);

  // Module action states
  const [moduleDialog, setModuleDialog] = useState<{
    open: boolean;
    type: string;
    title: string;
  }>({
    open: false,
    type: "",
    title: "",
  });
  const [moduleLoading, setModuleLoading] = useState<string | null>(null);

  // Fetch pending approvals on component mount
  useEffect(() => {
    if (user?.employeeId) {
      fetchPendingApprovals();
    }
  }, [user]);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);

      // Fetch pending leave applications
      const leavesResponse = await fetch(
        `/api/leave/authority/${user?.employeeId}/pending`,
      );

      if (!leavesResponse.ok) {
        throw new Error(`HTTP error! status: ${leavesResponse.status}`);
      }

      const leavesData: ApiResponse<LeaveApplication[]> =
        await leavesResponse.json();

      if (leavesData.success && leavesData.data) {
        setPendingLeaves(leavesData.data);
      }

      // Fetch pending reimbursements
      const reimbResponse = await fetch(
        `/api/reimbursement/authority/${user?.employeeId}/pending`,
      );

      if (!reimbResponse.ok) {
        throw new Error(`HTTP error! status: ${reimbResponse.status}`);
      }

      const reimbData: ApiResponse<Reimbursement[]> =
        await reimbResponse.json();

      if (reimbData.success && reimbData.data) {
        setPendingReimbursements(reimbData.data);
      }
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
      // For demo purposes, set some default pending data
      setPendingLeaves([
        {
          id: "LEAVE001",
          employeeId: "EMP001",
          employeeName: "Rajesh Kumar Singh",
          leaveType: "annual",
          startDate: "2024-04-15",
          endDate: "2024-04-17",
          days: 3,
          reason: "Family function - sister's wedding",
          status: "pending",
          appliedDate: "2024-03-20",
        },
      ]);
      setPendingReimbursements([
        {
          id: "REIMB001",
          employeeId: "EMP001",
          employeeName: "Rajesh Kumar Singh",
          type: "travel",
          amount: 2500,
          currency: "INR",
          description: "Travel expenses for training program in Delhi",
          submittedDate: "2024-03-15",
          status: "pending",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (
    id: string,
    type: "leave" | "reimbursement",
    action: "approve" | "reject",
  ) => {
    try {
      setProcessing(id);
      setError("");
      setSuccess("");

      const endpoint =
        type === "leave"
          ? `/api/leave/${id}/process`
          : `/api/reimbursement/${id}/process`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          reason: action === "reject" ? rejectionReason : undefined,
          userId: user?.employeeId,
        }),
      });

      const data: ApiResponse<any> = await response.json();

      if (data.success) {
        // Calculate department impact
        let impactMessage = `${type} ${action}d successfully!`;

        if (type === "leave" && action === "approve") {
          const leaveApp =
            selectedItem ||
            allPendingApprovals.find((app) => app.id === id)?.details;
          if (leaveApp) {
            impactMessage += ` Employee ${leaveApp.employeeName} will be on leave for ${leaveApp.days} days. Team capacity temporarily reduced.`;
          }
        }

        if (type === "reimbursement" && action === "approve") {
          const reimb =
            selectedItem ||
            allPendingApprovals.find((app) => app.id === id)?.details;
          if (reimb) {
            impactMessage += ` Department budget impact: -₹${reimb.amount}. Processing payment to ${reimb.employeeName}.`;
          }
        }

        setSuccess(impactMessage);
        setDialogOpen(false);
        setRejectionReason("");
        fetchPendingApprovals(); // Refresh the data

        // Log department activity for interconnection tracking
        console.log(
          `Department Activity: ${user?.department} - ${type} ${action}d by ${user?.name}`,
        );
      } else {
        setError(data.error || `Failed to ${action} ${type}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing ${type}:`, error);
      setError(`Failed to ${action} ${type}`);
    } finally {
      setProcessing(null);
    }
  };

  const openRejectionDialog = (item: any, type: "leave" | "reimbursement") => {
    setSelectedItem({ ...item, type });
    setDialogOpen(true);
  };

  const handleModuleAccess = async (
    moduleType: string,
    moduleTitle: string,
  ) => {
    setModuleLoading(moduleType);
    setError("");
    setSuccess("");

    try {
      // Simulate module access and data loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setModuleDialog({
        open: true,
        type: moduleType,
        title: moduleTitle,
      });

      setSuccess(`${moduleTitle} module accessed successfully!`);
    } catch (error) {
      setError(`Failed to access ${moduleTitle} module. Please try again.`);
    } finally {
      setModuleLoading(null);
    }
  };

  const getModuleContent = (type: string) => {
    switch (type) {
      case "employees":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Department Employees</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-nalco-blue hover:bg-nalco-blue/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                      Add a new employee to your department
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Full Name *</Label>
                      <Input
                        placeholder="Enter employee name"
                        value={newEmployeeData.fullName}
                        onChange={(e) =>
                          setNewEmployeeData({
                            ...newEmployeeData,
                            fullName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Employee ID *</Label>
                      <Input
                        placeholder="EMP###"
                        value={newEmployeeData.employeeId}
                        onChange={(e) =>
                          setNewEmployeeData({
                            ...newEmployeeData,
                            employeeId: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        placeholder="employee@nalco.com"
                        type="email"
                        value={newEmployeeData.email}
                        onChange={(e) =>
                          setNewEmployeeData({
                            ...newEmployeeData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Designation *</Label>
                      <Select
                        value={newEmployeeData.designation}
                        onValueChange={(value) =>
                          setNewEmployeeData({
                            ...newEmployeeData,
                            designation: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HR Executive">
                            HR Executive
                          </SelectItem>
                          <SelectItem value="HR Assistant">
                            HR Assistant
                          </SelectItem>
                          <SelectItem value="Trainee">Trainee</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Senior Executive">
                            Senior Executive
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Join Date *</Label>
                      <Input
                        type="date"
                        value={newEmployeeData.joinDate}
                        onChange={(e) =>
                          setNewEmployeeData({
                            ...newEmployeeData,
                            joinDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Phone *</Label>
                      <Input
                        placeholder="+91-9876543210"
                        value={newEmployeeData.phone}
                        onChange={(e) =>
                          setNewEmployeeData({
                            ...newEmployeeData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button
                      className="bg-nalco-blue hover:bg-nalco-blue/90"
                      onClick={async () => {
                        // Validate form data
                        if (
                          !newEmployeeData.fullName ||
                          !newEmployeeData.employeeId ||
                          !newEmployeeData.email ||
                          !newEmployeeData.designation ||
                          !newEmployeeData.joinDate ||
                          !newEmployeeData.phone
                        ) {
                          setError("Please fill in all required fields");
                          return;
                        }

                        setProcessing("add-employee");
                        setError("");
                        setSuccess("");

                        try {
                          // Simulate API call
                          await new Promise((resolve) =>
                            setTimeout(resolve, 2000),
                          );

                          const newEmployee = {
                            name: newEmployeeData.fullName,
                            designation: newEmployeeData.designation,
                            status: "Active",
                            id: newEmployeeData.employeeId,
                            email: newEmployeeData.email,
                            phone: newEmployeeData.phone,
                            joinDate: newEmployeeData.joinDate,
                          };

                          setEmployeeList([...employeeList, newEmployee]);

                          // Also add to directory
                          const directoryEmployee = {
                            id: Date.now(),
                            name: newEmployeeData.fullName,
                            position: newEmployeeData.designation,
                            department: "Human Resources", // Default to HR for new employees
                            team: "New Employees",
                            email: newEmployeeData.email,
                            phone: newEmployeeData.phone,
                            location: "Damanjodi Plant",
                            avatar: newEmployeeData.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase(),
                            status: "Available",
                            employeeId: newEmployeeData.employeeId,
                            joinDate: newEmployeeData.joinDate,
                          };

                          // Update directory data in localStorage
                          const existingEmployees = JSON.parse(
                            localStorage.getItem("nalco_employees") || "[]",
                          );
                          const updatedEmployees = [
                            ...existingEmployees,
                            directoryEmployee,
                          ];
                          localStorage.setItem(
                            "nalco_employees",
                            JSON.stringify(updatedEmployees),
                          );

                          setSuccess(
                            `Employee ${newEmployeeData.fullName} (${newEmployeeData.employeeId}) has been added successfully and is now available in the directory!`,
                          );

                          // Reset form
                          setNewEmployeeData({
                            fullName: "",
                            employeeId: "",
                            email: "",
                            designation: "",
                            joinDate: "",
                            phone: "",
                          });

                          // Close dialog
                          setModuleDialog({ open: false, type: "", title: "" });
                        } catch (error) {
                          setError("Failed to add employee. Please try again.");
                        } finally {
                          setProcessing(null);
                        }
                      }}
                      disabled={processing === "add-employee"}
                    >
                      {processing === "add-employee" ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Employee"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-2">
              {employeeList.map((emp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-nalco-gray/5"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-left hover:text-nalco-blue transition-colors">
                            <p className="font-medium cursor-pointer">
                              {emp.name}
                            </p>
                            <p className="text-sm text-nalco-gray">
                              {emp.designation} • {emp.id}
                            </p>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Employee Profile - {emp.name}
                            </DialogTitle>
                            <DialogDescription>
                              View and manage employee information
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <Label>Employee ID</Label>
                                <Input value={emp.id} disabled />
                              </div>
                              <div>
                                <Label>Full Name</Label>
                                <Input value={emp.name} />
                              </div>
                              <div>
                                <Label>Email</Label>
                                <Input value={emp.email} />
                              </div>
                              <div>
                                <Label>Phone</Label>
                                <Input value={emp.phone} />
                              </div>
                              <div>
                                <Label>Designation</Label>
                                <Input value={emp.designation} />
                              </div>
                              <div>
                                <Label>Join Date</Label>
                                <Input value={emp.joinDate} type="date" />
                              </div>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Select value={emp.status.toLowerCase()}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="on leave">
                                    On Leave
                                  </SelectItem>
                                  <SelectItem value="inactive">
                                    Inactive
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Close</Button>
                            <Button className="bg-nalco-green hover:bg-nalco-green/90">
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Badge
                        className={
                          emp.status === "Active"
                            ? "bg-nalco-green text-white"
                            : "bg-yellow-500 text-white"
                        }
                      >
                        {emp.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "leave-approvals":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pending Leave Approvals</h3>
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="space-y-2">
              {pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{leave.employeeName}</p>
                    <p className="text-sm text-nalco-gray">
                      {leave.leaveType} - {leave.days} days
                    </p>
                    <p className="text-xs text-nalco-gray">
                      {leave.startDate} to {leave.endDate}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-nalco-green hover:bg-nalco-green/90"
                      onClick={() =>
                        handleApproval(leave.id, "leave", "approve")
                      }
                      disabled={processing === leave.id}
                    >
                      {processing === leave.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Approve"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-nalco-red"
                      onClick={() => openRejectionDialog(leave, "leave")}
                      disabled={processing === leave.id}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "issues":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Department Issues</h3>
              <Button
                size="sm"
                className="bg-nalco-red hover:bg-nalco-red/90"
                onClick={() => navigate("/issues")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </div>
            <div className="space-y-2">
              {[
                {
                  id: "DEPT-001",
                  title: "System Access Issue",
                  priority: "High",
                  status: "Open",
                  reporter: "Kavitha Reddy",
                  description: "Unable to access department database",
                  assignedTo: "IT Support",
                },
                {
                  id: "DEPT-002",
                  title: "Printer Not Working",
                  priority: "Medium",
                  status: "In Progress",
                  reporter: "Rajesh Kumar",
                  description: "Department printer jamming frequently",
                  assignedTo: "Admin Team",
                },
                {
                  id: "DEPT-003",
                  title: "Training Request",
                  priority: "Low",
                  status: "Resolved",
                  reporter: "Sunita Devi",
                  description: "Request for Excel training for team",
                  assignedTo: "HR Training",
                },
              ].map((issue, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-nalco-gray/5 transition-colors cursor-pointer"
                  onClick={() => {
                    // Navigate to detailed issue view
                    setSelectedItem(issue);
                    setModuleDialog({
                      open: true,
                      type: "issue-detail",
                      title: `Issue Details - ${issue.id}`,
                    });
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-mono text-sm text-nalco-blue">
                        {issue.id}
                      </span>
                      <p className="font-medium">{issue.title}</p>
                    </div>
                    <p className="text-sm text-nalco-gray mb-1">
                      {issue.description}
                    </p>
                    <p className="text-xs text-nalco-gray">
                      Reported by: {issue.reporter} • Assigned to:{" "}
                      {issue.assignedTo}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={
                        issue.priority === "High"
                          ? "bg-nalco-red text-white"
                          : issue.priority === "Medium"
                            ? "bg-yellow-500 text-white"
                            : "bg-nalco-blue text-white"
                      }
                    >
                      {issue.priority}
                    </Badge>
                    <Badge
                      className={
                        issue.status === "Open"
                          ? "bg-nalco-red text-white"
                          : issue.status === "In Progress"
                            ? "bg-yellow-500 text-white"
                            : "bg-nalco-green text-white"
                      }
                    >
                      {issue.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "reimbursements":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pending Reimbursements</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  setProcessing("export-reimbursements");
                  try {
                    // Simulate export process
                    await new Promise((resolve) => setTimeout(resolve, 2000));

                    // Create CSV content
                    const csvContent = `Employee Name,Type,Amount,Description,Status,Date\n${pendingReimbursements
                      .map(
                        (r) =>
                          `${r.employeeName},${r.type},${r.amount},"${r.description}",${r.status},${r.submittedDate}`,
                      )
                      .join("\n")}`;

                    // Download CSV
                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `reimbursements-${new Date().toISOString().split("T")[0]}.csv`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    setSuccess("Reimbursements exported successfully!");
                  } catch (error) {
                    setError("Failed to export reimbursements");
                  } finally {
                    setProcessing(null);
                  }
                }}
                disabled={processing === "export-reimbursements"}
              >
                {processing === "export-reimbursements" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-2">
              {pendingReimbursements.map((reimb) => (
                <div
                  key={reimb.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{reimb.employeeName}</p>
                    <p className="text-sm text-nalco-gray">
                      {reimb.type} - ₹{reimb.amount}
                    </p>
                    <p className="text-xs text-nalco-gray">
                      {reimb.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-nalco-green hover:bg-nalco-green/90"
                      onClick={() =>
                        handleApproval(reimb.id, "reimbursement", "approve")
                      }
                      disabled={processing === reimb.id}
                    >
                      {processing === reimb.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Approve"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-nalco-red"
                      onClick={() =>
                        openRejectionDialog(reimb, "reimbursement")
                      }
                      disabled={processing === reimb.id}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Department Reports</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-nalco-blue hover:bg-nalco-blue/90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Generate Department Report</DialogTitle>
                    <DialogDescription>
                      Create detailed reports for your department
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Report Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="attendance">
                            Attendance Report
                          </SelectItem>
                          <SelectItem value="performance">
                            Performance Report
                          </SelectItem>
                          <SelectItem value="leave">
                            Leave Utilization Report
                          </SelectItem>
                          <SelectItem value="training">
                            Training Report
                          </SelectItem>
                          <SelectItem value="comprehensive">
                            Comprehensive Report
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>From Date</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>To Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div>
                      <Label>Include Employees</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employees" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            All Department Employees
                          </SelectItem>
                          <SelectItem value="active">
                            Active Employees Only
                          </SelectItem>
                          <SelectItem value="custom">
                            Custom Selection
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Format</Label>
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="pdf"
                            name="format"
                            value="pdf"
                            defaultChecked
                          />
                          <Label htmlFor="pdf">PDF</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="excel"
                            name="format"
                            value="excel"
                          />
                          <Label htmlFor="excel">Excel</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="csv"
                            name="format"
                            value="csv"
                          />
                          <Label htmlFor="csv">CSV</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button
                      className="bg-nalco-blue hover:bg-nalco-blue/90"
                      onClick={() => {
                        setSuccess(
                          "Report generation started! You'll receive an email when it's ready.",
                        );
                        setModuleDialog({ open: false, type: "", title: "" });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Attendance Report</h4>
                  <p className="text-2xl font-bold text-nalco-green">94%</p>
                  <p className="text-sm text-nalco-gray">
                    Current month average
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => {
                      setSuccess(
                        "Attendance report details loaded successfully!",
                      );
                      setSelectedItem({
                        type: "attendance",
                        title: "Attendance Report Details",
                        data: {
                          percentage: "94%",
                          details: "Monthly attendance analysis",
                        },
                      });
                      setModuleDialog({
                        open: true,
                        type: "report-detail",
                        title: "Attendance Report Details",
                      });
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Leave Utilization</h4>
                  <p className="text-2xl font-bold text-nalco-blue">68%</p>
                  <p className="text-sm text-nalco-gray">Annual leave taken</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => {
                      setSuccess(
                        "Leave utilization report details loaded successfully!",
                      );
                      setSelectedItem({
                        type: "leave",
                        title: "Leave Utilization Report",
                        data: {
                          percentage: "68%",
                          details: "Annual leave utilization analysis",
                        },
                      });
                      setModuleDialog({
                        open: true,
                        type: "report-detail",
                        title: "Leave Utilization Report",
                      });
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Performance Score</h4>
                  <p className="text-2xl font-bold text-nalco-green">4.2/5</p>
                  <p className="text-sm text-nalco-gray">Department average</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => {
                      setSuccess(
                        "Performance report details loaded successfully!",
                      );
                      setSelectedItem({
                        type: "performance",
                        title: "Performance Score Report",
                        data: {
                          score: "4.2/5",
                          details: "Department performance analysis",
                        },
                      });
                      setModuleDialog({
                        open: true,
                        type: "report-detail",
                        title: "Performance Score Report",
                      });
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Training Hours</h4>
                  <p className="text-2xl font-bold text-nalco-red">156</p>
                  <p className="text-sm text-nalco-gray">Total this quarter</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => {
                      setSuccess(
                        "Training hours report details loaded successfully!",
                      );
                      setSelectedItem({
                        type: "training",
                        title: "Training Hours Report",
                        data: {
                          hours: "156",
                          details: "Quarterly training hours analysis",
                        },
                      });
                      setModuleDialog({
                        open: true,
                        type: "report-detail",
                        title: "Training Hours Report",
                      });
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <h4 className="font-medium mb-3">Recent Reports</h4>
              <div className="space-y-2">
                {[
                  {
                    name: "March 2024 Attendance Report",
                    date: "Generated on Apr 1, 2024",
                    type: "PDF",
                  },
                  {
                    name: "Q1 Performance Summary",
                    date: "Generated on Mar 31, 2024",
                    type: "Excel",
                  },
                  {
                    name: "Training Completion Report",
                    date: "Generated on Mar 28, 2024",
                    type: "PDF",
                  },
                ].map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-nalco-gray">{report.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{report.type}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          setProcessing(`download-${index}`);
                          try {
                            // Simulate download process
                            await new Promise((resolve) =>
                              setTimeout(resolve, 2000),
                            );

                            // Create mock file content
                            const content = `${report.name}\nGenerated: ${report.date}\nType: ${report.type}\n\nThis is a sample ${report.type} report.`;
                            const blob = new Blob([content], {
                              type:
                                report.type === "PDF"
                                  ? "application/pdf"
                                  : "application/vnd.ms-excel",
                            });

                            // Download file
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = `${report.name.replace(/\s+/g, "_")}.${report.type.toLowerCase()}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);

                            setSuccess(
                              `${report.name} downloaded successfully!`,
                            );
                          } catch (error) {
                            setError(`Failed to download ${report.name}`);
                          } finally {
                            setProcessing(null);
                          }
                        }}
                        disabled={processing === `download-${index}`}
                      >
                        {processing === `download-${index}` ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "directory":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Team Directory</h3>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  size="sm"
                  className="bg-nalco-blue hover:bg-nalco-blue/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {[
                {
                  name: "Rajesh Kumar Singh",
                  role: "HR Executive",
                  email: "rajesh.singh@nalco.com",
                  phone: "+91-9876543210",
                },
                {
                  name: "Sunita Devi",
                  role: "HR Assistant",
                  email: "sunita.devi@nalco.com",
                  phone: "+91-9876543213",
                },
                {
                  name: "Mohammad Alam",
                  role: "Trainee",
                  email: "mohammad.alam@nalco.com",
                  phone: "+91-9876543214",
                },
              ].map((contact, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-nalco-gray">{contact.role}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-nalco-blue">{contact.email}</p>
                      <p className="text-nalco-gray">{contact.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "report-detail":
        return (
          <div className="space-y-4">
            {selectedItem && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold">
                    {selectedItem.title}
                  </h3>
                  <p className="text-sm text-nalco-gray mt-2">
                    {selectedItem.data?.details}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-nalco-blue mb-2">
                        {selectedItem.data?.percentage ||
                          selectedItem.data?.score ||
                          selectedItem.data?.hours}
                      </div>
                      <p className="text-sm text-nalco-gray">Current Value</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-nalco-green mb-2">
                        +5%
                      </div>
                      <p className="text-sm text-nalco-gray">vs Last Month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-nalco-red mb-2">
                        Target
                      </div>
                      <p className="text-sm text-nalco-gray">95%</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Detailed Analysis</h4>
                  <div className="bg-nalco-gray/5 p-4 rounded-lg">
                    <p className="text-sm text-nalco-gray">
                      This report provides comprehensive insights into{" "}
                      {selectedItem.type} metrics for the current period. The
                      data shows positive trends and areas for improvement.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    className="bg-nalco-blue hover:bg-nalco-blue/90"
                    onClick={async () => {
                      setProcessing("download-full-report");
                      try {
                        await new Promise((resolve) =>
                          setTimeout(resolve, 2000),
                        );

                        // Create comprehensive report content
                        const reportContent =
                          `${selectedItem.title} - Full Report\n\n` +
                          `Generated: ${new Date().toLocaleDateString()}\n` +
                          `Report Type: ${selectedItem.type}\n` +
                          `Current Value: ${selectedItem.data?.percentage || selectedItem.data?.score || selectedItem.data?.hours}\n\n` +
                          `DETAILED ANALYSIS:\n` +
                          `This comprehensive report provides in-depth insights into ${selectedItem.type} metrics.\n` +
                          `Data shows positive trends with room for improvement in specific areas.\n\n` +
                          `RECOMMENDATIONS:\n` +
                          `1. Continue current performance strategies\n` +
                          `2. Focus on areas showing declining trends\n` +
                          `3. Implement targeted improvement initiatives\n\n` +
                          `HISTORICAL COMPARISON:\n` +
                          `Month-over-month improvement: +5%\n` +
                          `Year-over-year growth: +12%\n` +
                          `Target achievement: 95%`;

                        // Download the report
                        const blob = new Blob([reportContent], {
                          type: "text/plain",
                        });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `${selectedItem.type}_full_report_${new Date().toISOString().split("T")[0]}.txt`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);

                        setSuccess(
                          `${selectedItem.title} full report downloaded successfully!`,
                        );
                      } catch (error) {
                        setError("Failed to download full report");
                      } finally {
                        setProcessing(null);
                      }
                    }}
                    disabled={processing === "download-full-report"}
                  >
                    {processing === "download-full-report" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Full Report
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      setProcessing("view-historical");
                      try {
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1500),
                        );

                        // Create historical data content
                        const historicalData =
                          `${selectedItem.title} - Historical Data\n\n` +
                          `LAST 12 MONTHS TREND:\n` +
                          `Jan 2024: 88%\n` +
                          `Feb 2024: 89%\n` +
                          `Mar 2024: 91%\n` +
                          `Apr 2024: 93%\n` +
                          `May 2024: 92%\n` +
                          `Jun 2024: 94%\n` +
                          `Jul 2024: 95%\n` +
                          `Aug 2024: 93%\n` +
                          `Sep 2024: 96%\n` +
                          `Oct 2024: 94%\n` +
                          `Nov 2024: 95%\n` +
                          `Dec 2024: ${selectedItem.data?.percentage || selectedItem.data?.score || selectedItem.data?.hours}\n\n` +
                          `QUARTERLY AVERAGES:\n` +
                          `Q1 2024: 89.3%\n` +
                          `Q2 2024: 93.0%\n` +
                          `Q3 2024: 94.7%\n` +
                          `Q4 2024: 94.5% (current)\n\n` +
                          `TREND ANALYSIS:\n` +
                          `Overall upward trend with seasonal variations\n` +
                          `Best performance in Q3 2024\n` +
                          `Consistent improvement over the year`;

                        // Download historical data
                        const blob = new Blob([historicalData], {
                          type: "text/plain",
                        });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `${selectedItem.type}_historical_data_${new Date().toISOString().split("T")[0]}.txt`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);

                        setSuccess(
                          `${selectedItem.title} historical data downloaded successfully!`,
                        );
                      } catch (error) {
                        setError("Failed to download historical data");
                      } finally {
                        setProcessing(null);
                      }
                    }}
                    disabled={processing === "view-historical"}
                  >
                    {processing === "view-historical" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        View Historical Data
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      setProcessing("share-report");
                      try {
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1000),
                        );

                        // Create shareable report summary
                        const shareData = {
                          title: `${selectedItem.title} - Department Report`,
                          text: `${selectedItem.title} Summary:\nCurrent Value: ${selectedItem.data?.percentage || selectedItem.data?.score || selectedItem.data?.hours}\nTrend: +5% vs Last Month\nGenerated on: ${new Date().toLocaleDateString()}`,
                          url: window.location.href,
                        };

                        // Try to use Web Share API if available
                        if (navigator.share) {
                          await navigator.share(shareData);
                          setSuccess("Report shared successfully!");
                        } else {
                          // Fallback: copy to clipboard
                          await navigator.clipboard.writeText(
                            `${shareData.title}\n\n${shareData.text}\n\nView full report at: ${shareData.url}`,
                          );
                          setSuccess("Report details copied to clipboard!");
                        }
                      } catch (error) {
                        if (error.name !== "AbortError") {
                          setError("Failed to share report");
                        }
                      } finally {
                        setProcessing(null);
                      }
                    }}
                    disabled={processing === "share-report"}
                  >
                    {processing === "share-report" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      "Share Report"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      case "issue-detail":
        return (
          <div className="space-y-4">
            {selectedItem && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedItem.title}
                    </h3>
                    <p className="text-sm text-nalco-gray">
                      Issue ID: {selectedItem.id}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={
                        selectedItem.priority === "High"
                          ? "bg-nalco-red text-white"
                          : selectedItem.priority === "Medium"
                            ? "bg-yellow-500 text-white"
                            : "bg-nalco-blue text-white"
                      }
                    >
                      {selectedItem.priority}
                    </Badge>
                    <Badge
                      className={
                        selectedItem.status === "Open"
                          ? "bg-nalco-red text-white"
                          : selectedItem.status === "In Progress"
                            ? "bg-yellow-500 text-white"
                            : "bg-nalco-green text-white"
                      }
                    >
                      {selectedItem.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Reported by</Label>
                    <p className="text-sm">{selectedItem.reporter}</p>
                  </div>
                  <div>
                    <Label>Assigned to</Label>
                    <p className="text-sm">{selectedItem.assignedTo}</p>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-nalco-gray">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    className="bg-nalco-blue hover:bg-nalco-blue/90"
                    onClick={() => {
                      setSuccess(
                        `Issue ${selectedItem.id} assigned to team successfully!`,
                      );
                      setModuleDialog({ open: false, type: "", title: "" });
                    }}
                  >
                    Assign to Team
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSuccess(
                        `Issue ${selectedItem.id} status updated successfully!`,
                      );
                      setModuleDialog({ open: false, type: "", title: "" });
                    }}
                  >
                    Update Status
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSuccess(
                        `Comment added to issue ${selectedItem.id} successfully!`,
                      );
                      setModuleDialog({ open: false, type: "", title: "" });
                    }}
                  >
                    Add Comment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSuccess(
                        `Team members notified about issue ${selectedItem.id} successfully!`,
                      );
                      setModuleDialog({ open: false, type: "", title: "" });
                    }}
                  >
                    Notify Members
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <div>Module content not available</div>;
    }
  };

  // Combine pending approvals from both leave and reimbursements
  const allPendingApprovals = [
    ...pendingLeaves.map((leave) => ({
      id: leave.id,
      type: "Leave Application",
      employee: leave.employeeName,
      request: `${leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave - ${leave.days} day(s)`,
      date: `${leave.startDate} to ${leave.endDate}`,
      status: leave.status,
      priority: "normal",
      details: leave,
      itemType: "leave" as const,
    })),
    ...pendingReimbursements.map((reimb) => ({
      id: reimb.id,
      type: "Reimbursement",
      employee: reimb.employeeName,
      request: `${reimb.type.charAt(0).toUpperCase() + reimb.type.slice(1)} - ₹${reimb.amount}`,
      date: reimb.submittedDate,
      status: reimb.status,
      priority: reimb.amount > 5000 ? "high" : "normal",
      details: reimb,
      itemType: "reimbursement" as const,
    })),
  ];

  // Calculate dynamic department stats with real-time updates
  const totalBudgetImpact = pendingReimbursements.reduce(
    (sum, reimb) => sum + reimb.amount,
    0,
  );
  const departmentEmployeeCount = 8; // Based on HR department in mockData
  const activeIssues = 15; // From department performance data

  const departmentStats = [
    {
      title: "Total Employees",
      value: departmentEmployeeCount.toString(),
      change: "Active employees",
      icon: Users,
      color: "text-nalco-blue",
    },
    {
      title: "Pending Approvals",
      value: allPendingApprovals.length.toString(),
      change: `${allPendingApprovals.length > 5 ? "High" : "Normal"} workload`,
      icon: Clock,
      color:
        allPendingApprovals.length > 5 ? "text-nalco-red" : "text-yellow-500",
    },
    {
      title: "Budget Impact",
      value: `₹${totalBudgetImpact.toLocaleString()}`,
      change: "Pending reimbursements",
      icon: FileText,
      color: "text-nalco-red",
    },
    {
      title: "Department Score",
      value: "94%",
      change: "Overall efficiency",
      icon: BarChart3,
      color: "text-nalco-green",
    },
  ];

  const authorityModules = [
    {
      title: "Employee Management",
      description: "Manage team members, attendance, and performance",
      icon: Users,
      path: "/authority/employees",
      color: "bg-nalco-blue/10 text-nalco-blue",
    },
    {
      title: "Leave Approvals",
      description: "Review and approve leave applications",
      icon: Calendar,
      path: "/authority/leave-approvals",
      color: "bg-nalco-green/10 text-nalco-green",
    },
    {
      title: "Issue Management",
      description: "Handle departmental issues and complaints",
      icon: FileText,
      path: "/authority/issues",
      color: "bg-nalco-red/10 text-nalco-red",
    },
    {
      title: "Reimbursement Review",
      description: "Approve expense reimbursements",
      icon: CheckCircle,
      path: "/authority/reimbursements",
      color: "bg-nalco-green/10 text-nalco-green",
    },
    {
      title: "Department Reports",
      description: "View department performance and analytics",
      icon: BarChart3,
      path: "/authority/reports",
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Team Directory",
      description: "Manage team structure and contact information",
      icon: Building2,
      path: "/authority/directory",
      color: "bg-nalco-gray/10 text-nalco-gray",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-nalco-red text-white";
      case "high":
        return "bg-yellow-500 text-white";
      default:
        return "bg-nalco-blue text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-nalco-green text-white";
      case "rejected":
        return "bg-nalco-red text-white";
      default:
        return "bg-yellow-500 text-white";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-nalco-black">
              Authority Dashboard
            </h1>
            <p className="text-nalco-gray">
              Welcome back, {user?.name}. Manage your department efficiently.
            </p>
          </div>
          <Button
            className="bg-nalco-red hover:bg-nalco-red/90"
            onClick={() => navigate("/issues")}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        </div>

        {/* Department Statistics */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          {departmentStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="flex items-center p-6">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-nalco-gray">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-nalco-black">
                      {stat.value}
                    </p>
                    <p className="text-xs text-nalco-green">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Authority Modules */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-nalco-black">
                Department Management
              </CardTitle>
              <CardDescription>
                Access departmental management features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {authorityModules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${module.color}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-nalco-black">
                              {module.title}
                            </h4>
                            <p className="text-sm text-nalco-gray mb-3">
                              {module.description}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() =>
                                handleModuleAccess(
                                  module.path.split("/").pop() || "",
                                  module.title,
                                )
                              }
                              disabled={
                                moduleLoading ===
                                (module.path.split("/").pop() || "")
                              }
                            >
                              {moduleLoading ===
                              (module.path.split("/").pop() || "") ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Loading...
                                </>
                              ) : (
                                "Access Module"
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-nalco-black">Quick Actions</CardTitle>
              <CardDescription>Frequently used actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-nalco-red hover:bg-nalco-red/90"
                onClick={() => {
                  // Scroll to pending approvals section
                  const pendingSection =
                    document.querySelector(
                      '[data-testid="pending-approvals"]',
                    ) ||
                    document
                      .querySelector("h1")
                      .parentElement?.parentElement?.querySelector(
                        "div:nth-of-type(3)",
                      );
                  if (pendingSection) {
                    pendingSection.scrollIntoView({ behavior: "smooth" });
                  }
                  setSuccess("Navigated to pending approvals section!");
                }}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Review Pending Approvals
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  handleModuleAccess("reports", "Department Reports")
                }
                disabled={moduleLoading === "reports"}
              >
                {moduleLoading === "reports" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Generate Department Report
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  handleModuleAccess("employees", "Employee Management")
                }
                disabled={moduleLoading === "employees"}
              >
                {moduleLoading === "employees" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Add New Employee
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={async () => {
                  setProcessing("schedule-meeting");
                  setError("");
                  setSuccess("");

                  try {
                    await new Promise((resolve) => setTimeout(resolve, 2000));

                    // Create meeting details
                    const meetingId = `MEET${Date.now()}`;
                    const meetingTime = new Date();
                    meetingTime.setDate(meetingTime.getDate() + 7); // Schedule for next week

                    setSuccess(
                      `Team meeting scheduled successfully!\n` +
                        `Meeting ID: ${meetingId}\n` +
                        `Date: ${meetingTime.toLocaleDateString()}\n` +
                        `Time: 10:00 AM\n` +
                        `Location: Conference Room A\n` +
                        `Invitations sent to all team members.`,
                    );
                  } catch (error) {
                    setError(
                      "Failed to schedule team meeting. Please try again.",
                    );
                  } finally {
                    setProcessing(null);
                  }
                }}
                disabled={processing === "schedule-meeting"}
              >
                {processing === "schedule-meeting" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Team Meeting
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={async () => {
                  setProcessing("view-analytics");
                  setError("");
                  setSuccess("");

                  try {
                    await new Promise((resolve) => setTimeout(resolve, 1500));

                    // Generate analytics summary
                    const analyticsData =
                      `DEPARTMENT ANALYTICS SUMMARY\n\n` +
                      `Performance Metrics:\n` +
                      `- Attendance Rate: 94%\n` +
                      `- Project Completion: 87%\n` +
                      `- Team Satisfaction: 4.2/5\n` +
                      `- Productivity Index: 92%\n\n` +
                      `Key Insights:\n` +
                      `- 15% improvement in efficiency this quarter\n` +
                      `- Reduced resolution time by 23%\n` +
                      `- Enhanced collaboration scores\n\n` +
                      `Generated: ${new Date().toLocaleString()}`;

                    // Create and download analytics file
                    const blob = new Blob([analyticsData], {
                      type: "text/plain",
                    });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `department_analytics_${new Date().toISOString().split("T")[0]}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    setSuccess(
                      "Department analytics generated and downloaded successfully!",
                    );
                  } catch (error) {
                    setError("Failed to generate analytics. Please try again.");
                  } finally {
                    setProcessing(null);
                  }
                }}
                disabled={processing === "view-analytics"}
              >
                {processing === "view-analytics" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full text-nalco-red hover:text-nalco-red border-nalco-red"
                onClick={() => navigate("/issues")}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="lg:col-span-3" data-testid="pending-approvals">
            <CardHeader>
              <CardTitle className="text-nalco-black">
                Pending Approvals
              </CardTitle>
              <CardDescription>
                Items requiring your immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mb-4 border-nalco-green bg-nalco-green/10">
                  <AlertDescription className="text-nalco-green">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-nalco-blue" />
                  <span className="ml-2 text-nalco-gray">
                    Loading pending approvals...
                  </span>
                </div>
              ) : allPendingApprovals.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-nalco-green mx-auto mb-4" />
                  <p className="text-nalco-gray">No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allPendingApprovals.map((approval) => (
                    <div
                      key={approval.id}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-nalco-gray/10">
                          <ClipboardList className="h-6 w-6 text-nalco-gray" />
                        </div>
                        <div>
                          <h4 className="font-medium text-nalco-black">
                            {approval.type} - {approval.employee}
                          </h4>
                          <p className="text-sm text-nalco-gray">
                            {approval.request}
                          </p>
                          <p className="text-xs text-nalco-gray">
                            Date: {approval.date}
                          </p>
                          {approval.itemType === "leave" &&
                            approval.details.reason && (
                              <p className="text-xs text-nalco-blue">
                                Reason: {approval.details.reason}
                              </p>
                            )}
                          {approval.itemType === "reimbursement" &&
                            approval.details.description && (
                              <p className="text-xs text-nalco-blue">
                                Description: {approval.details.description}
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(approval.priority)}>
                          {approval.priority}
                        </Badge>
                        <Button
                          size="sm"
                          className="bg-nalco-green hover:bg-nalco-green/90"
                          onClick={() =>
                            handleApproval(
                              approval.id,
                              approval.itemType,
                              "approve",
                            )
                          }
                          disabled={processing === approval.id}
                        >
                          {processing === approval.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-nalco-red hover:text-nalco-red"
                          onClick={() =>
                            openRejectionDialog(
                              approval.details,
                              approval.itemType,
                            )
                          }
                          disabled={processing === approval.id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Department Performance & Interconnections */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-nalco-black">
                Department Performance
              </CardTitle>
              <CardDescription>Key metrics for this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-nalco-green">94%</div>
                  <p className="text-sm text-nalco-gray">Attendance Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-nalco-blue">87%</div>
                  <p className="text-sm text-nalco-gray">Project Completion</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-nalco-red">15</div>
                  <p className="text-sm text-nalco-gray">Open Issues</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-nalco-green">
                    4.2/5
                  </div>
                  <p className="text-sm text-nalco-gray">Team Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-nalco-black">
                Cross-Department Impact
              </CardTitle>
              <CardDescription>
                How your decisions affect other departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-nalco-green/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">IT Department</p>
                    <p className="text-xs text-nalco-gray">
                      3 system access requests approved
                    </p>
                  </div>
                  <Badge className="bg-nalco-green text-white">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-nalco-blue/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Finance Department</p>
                    <p className="text-xs text-nalco-gray">
                      ₹{totalBudgetImpact.toLocaleString()} budget allocation
                      pending
                    </p>
                  </div>
                  <Badge className="bg-nalco-blue text-white">Pending</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-nalco-red/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Operations</p>
                    <p className="text-xs text-nalco-gray">
                      2 employees on approved leave
                    </p>
                  </div>
                  <Badge className="bg-nalco-red text-white">Impact</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Department Activities */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-nalco-black">
              Recent Department Activities
            </CardTitle>
            <CardDescription>
              Track all department actions and their system-wide effects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Leave Approved",
                  employee: "Rajesh Kumar Singh",
                  details: "3 days annual leave (April 15-17)",
                  impact: "Recruiting team capacity reduced by 25%",
                  time: "2 hours ago",
                  type: "leave",
                },
                {
                  action: "Reimbursement Processed",
                  employee: "Sunita Devi",
                  details: "₹3,200 medical reimbursement",
                  impact: "Department budget: ₹3,200 allocated",
                  time: "5 hours ago",
                  type: "reimbursement",
                },
                {
                  action: "New Employee Added",
                  employee: "Training Program",
                  details: "2 new trainees joined HR department",
                  impact: "Team strength increased to 10 members",
                  time: "1 day ago",
                  type: "employee",
                },
                {
                  action: "Issue Resolved",
                  employee: "System Access",
                  details: "IT access issue for new employees",
                  impact: "3 employees now have full system access",
                  time: "2 days ago",
                  type: "issue",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 border rounded-lg"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      activity.type === "leave"
                        ? "bg-nalco-blue/10"
                        : activity.type === "reimbursement"
                          ? "bg-nalco-green/10"
                          : activity.type === "employee"
                            ? "bg-nalco-red/10"
                            : "bg-nalco-gray/10"
                    }`}
                  >
                    {activity.type === "leave" && (
                      <Calendar className={`h-5 w-5 text-nalco-blue`} />
                    )}
                    {activity.type === "reimbursement" && (
                      <FileText className={`h-5 w-5 text-nalco-green`} />
                    )}
                    {activity.type === "employee" && (
                      <Users className={`h-5 w-5 text-nalco-red`} />
                    )}
                    {activity.type === "issue" && (
                      <AlertTriangle className={`h-5 w-5 text-nalco-gray`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-nalco-black">
                        {activity.action}
                      </h4>
                      <span className="text-xs text-nalco-gray">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-nalco-gray">
                      {activity.employee} - {activity.details}
                    </p>
                    <p className="text-xs text-nalco-blue font-medium">
                      Impact: {activity.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject{" "}
              {selectedItem?.type === "leave"
                ? "Leave Application"
                : "Reimbursement"}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this{" "}
              {selectedItem?.type === "leave"
                ? "leave application"
                : "reimbursement request"}
              .
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Reason for Rejection</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Please provide a clear reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedItem &&
                handleApproval(selectedItem.id, selectedItem.type, "reject")
              }
              disabled={
                !rejectionReason.trim() || processing === selectedItem?.id
              }
            >
              {processing === selectedItem?.id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Module Access Dialog */}
      <Dialog
        open={moduleDialog.open}
        onOpenChange={(open) => setModuleDialog({ ...moduleDialog, open })}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-nalco-black">
              {moduleDialog.title}
            </DialogTitle>
            <DialogDescription>
              Manage {moduleDialog.title.toLowerCase()} for your department
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">{getModuleContent(moduleDialog.type)}</div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setModuleDialog({ open: false, type: "", title: "" })
              }
            >
              Close
            </Button>
            <Button
              className="bg-nalco-blue hover:bg-nalco-blue/90"
              onClick={() => {
                setSuccess("Actions saved successfully!");
                setModuleDialog({ open: false, type: "", title: "" });
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
