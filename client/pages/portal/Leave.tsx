import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Calendar, Clock, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { LeaveApplication, LeaveBalance, ApiResponse } from "@shared/api";

export default function Leave() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for leave data
  const [leaveApplications, setLeaveApplications] = useState<
    LeaveApplication[]
  >([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    handoverDetails: "",
  });

  // Fetch leave data on component mount
  useEffect(() => {
    if (user?.employeeId) {
      fetchLeaveData();
    }
  }, [user]);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);

      // Fetch leave applications
      const appsResponse = await fetch(
        `/api/leave/employee/${user?.employeeId}`,
      );

      if (!appsResponse.ok) {
        throw new Error(`HTTP error! status: ${appsResponse.status}`);
      }

      const appsData: ApiResponse<LeaveApplication[]> =
        await appsResponse.json();

      if (appsData.success && appsData.data) {
        setLeaveApplications(appsData.data);
      }

      // Fetch leave balance
      const balanceResponse = await fetch(
        `/api/leave/employee/${user?.employeeId}/balance`,
      );

      if (!balanceResponse.ok) {
        throw new Error(`HTTP error! status: ${balanceResponse.status}`);
      }

      const balanceData: ApiResponse<LeaveBalance> =
        await balanceResponse.json();

      if (balanceData.success && balanceData.data) {
        setLeaveBalance(balanceData.data);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
      // For demo purposes, set some default data instead of showing error
      setLeaveApplications([
        {
          id: "DEMO001",
          employeeId: user?.employeeId || "",
          employeeName: user?.name || "",
          leaveType: "annual",
          startDate: "2024-03-15",
          endDate: "2024-03-17",
          days: 3,
          reason: "Family function",
          status: "pending",
          appliedDate: "2024-03-10",
        },
      ]);
      setLeaveBalance({
        employeeId: user?.employeeId || "",
        annual: 18,
        sick: 10,
        casual: 12,
        totalAllocated: 40,
        totalUsed: 8,
        totalRemaining: 32,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (
        !formData.leaveType ||
        !formData.startDate ||
        !formData.endDate ||
        !formData.reason
      ) {
        setError("Please fill in all required fields");
        return;
      }

      const response = await fetch(
        `/api/leave/employee/${user?.employeeId}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leaveType: formData.leaveType,
            startDate: formData.startDate,
            endDate: formData.endDate,
            reason: formData.reason,
            handoverDetails: formData.handoverDetails,
          }),
        },
      );

      const data: ApiResponse<LeaveApplication> = await response.json();

      if (data.success) {
        setSuccess("Leave application submitted successfully!");
        setFormData({
          leaveType: "",
          startDate: "",
          endDate: "",
          reason: "",
          handoverDetails: "",
        });
        fetchLeaveData(); // Refresh the data
      } else {
        setError(data.error || "Failed to submit leave application");
      }
    } catch (error) {
      console.error("Error submitting leave application:", error);
      setError("Failed to submit leave application");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-nalco-green text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "rejected":
        return "bg-nalco-red text-white";
      default:
        return "bg-nalco-gray text-white";
    }
  };

  const formatLeaveType = (type: string) => {
    return (
      type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-nalco-blue" />
            <span className="ml-2 text-nalco-gray">Loading leave data...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/portal")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portal
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-nalco-black">
                Leave Management
              </h1>
              <p className="text-nalco-gray">
                Apply for leave and track your applications
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Leave Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-nalco-black">
                <Calendar className="h-5 w-5 mr-2" />
                Leave Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-nalco-red">
                  {leaveBalance?.totalRemaining || 0}
                </p>
                <p className="text-sm text-nalco-gray">Days Remaining</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Annual Leave</span>
                  <span className="font-medium">
                    {leaveBalance?.annual || 0} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sick Leave</span>
                  <span className="font-medium">
                    {leaveBalance?.sick || 0} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Casual Leave</span>
                  <span className="font-medium">
                    {leaveBalance?.casual || 0} days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Leave Application */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-nalco-black">
                New Leave Application
              </CardTitle>
              <CardDescription>Submit a new leave request</CardDescription>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="leaveType">Leave Type *</Label>
                    <Select
                      value={formData.leaveType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, leaveType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Annual Leave</SelectItem>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="casual">Casual Leave</SelectItem>
                        <SelectItem value="maternity">
                          Maternity Leave
                        </SelectItem>
                        <SelectItem value="paternity">
                          Paternity Leave
                        </SelectItem>
                        <SelectItem value="emergency">
                          Emergency Leave
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">Reason *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for your leave request"
                    rows={3}
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="handoverDetails">Handover Details</Label>
                  <Textarea
                    id="handoverDetails"
                    placeholder="Provide details about task delegation and handover (optional)"
                    rows={2}
                    value={formData.handoverDetails}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        handoverDetails: e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-nalco-blue hover:bg-nalco-blue/90"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Leave History */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-nalco-black">Leave History</CardTitle>
              <CardDescription>
                Your recent leave applications and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaveApplications.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-nalco-gray mx-auto mb-4" />
                  <p className="text-nalco-gray">No leave applications found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaveApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nalco-blue/10">
                          <Clock className="h-5 w-5 text-nalco-blue" />
                        </div>
                        <div>
                          <h4 className="font-medium text-nalco-black">
                            {formatLeaveType(application.leaveType)}
                          </h4>
                          <p className="text-sm text-nalco-gray">
                            {application.startDate} to {application.endDate} •{" "}
                            {application.days} day(s)
                          </p>
                          <p className="text-xs text-nalco-gray">
                            Applied on {application.appliedDate}
                          </p>
                          {application.approvedBy && (
                            <p className="text-xs text-nalco-green">
                              Approved by {application.approvedBy}
                            </p>
                          )}
                          {application.rejectedReason && (
                            <p className="text-xs text-nalco-red">
                              Reason: {application.rejectedReason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
