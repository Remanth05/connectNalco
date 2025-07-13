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
import { ArrowLeft, CreditCard, Plus, Upload, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Reimbursements() {
  const navigate = useNavigate();

  const reimbursements = [
    {
      id: "RB-2024-003",
      category: "Travel",
      description: "Client meeting travel expenses",
      amount: 450.75,
      date: "2024-03-20",
      status: "Approved",
      submittedOn: "2024-03-22",
    },
    {
      id: "RB-2024-002",
      category: "Meals",
      description: "Team lunch during conference",
      amount: 125.5,
      date: "2024-03-15",
      status: "Processing",
      submittedOn: "2024-03-18",
    },
    {
      id: "RB-2024-001",
      category: "Office Supplies",
      description: "Ergonomic keyboard and mouse",
      amount: 89.99,
      date: "2024-03-10",
      status: "Paid",
      submittedOn: "2024-03-12",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-nalco-green text-white";
      case "paid":
        return "bg-nalco-blue text-white";
      case "processing":
        return "bg-yellow-500 text-white";
      case "rejected":
        return "bg-nalco-red text-white";
      default:
        return "bg-nalco-gray text-white";
    }
  };

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
                Submit and track expense reimbursements
              </p>
            </div>
          </div>
          <Button className="bg-nalco-red hover:bg-nalco-red/90">
            <Plus className="h-4 w-4 mr-2" />
            New Reimbursement
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <CreditCard className="h-8 w-8 text-nalco-green" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Total Approved
                </p>
                <p className="text-2xl font-bold text-nalco-black">
                  {formatCurrency(2340.75)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <CreditCard className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">Pending</p>
                <p className="text-2xl font-bold text-nalco-black">
                  {formatCurrency(125.5)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <CreditCard className="h-8 w-8 text-nalco-blue" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">Paid</p>
                <p className="text-2xl font-bold text-nalco-black">
                  {formatCurrency(1890.25)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <CreditCard className="h-8 w-8 text-nalco-red" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  This Month
                </p>
                <p className="text-2xl font-bold text-nalco-black">
                  {formatCurrency(666.24)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* New Reimbursement Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-nalco-black">
                New Reimbursement
              </CardTitle>
              <CardDescription>Submit a new expense claim</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Expense Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="meals">Meals & Entertainment</SelectItem>
                    <SelectItem value="office">Office Supplies</SelectItem>
                    <SelectItem value="training">
                      Training & Education
                    </SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="date">Expense Date</Label>
                <Input id="date" type="date" />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the expense"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="receipt">Receipt</Label>
                <div className="flex items-center space-x-2">
                  <Input id="receipt" type="file" accept="image/*,.pdf" />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-nalco-gray mt-1">
                  Upload receipt (PDF, JPG, PNG)
                </p>
              </div>

              <Button className="w-full bg-nalco-blue hover:bg-nalco-blue/90">
                Submit Reimbursement
              </Button>
            </CardContent>
          </Card>

          {/* Reimbursement History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-nalco-black">
                Reimbursement History
              </CardTitle>
              <CardDescription>
                Track your submitted expense claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reimbursements.map((reimbursement) => (
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
                          {reimbursement.description}
                        </h4>
                        <p className="text-sm text-nalco-gray">
                          {reimbursement.category} •{" "}
                          {formatCurrency(reimbursement.amount)} •{" "}
                          {reimbursement.date}
                        </p>
                        <p className="text-xs text-nalco-gray">
                          Submitted on {reimbursement.submittedOn}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(reimbursement.status)}>
                        {reimbursement.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-nalco-black">
              Reimbursement Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-nalco-black mb-2">
                  Eligible Expenses
                </h4>
                <ul className="text-sm text-nalco-gray space-y-1">
                  <li>• Business travel and accommodation</li>
                  <li>• Client meals and entertainment</li>
                  <li>• Office supplies and equipment</li>
                  <li>• Training and professional development</li>
                  <li>• Communication expenses</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-nalco-black mb-2">
                  Submission Requirements
                </h4>
                <ul className="text-sm text-nalco-gray space-y-1">
                  <li>• Submit within 30 days of expense</li>
                  <li>• Include original receipts</li>
                  <li>• Provide detailed descriptions</li>
                  <li>• Get manager approval for large amounts</li>
                  <li>• Follow company expense policy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
