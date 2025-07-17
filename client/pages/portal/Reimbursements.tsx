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
import { ArrowLeft, CreditCard, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Reimbursement, ApiResponse } from "@shared/api";

export default function Reimbursements() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    description: "",
  });

  // Fetch reimbursements data
  useEffect(() => {
    if (user?.employeeId) {
      fetchReimbursements();
      fetchStats();
    }
  }, [user]);

  const fetchReimbursements = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/reimbursement/employee/${user?.employeeId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Reimbursement[]> = await response.json();

      if (data.success && data.data) {
        setReimbursements(data.data);
      }
    } catch (error) {
      console.error("Error fetching reimbursements:", error);
      // For demo purposes, set some default data
      setReimbursements([
        {
          id: "DEMO001",
          employeeId: user?.employeeId || "",
          employeeName: user?.name || "",
          type: "travel",
          amount: 2500,
          currency: "INR",
          description: "Travel expenses for training program",
          submittedDate: "2024-03-15",
          status: "pending",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `/api/reimbursement/employee/${user?.employeeId}/stats`,
      );
      const data: ApiResponse<any> = await response.json();

      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching reimbursement stats:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.type || !formData.amount || !formData.description) {
        setError("Please fill in all required fields");
        return;
      }

      const response = await fetch(
        `/api/reimbursement/employee/${user?.employeeId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: formData.type,
            amount: parseFloat(formData.amount),
            description: formData.description,
          }),
        },
      );

      const data: ApiResponse<Reimbursement> = await response.json();

      if (data.success) {
        setSuccess("Reimbursement request submitted successfully!");
        setFormData({
          type: "",
          amount: "",
          description: "",
        });
        fetchReimbursements();
        fetchStats();
      } else {
        setError(data.error || "Failed to submit reimbursement request");
      }
    } catch (error) {
      console.error("Error submitting reimbursement:", error);
      setError("Failed to submit reimbursement request");
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
      case "paid":
        return "bg-nalco-blue text-white";
      default:
        return "bg-nalco-gray text-white";
    }
  };

  const formatReimbursementType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-nalco-blue" />
            <span className="ml-2 text-nalco-gray">
              Loading reimbursements...
            </span>
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
                Reimbursements
              </h1>
              <p className="text-nalco-gray">
                Submit and track your expense reimbursements
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Reimbursement Stats */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center text-nalco-black">
                <CreditCard className="h-5 w-5 mr-2" />
                Reimbursement Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <Card>
                  <CardContent className="flex items-center p-6">
                    <CreditCard className="h-8 w-8 text-nalco-green" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-nalco-gray">
                        Total Approved
                      </p>
                      <p className="text-2xl font-bold text-nalco-black">
                        ₹{stats?.approvedAmount.toLocaleString() || 0}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center p-6">
                    <CreditCard className="h-8 w-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-nalco-gray">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-nalco-black">
                        {stats?.pending || 0}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center p-6">
                    <CreditCard className="h-8 w-8 text-nalco-blue" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-nalco-gray">
                        Approved
                      </p>
                      <p className="text-2xl font-bold text-nalco-black">
                        {stats?.approved || 0}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center p-6">
                    <CreditCard className="h-8 w-8 text-nalco-red" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-nalco-gray">
                        Rejected
                      </p>
                      <p className="text-2xl font-bold text-nalco-black">
                        {stats?.rejected || 0}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* New Reimbursement Request */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-nalco-black">
                New Reimbursement Request
              </CardTitle>
              <CardDescription>
                Submit a new expense reimbursement
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Expense Category *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select expense category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="food">Food & Meals</SelectItem>
                      <SelectItem value="accommodation">
                        Accommodation
                      </SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about the expense"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-nalco-blue hover:bg-nalco-blue/90"
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
                      Submit Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Reimbursements */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-nalco-black">
                Recent Requests
              </CardTitle>
              <CardDescription>
                Your recent reimbursement requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reimbursements.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-nalco-gray mx-auto mb-4" />
                  <p className="text-nalco-gray">
                    No reimbursement requests found
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reimbursements.slice(0, 5).map((reimbursement) => (
                    <div
                      key={reimbursement.id}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-nalco-blue/10">
                          <CreditCard className="h-6 w-6 text-nalco-blue" />
                        </div>
                        <div>
                          <h4 className="font-medium text-nalco-black">
                            {formatReimbursementType(reimbursement.type)}
                          </h4>
                          <p className="text-sm text-nalco-gray">
                            ₹{reimbursement.amount} •{" "}
                            {reimbursement.submittedDate}
                          </p>
                          <p className="text-xs text-nalco-gray">
                            {reimbursement.description}
                          </p>
                          {reimbursement.rejectedReason && (
                            <p className="text-xs text-nalco-red">
                              Reason: {reimbursement.rejectedReason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(reimbursement.status)}>
                          {reimbursement.status.charAt(0).toUpperCase() +
                            reimbursement.status.slice(1)}
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
