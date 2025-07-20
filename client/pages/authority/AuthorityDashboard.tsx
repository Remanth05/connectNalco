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

  // Module action states
  const [moduleDialog, setModuleDialog] = useState<{open: boolean, type: string, title: string}>({
    open: false,
    type: "",
    title: ""
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
          const leaveApp = selectedItem || allPendingApprovals.find(app => app.id === id)?.details;
          if (leaveApp) {
            impactMessage += ` Employee ${leaveApp.employeeName} will be on leave for ${leaveApp.days} days. Team capacity temporarily reduced.`;
          }
        }

        if (type === "reimbursement" && action === "approve") {
          const reimb = selectedItem || allPendingApprovals.find(app => app.id === id)?.details;
          if (reimb) {
            impactMessage += ` Department budget impact: -₹${reimb.amount}. Processing payment to ${reimb.employeeName}.`;
          }
        }

        setSuccess(impactMessage);
        setDialogOpen(false);
        setRejectionReason("");
        fetchPendingApprovals(); // Refresh the data

        // Log department activity for interconnection tracking
        console.log(`Department Activity: ${user?.department} - ${type} ${action}d by ${user?.name}`);
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

  const handleModuleAccess = async (moduleType: string, moduleTitle: string) => {
    setModuleLoading(moduleType);
    setError("");
    setSuccess("");

    try {
      // Simulate module access and data loading
      await new Promise(resolve => setTimeout(resolve, 1000));

      setModuleDialog({
        open: true,
        type: moduleType,
        title: moduleTitle
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
                  <Button size="sm" className="bg-nalco-blue hover:bg-nalco-blue/90">
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
                      <Label>Full Name</Label>
                      <Input placeholder="Enter employee name" />
                    </div>
                    <div>
                      <Label>Employee ID</Label>
                      <Input placeholder="EMP###" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input placeholder="employee@nalco.com" type="email" />
                    </div>
                    <div>
                      <Label>Designation</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="executive">Executive</SelectItem>
                          <SelectItem value="assistant">Assistant</SelectItem>
                          <SelectItem value="trainee">Trainee</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Join Date</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input placeholder="+91-9876543210" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-nalco-blue hover:bg-nalco-blue/90">
                      Add Employee
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-2">
              {[
                {
                  name: "Rajesh Kumar Singh",
                  designation: "HR Executive",
                  status: "Active",
                  id: "EMP001",
                  email: "rajesh.singh@nalco.com",
                  phone: "+91-9876543210",
                  joinDate: "2022-03-15"
                },
                {
                  name: "Sunita Devi",
                  designation: "HR Assistant",
                  status: "Active",
                  id: "EMP002",
                  email: "sunita.devi@nalco.com",
                  phone: "+91-9876543213",
                  joinDate: "2021-07-20"
                },
                {
                  name: "Mohammad Alam",
                  designation: "Trainee",
                  status: "On Leave",
                  id: "EMP003",
                  email: "mohammad.alam@nalco.com",
                  phone: "+91-9876543214",
                  joinDate: "2023-11-05"
                },
              ].map((emp, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-nalco-gray/5">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-left hover:text-nalco-blue transition-colors">
                            <p className="font-medium cursor-pointer">{emp.name}</p>
                            <p className="text-sm text-nalco-gray">{emp.designation} • {emp.id}</p>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Employee Profile - {emp.name}</DialogTitle>
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
                                  <SelectItem value="on leave">On Leave</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
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
                      <Badge className={emp.status === "Active" ? "bg-nalco-green text-white" : "bg-yellow-500 text-white"}>
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
                <div key={leave.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{leave.employeeName}</p>
                    <p className="text-sm text-nalco-gray">{leave.leaveType} - {leave.days} days</p>
                    <p className="text-xs text-nalco-gray">{leave.startDate} to {leave.endDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-nalco-green hover:bg-nalco-green/90">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-nalco-red">
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
              <Button size="sm" className="bg-nalco-red hover:bg-nalco-red/90">
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </div>
            <div className="space-y-2">
              {[
                { title: "System Access Issue", priority: "High", status: "Open", reporter: "Kavitha Reddy" },
                { title: "Printer Not Working", priority: "Medium", status: "In Progress", reporter: "Rajesh Kumar" },
                { title: "Training Request", priority: "Low", status: "Resolved", reporter: "Sunita Devi" },
              ].map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{issue.title}</p>
                    <p className="text-sm text-nalco-gray">Reported by: {issue.reporter}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={
                      issue.priority === "High" ? "bg-nalco-red text-white" :
                      issue.priority === "Medium" ? "bg-yellow-500 text-white" :
                      "bg-nalco-blue text-white"
                    }>
                      {issue.priority}
                    </Badge>
                    <Badge className={
                      issue.status === "Open" ? "bg-nalco-red text-white" :
                      issue.status === "In Progress" ? "bg-yellow-500 text-white" :
                      "bg-nalco-green text-white"
                    }>
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
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="space-y-2">
              {pendingReimbursements.map((reimb) => (
                <div key={reimb.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{reimb.employeeName}</p>
                    <p className="text-sm text-nalco-gray">{reimb.type} - ₹{reimb.amount}</p>
                    <p className="text-xs text-nalco-gray">{reimb.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-nalco-green hover:bg-nalco-green/90">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-nalco-red">
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
                  <Button size="sm" className="bg-nalco-blue hover:bg-nalco-blue/90">
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
                          <SelectItem value="attendance">Attendance Report</SelectItem>
                          <SelectItem value="performance">Performance Report</SelectItem>
                          <SelectItem value="leave">Leave Utilization Report</SelectItem>
                          <SelectItem value="training">Training Report</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
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
                          <SelectItem value="all">All Department Employees</SelectItem>
                          <SelectItem value="active">Active Employees Only</SelectItem>
                          <SelectItem value="custom">Custom Selection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Format</Label>
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="pdf" name="format" value="pdf" defaultChecked />
                          <Label htmlFor="pdf">PDF</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="excel" name="format" value="excel" />
                          <Label htmlFor="excel">Excel</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="csv" name="format" value="csv" />
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
                        setSuccess("Report generation started! You'll receive an email when it's ready.");
                        setModuleDialog({open: false, type: "", title: ""});
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
                  <p className="text-sm text-nalco-gray">Current month average</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full">
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
                  <Button size="sm" variant="outline" className="mt-2 w-full">
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
                  <Button size="sm" variant="outline" className="mt-2 w-full">
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
                  <Button size="sm" variant="outline" className="mt-2 w-full">
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
                  { name: "March 2024 Attendance Report", date: "Generated on Apr 1, 2024", type: "PDF" },
                  { name: "Q1 Performance Summary", date: "Generated on Mar 31, 2024", type: "Excel" },
                  { name: "Training Completion Report", date: "Generated on Mar 28, 2024", type: "PDF" }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-nalco-gray">{report.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{report.type}</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
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
                <Button size="sm" className="bg-nalco-blue hover:bg-nalco-blue/90">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { name: "Rajesh Kumar Singh", role: "HR Executive", email: "rajesh.singh@nalco.com", phone: "+91-9876543210" },
                { name: "Sunita Devi", role: "HR Assistant", email: "sunita.devi@nalco.com", phone: "+91-9876543213" },
                { name: "Mohammad Alam", role: "Trainee", email: "mohammad.alam@nalco.com", phone: "+91-9876543214" },
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
  const totalBudgetImpact = pendingReimbursements.reduce((sum, reimb) => sum + reimb.amount, 0);
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
      color: allPendingApprovals.length > 5 ? "text-nalco-red" : "text-yellow-500",
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
                              onClick={() => handleModuleAccess(module.path.split('/').pop() || "", module.title)}
                              disabled={moduleLoading === (module.path.split('/').pop() || "")}
                            >
                              {moduleLoading === (module.path.split('/').pop() || "") ? (
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
              <Button className="w-full bg-nalco-red hover:bg-nalco-red/90">
                <UserCheck className="h-4 w-4 mr-2" />
                Review Pending Approvals
              </Button>
              <Button variant="outline" className="w-full">
                <ClipboardList className="h-4 w-4 mr-2" />
                Generate Department Report
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Add New Employee
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Team Meeting
              </Button>
                            <Button variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
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
          <Card className="lg:col-span-3">
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
                  <div className="text-2xl font-bold text-nalco-green">4.2/5</div>
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
              <CardDescription>How your decisions affect other departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-nalco-green/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">IT Department</p>
                    <p className="text-xs text-nalco-gray">3 system access requests approved</p>
                  </div>
                  <Badge className="bg-nalco-green text-white">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-nalco-blue/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Finance Department</p>
                    <p className="text-xs text-nalco-gray">₹{totalBudgetImpact.toLocaleString()} budget allocation pending</p>
                  </div>
                  <Badge className="bg-nalco-blue text-white">Pending</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-nalco-red/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Operations</p>
                    <p className="text-xs text-nalco-gray">2 employees on approved leave</p>
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
                  type: "leave"
                },
                {
                  action: "Reimbursement Processed",
                  employee: "Sunita Devi",
                  details: "₹3,200 medical reimbursement",
                  impact: "Department budget: ₹3,200 allocated",
                  time: "5 hours ago",
                  type: "reimbursement"
                },
                {
                  action: "New Employee Added",
                  employee: "Training Program",
                  details: "2 new trainees joined HR department",
                  impact: "Team strength increased to 10 members",
                  time: "1 day ago",
                  type: "employee"
                },
                {
                  action: "Issue Resolved",
                  employee: "System Access",
                  details: "IT access issue for new employees",
                  impact: "3 employees now have full system access",
                  time: "2 days ago",
                  type: "issue"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    activity.type === "leave" ? "bg-nalco-blue/10" :
                    activity.type === "reimbursement" ? "bg-nalco-green/10" :
                    activity.type === "employee" ? "bg-nalco-red/10" :
                    "bg-nalco-gray/10"
                  }`}>
                    {activity.type === "leave" && <Calendar className={`h-5 w-5 text-nalco-blue`} />}
                    {activity.type === "reimbursement" && <FileText className={`h-5 w-5 text-nalco-green`} />}
                    {activity.type === "employee" && <Users className={`h-5 w-5 text-nalco-red`} />}
                    {activity.type === "issue" && <AlertTriangle className={`h-5 w-5 text-nalco-gray`} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-nalco-black">{activity.action}</h4>
                      <span className="text-xs text-nalco-gray">{activity.time}</span>
                    </div>
                    <p className="text-sm text-nalco-gray">{activity.employee} - {activity.details}</p>
                    <p className="text-xs text-nalco-blue font-medium">Impact: {activity.impact}</p>
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
      <Dialog open={moduleDialog.open} onOpenChange={(open) => setModuleDialog({...moduleDialog, open})}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-nalco-black">
              {moduleDialog.title}
            </DialogTitle>
            <DialogDescription>
              Manage {moduleDialog.title.toLowerCase()} for your department
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {getModuleContent(moduleDialog.type)}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModuleDialog({open: false, type: "", title: ""})}
            >
              Close
            </Button>
            <Button
              className="bg-nalco-blue hover:bg-nalco-blue/90"
              onClick={() => {
                setSuccess("Actions saved successfully!");
                setModuleDialog({open: false, type: "", title: ""});
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
