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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Calendar,
  FileText,
  CreditCard,
  Users,
  Settings,
  Clock,
  Building2,
  CheckCircle,
  AlertTriangle,
  Eye,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Portal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasksDialogOpen, setTasksDialogOpen] = useState(false);

  const pendingTasks = [
    {
      id: "TASK-001",
      title: "Complete Annual Performance Review",
      description: "Submit your self-assessment for the annual performance review cycle",
      priority: "High",
      dueDate: "March 31, 2024",
      type: "Performance",
      action: "Submit Review",
      link: "/portal/performance"
    },
    {
      id: "TASK-002",
      title: "Update Emergency Contact Information",
      description: "HR requires updated emergency contact details in your profile",
      priority: "Medium",
      dueDate: "April 15, 2024",
      type: "Profile",
      action: "Update Profile",
      link: "/portal/profile"
    },
    {
      id: "TASK-003",
      title: "Safety Training Completion",
      description: "Complete mandatory safety training module for Q1 2024",
      priority: "High",
      dueDate: "April 5, 2024",
      type: "Training",
      action: "Start Training",
      link: "/training/safety"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-nalco-red text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      default:
        return "bg-nalco-blue text-white";
    }
  };

  const handleTaskAction = (task: any) => {
    // Simulate completing the task
    navigate(task.link);
  };

  const services = [
    {
      icon: User,
      title: "My Profile",
      description: "View and update your personal information",
      href: "/portal/profile",
    },
    {
      icon: Calendar,
      title: "Leave Management",
      description: "Apply for leave and track your applications",
      href: "/portal/leave",
    },
    {
      icon: FileText,
      title: "Payslips",
      description: "Download your salary slips and tax documents",
      href: "/portal/payslips",
    },
    {
      icon: CreditCard,
      title: "Reimbursements",
      description: "Submit and track expense reimbursements",
      href: "/portal/reimbursements",
    },
    {
      icon: Clock,
      title: "Attendance",
      description: "View your attendance and working hours",
      href: "/portal/attendance",
    },
    {
      icon: Users,
      title: "Directory",
      description: "Find contact information for colleagues",
      href: "/portal/directory",
    },
    {
      icon: Building2,
      title: "Facilities",
      description: "Book meeting rooms and facilities",
      href: "/portal/facilities",
    },
    {
      icon: Settings,
      title: "Preferences",
      description: "Manage your account settings",
      href: "/portal/settings",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
                {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-nalco-black">
              Employee Portal
            </h1>
            <p className="text-nalco-gray">
              Access all your employee services and information in one place.
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

        {/* Quick Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="h-8 w-8 text-nalco-red" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Leave Balance
                </p>
                <p className="text-2xl font-bold text-nalco-black">12 days</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-nalco-blue" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  This Month
                </p>
                <p className="text-2xl font-bold text-nalco-black">160 hrs</p>
              </div>
            </CardContent>
          </Card>
                    <Dialog open={tasksDialogOpen} onOpenChange={setTasksDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer transition-all hover:shadow-lg hover:shadow-nalco-green/10">
                <CardContent className="flex items-center p-6">
                  <FileText className="h-8 w-8 text-nalco-green" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-nalco-gray">
                      Pending Tasks
                    </p>
                    <p className="text-2xl font-bold text-nalco-black">{pendingTasks.length}</p>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Pending Tasks</span>
                  <Badge className="bg-nalco-green text-white">{pendingTasks.length} tasks</Badge>
                </DialogTitle>
                <DialogDescription>
                  Tasks requiring your attention and action
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {pendingTasks.map((task, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-nalco-gray/5 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-mono text-sm text-nalco-blue">{task.id}</span>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">{task.type}</Badge>
                        </div>
                        <h3 className="font-semibold text-nalco-black mb-1">{task.title}</h3>
                        <p className="text-sm text-nalco-gray mb-2">{task.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-nalco-gray">
                          <span>Due: {task.dueDate}</span>
                          <span>Assigned to: {user?.name}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTaskAction(task)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {task.action}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-nalco-green hover:bg-nalco-green/90"
                          onClick={() => {
                            // Mark as completed logic here
                            setTasksDialogOpen(false);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {pendingTasks.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-nalco-green mx-auto mb-4" />
                    <p className="text-nalco-gray">No pending tasks! Great job staying on top of things.</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setTasksDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="bg-nalco-blue hover:bg-nalco-blue/90"
                  onClick={() => navigate("/portal/tasks")}
                >
                  View All Tasks
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-nalco-red" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">Team Size</p>
                <p className="text-2xl font-bold text-nalco-black">24</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group cursor-pointer transition-all hover:shadow-lg hover:shadow-nalco-red/10"
                onClick={() => navigate(service.href)}
              >
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-nalco-red/10 group-hover:bg-nalco-red group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-nalco-black">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-nalco-gray">
                    {service.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(service.href);
                    }}
                  >
                    Access Service
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-nalco-black">
            Recent Activity
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-nalco-blue" />
                    <span className="ml-3 text-nalco-black">
                      Leave application submitted
                    </span>
                  </div>
                  <span className="text-sm text-nalco-gray">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-nalco-green" />
                    <span className="ml-3 text-nalco-black">
                      Payslip for March 2024 available
                    </span>
                  </div>
                  <span className="text-sm text-nalco-gray">1 day ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-nalco-red" />
                    <span className="ml-3 text-nalco-black">
                      Reimbursement approved
                    </span>
                  </div>
                  <span className="text-sm text-nalco-gray">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
