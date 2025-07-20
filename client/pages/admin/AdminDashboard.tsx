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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Building2,
  Settings,
  BarChart3,
  Shield,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

    const [moduleDialog, setModuleDialog] = useState<{open: boolean, type: string, title: string}>({
    open: false,
    type: "",
    title: ""
  });
  const [moduleLoading, setModuleLoading] = useState<string | null>(null);

  const handleModuleAccess = async (modulePath: string, moduleTitle: string) => {
    const moduleType = modulePath.split('/').pop() || "";
    setModuleLoading(moduleType);

    try {
      // Simulate module loading
      await new Promise(resolve => setTimeout(resolve, 1000));

      setModuleDialog({
        open: true,
        type: moduleType,
        title: moduleTitle
      });
    } catch (error) {
      alert(`Failed to access ${moduleTitle} module. Please try again.`);
    } finally {
      setModuleLoading(null);
    }
  };

    const handleQuickAction = (action: string) => {
    switch (action) {
      case "create-user":
        alert("Create New User functionality\nFeature coming soon!");
        break;
      case "backup":
        alert(
          "Database Backup initiated...\nBackup will be completed in background.",
        );
        break;
      case "reports":
        alert(
          "Generating System Reports...\nReports will be available in Downloads.",
        );
        break;
      case "maintenance":
        alert(
          "System Maintenance Mode\nScheduled maintenance window configured.",
        );
        break;
      case "security":
        alert(
          "Security Audit initiated...\nAudit report will be available shortly.",
        );
        break;
      case "report-issue":
        navigate("/issues");
        break;
      default:
        alert("Feature coming soon!");
    }
  };

  const systemStats = [
    {
      title: "Total Users",
      value: "11", // Based on our mock data
      change: "All active",
      icon: Users,
      color: "text-nalco-blue",
    },
    {
      title: "Active Departments",
      value: "5",
      change: "HR, Finance, Ops, Eng, Sales",
      icon: Building2,
      color: "text-nalco-green",
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "stable",
      icon: CheckCircle,
      color: "text-nalco-green",
    },
    {
      title: "Pending Approvals",
      value: "3", // Based on mock pending items
      change: "Needs attention",
      icon: AlertTriangle,
      color: "text-nalco-red",
    },
  ];

  const adminModules = [
    {
      title: "User Management",
      description: "Manage employee accounts, roles, and permissions",
      icon: Users,
      path: "/admin/users",
      color: "bg-nalco-blue/10 text-nalco-blue",
    },
    {
      title: "Department Setup",
      description: "Configure departments and organizational structure",
      icon: Building2,
      path: "/admin/departments",
      color: "bg-nalco-green/10 text-nalco-green",
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings and preferences",
      icon: Settings,
      path: "/admin/settings",
      color: "bg-nalco-gray/10 text-nalco-gray",
    },
    {
      title: "Reports & Analytics",
      description: "View system reports and usage analytics",
      icon: BarChart3,
      path: "/admin/reports",
      color: "bg-nalco-red/10 text-nalco-red",
    },
    {
      title: "Security Center",
      description: "Monitor security logs and access controls",
      icon: Shield,
      path: "/admin/security",
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      title: "Database Management",
      description: "Database backup, maintenance, and monitoring",
      icon: Database,
      path: "/admin/database",
      color: "bg-purple-500/10 text-purple-600",
    },
  ];

  const recentActivities = [
    {
      action: "New user registration",
      user: "John Smith (EMP1234)",
      time: "2 minutes ago",
      status: "success",
    },
    {
      action: "Department created",
      user: "Admin (ADMIN001)",
      time: "15 minutes ago",
      status: "success",
    },
    {
      action: "System backup completed",
      user: "System",
      time: "1 hour ago",
      status: "success",
    },
    {
      action: "Failed login attempt",
      user: "Unknown (192.168.1.100)",
      time: "2 hours ago",
      status: "warning",
    },
    {
      action: "Database maintenance",
      user: "Admin (ADMIN001)",
      time: "3 hours ago",
      status: "info",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-nalco-green text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      case "error":
        return "bg-nalco-red text-white";
      default:
        return "bg-nalco-blue text-white";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
                {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-nalco-black">
              Admin Dashboard
            </h1>
            <p className="text-nalco-gray">
              Welcome back, {user?.name}. Manage your system from here.
            </p>
          </div>
          <Button
            className="bg-nalco-red hover:bg-nalco-red/90"
            onClick={() => handleQuickAction("report-issue")}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        </div>

        {/* System Statistics */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          {systemStats.map((stat, index) => {
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
          {/* Admin Modules */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-nalco-black">Admin Modules</CardTitle>
              <CardDescription>
                Access system administration features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {adminModules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() =>
                        handleModuleAccess(module.path, module.title)
                      }
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
                              className="w-full hover:bg-nalco-blue hover:text-white transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleModuleAccess(module.path, module.title);
                              }}
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

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="text-nalco-black">System Health</CardTitle>
              <CardDescription>Current system status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-nalco-gray">CPU Usage</span>
                <Badge className="bg-nalco-green text-white">24%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-nalco-gray">Memory</span>
                <Badge className="bg-nalco-blue text-white">68%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-nalco-gray">Storage</span>
                <Badge className="bg-yellow-500 text-white">82%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-nalco-gray">Network</span>
                <Badge className="bg-nalco-green text-white">Good</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-nalco-gray">Database</span>
                <Badge className="bg-nalco-green text-white">Healthy</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-nalco-black">
                Recent Activities
              </CardTitle>
              <CardDescription>
                Latest system activities and logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nalco-gray/10">
                        <Clock className="h-5 w-5 text-nalco-gray" />
                      </div>
                      <div>
                        <h4 className="font-medium text-nalco-black">
                          {activity.action}
                        </h4>
                        <p className="text-sm text-nalco-gray">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-nalco-black">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                className="bg-nalco-red hover:bg-nalco-red/90"
                onClick={() => handleQuickAction("create-user")}
              >
                Create New User
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickAction("backup")}
              >
                Backup Database
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickAction("reports")}
              >
                Generate Reports
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickAction("maintenance")}
              >
                System Maintenance
              </Button>
                            <Button
                variant="outline"
                onClick={() => handleQuickAction("security")}
              >
                Security Audit
              </Button>
              <Button
                variant="outline"
                className="text-nalco-red hover:text-nalco-red border-nalco-red"
                onClick={() => handleQuickAction("report-issue")}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report System Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
