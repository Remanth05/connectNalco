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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { LeaveApplication, Reimbursement, ApiResponse } from "@shared/api";

export default function AuthorityDashboard() {
  const { user } = useAuth();

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
        setSuccess(`${type} ${action}d successfully!`);
        setDialogOpen(false);
        setRejectionReason("");
        fetchPendingApprovals(); // Refresh the data
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

  const departmentStats = [
    {
      title: "Total Employees",
      value: "8", // Based on our mock data
      change: "Active employees",
      icon: Users,
      color: "text-nalco-blue",
    },
    {
      title: "Pending Approvals",
      value: allPendingApprovals.length.toString(),
      change: "Requires attention",
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Leave Applications",
      value: pendingLeaves.length.toString(),
      change: "Pending review",
      icon: Calendar,
      color: "text-nalco-green",
    },
    {
      title: "Reimbursements",
      value: pendingReimbursements.length.toString(),
      change: "Pending approval",
      icon: FileText,
      color: "text-nalco-red",
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-nalco-black">
            Authority Dashboard
          </h1>
          <p className="text-nalco-gray">
            Welcome back, {user?.name}. Manage your department efficiently.
          </p>
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
                            >
                              Access Module
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

        {/* Department Performance */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-nalco-black">
              Department Performance
            </CardTitle>
            <CardDescription>Key metrics for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
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
    </Layout>
  );
}
