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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthorityDashboard() {
  const { user } = useAuth();

  const departmentStats = [
    {
      title: "Total Employees",
      value: "156",
      change: "+8 this month",
      icon: Users,
      color: "text-nalco-blue",
    },
    {
      title: "Pending Approvals",
      value: "12",
      change: "Requires attention",
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Active Issues",
      value: "7",
      change: "-3 resolved today",
      icon: AlertTriangle,
      color: "text-nalco-red",
    },
    {
      title: "This Month's Leaves",
      value: "34",
      change: "18 approved",
      icon: Calendar,
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

  const pendingApprovals = [
    {
      type: "Leave Application",
      employee: "Sarah Johnson",
      request: "Annual Leave - 3 days",
      date: "Mar 25-27, 2024",
      status: "pending",
      priority: "normal",
    },
    {
      type: "Reimbursement",
      employee: "Michael Chen",
      request: "Travel Expenses",
      date: "Mar 20, 2024",
      status: "pending",
      priority: "high",
    },
    {
      type: "Overtime Request",
      employee: "Emily Rodriguez",
      request: "Weekend Work - 8 hours",
      date: "Mar 23, 2024",
      status: "pending",
      priority: "normal",
    },
    {
      type: "Leave Application",
      employee: "David Thompson",
      request: "Sick Leave - 2 days",
      date: "Mar 28-29, 2024",
      status: "pending",
      priority: "urgent",
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
              <div className="space-y-4">
                {pendingApprovals.map((approval, index) => (
                  <div
                    key={index}
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
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(approval.priority)}>
                        {approval.priority}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                      <Button
                        size="sm"
                        className="bg-nalco-green hover:bg-nalco-green/90"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-nalco-red hover:text-nalco-red"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
    </Layout>
  );
}
