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
  DialogTrigger,
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
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleModuleAccess = async (
    modulePath: string,
    moduleTitle: string,
  ) => {
    const moduleType = modulePath.split("/").pop() || "";
    setModuleLoading(moduleType);

    try {
      // Simulate module loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setModuleDialog({
        open: true,
        type: moduleType,
        title: moduleTitle,
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
        setModuleDialog({
          open: true,
          type: "create-user",
          title: "Create New User",
        });
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

  const getModuleContent = (type: string) => {
    switch (type) {
      case "users":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">User Management</h3>
              <Button
                size="sm"
                className="bg-nalco-blue hover:bg-nalco-blue/90"
                onClick={() =>
                  setModuleDialog({
                    open: true,
                    type: "create-user",
                    title: "Create New User",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
            <div className="space-y-2">
              {[
                {
                  name: "Rajesh Kumar Singh",
                  role: "Employee",
                  id: "EMP001",
                  status: "Active",
                  email: "rajesh.singh@nalco.com",
                  phone: "+91-9876543210",
                },
                {
                  name: "Dr. Priya Sharma",
                  role: "Authority",
                  id: "AUTH001",
                  status: "Active",
                  email: "priya.sharma@nalco.com",
                  phone: "+91-9876543211",
                },
                {
                  name: "Vikram Patel",
                  role: "Admin",
                  id: "ADMIN001",
                  status: "Active",
                  email: "vikram.patel@nalco.com",
                  phone: "+91-9876543212",
                },
                {
                  name: "Sunita Devi",
                  role: "Employee",
                  id: "EMP002",
                  status: "Inactive",
                  email: "sunita.devi@nalco.com",
                  phone: "+91-9876543213",
                },
              ].map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-nalco-gray">
                      {user.role} • {user.id}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={
                        user.status === "Active"
                          ? "bg-nalco-green text-white"
                          : "bg-nalco-red text-white"
                      }
                    >
                      {user.status}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit User - {user.name}</DialogTitle>
                          <DialogDescription>
                            Update user information and settings
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label>Full Name</Label>
                            <Input defaultValue={user.name} />
                          </div>
                          <div>
                            <Label>Employee ID</Label>
                            <Input defaultValue={user.id} disabled />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input defaultValue={user.email} type="email" />
                          </div>
                          <div>
                            <Label>Phone</Label>
                            <Input defaultValue={user.phone} />
                          </div>
                          <div>
                            <Label>Role</Label>
                            <Select defaultValue={user.role.toLowerCase()}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="employee">
                                  Employee
                                </SelectItem>
                                <SelectItem value="authority">
                                  Authority
                                </SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <Select defaultValue={user.status.toLowerCase()}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                  Inactive
                                </SelectItem>
                                <SelectItem value="suspended">
                                  Suspended
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button
                            className="bg-nalco-green hover:bg-nalco-green/90"
                            onClick={() => {
                              alert(`User ${user.name} updated successfully!`);
                            }}
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "departments":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Department Setup</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-nalco-green hover:bg-nalco-green/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Department</DialogTitle>
                    <DialogDescription>
                      Create a new department in the organization
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Department Name</Label>
                      <Input placeholder="Enter department name" />
                    </div>
                    <div>
                      <Label>Department Head</Label>
                      <Input placeholder="Enter head name" />
                    </div>
                    <div>
                      <Label>Initial Budget</Label>
                      <Input placeholder="₹ 0" />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input placeholder="Office/Building location" />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Department description and responsibilities"
                      rows={3}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button
                      className="bg-nalco-green hover:bg-nalco-green/90"
                      onClick={() => {
                        alert("New department created successfully!");
                      }}
                    >
                      Create Department
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  name: "Human Resources",
                  head: "Dr. Priya Sharma",
                  employees: 15,
                  budget: "₹5 Crores",
                  location: "Admin Block A",
                },
                {
                  name: "Finance & Accounts",
                  head: "Suresh Babu",
                  employees: 22,
                  budget: "₹12 Crores",
                  location: "Admin Block B",
                },
                {
                  name: "Plant Operations",
                  head: "Ramesh Chandran",
                  employees: 145,
                  budget: "₹50 Crores",
                  location: "Plant Area 1",
                },
                {
                  name: "Engineering",
                  head: "Anita Das",
                  employees: 89,
                  budget: "₹35 Crores",
                  location: "Engineering Block",
                },
              ].map((dept, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{dept.name}</h4>
                    <p className="text-sm text-nalco-gray mb-1">
                      Head: {dept.head}
                    </p>
                    <p className="text-sm text-nalco-gray mb-1">
                      Employees: {dept.employees}
                    </p>
                    <p className="text-sm text-nalco-gray mb-3">
                      Budget: {dept.budget}
                    </p>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>
                              {dept.name} - Department Details
                            </DialogTitle>
                            <DialogDescription>
                              Complete information about the department
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <Label>Department Name</Label>
                                <Input value={dept.name} disabled />
                              </div>
                              <div>
                                <Label>Department Head</Label>
                                <Input value={dept.head} disabled />
                              </div>
                              <div>
                                <Label>Total Employees</Label>
                                <Input
                                  value={dept.employees.toString()}
                                  disabled
                                />
                              </div>
                              <div>
                                <Label>Budget Allocation</Label>
                                <Input value={dept.budget} disabled />
                              </div>
                              <div>
                                <Label>Location</Label>
                                <Input value={dept.location} disabled />
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Input value="Active" disabled />
                              </div>
                            </div>
                            <div>
                              <Label>Performance Metrics</Label>
                              <div className="grid gap-2 md:grid-cols-3 mt-2">
                                <div className="text-center p-3 bg-nalco-green/10 rounded">
                                  <div className="text-2xl font-bold text-nalco-green">
                                    94%
                                  </div>
                                  <div className="text-sm">Efficiency</div>
                                </div>
                                <div className="text-center p-3 bg-nalco-blue/10 rounded">
                                  <div className="text-2xl font-bold text-nalco-blue">
                                    87%
                                  </div>
                                  <div className="text-sm">Productivity</div>
                                </div>
                                <div className="text-center p-3 bg-nalco-red/10 rounded">
                                  <div className="text-2xl font-bold text-nalco-red">
                                    4.2/5
                                  </div>
                                  <div className="text-sm">Satisfaction</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Close</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Edit Department - {dept.name}
                            </DialogTitle>
                            <DialogDescription>
                              Update department information
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label>Department Name</Label>
                              <Input defaultValue={dept.name} />
                            </div>
                            <div>
                              <Label>Department Head</Label>
                              <Input defaultValue={dept.head} />
                            </div>
                            <div>
                              <Label>Budget Allocation</Label>
                              <Input defaultValue={dept.budget} />
                            </div>
                            <div>
                              <Label>Location</Label>
                              <Input defaultValue={dept.location} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button
                              className="bg-nalco-green hover:bg-nalco-green/90"
                              onClick={() => {
                                alert(
                                  `Department ${dept.name} updated successfully!`,
                                );
                              }}
                            >
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">System Settings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">General Settings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">System Name</span>
                      <span className="text-sm font-medium">connectNALCO</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Version</span>
                      <span className="text-sm font-medium">v2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Timezone</span>
                      <span className="text-sm font-medium">IST</span>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-full mt-3">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit General Settings</DialogTitle>
                        <DialogDescription>
                          Update system configuration
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>System Name</Label>
                          <Input defaultValue="connectNALCO" />
                        </div>
                        <div>
                          <Label>Version</Label>
                          <Input defaultValue="v2.1.0" />
                        </div>
                        <div>
                          <Label>Timezone</Label>
                          <Select defaultValue="ist">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ist">
                                IST (Indian Standard Time)
                              </SelectItem>
                              <SelectItem value="utc">UTC</SelectItem>
                              <SelectItem value="est">EST</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Maintenance Mode</Label>
                          <Select defaultValue="disabled">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="enabled">Enabled</SelectItem>
                              <SelectItem value="disabled">Disabled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button
                          className="bg-nalco-green hover:bg-nalco-green/90"
                          onClick={() => {
                            alert("General settings updated successfully!");
                          }}
                        >
                          Save Settings
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Email Configuration</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">SMTP Server</span>
                      <span className="text-sm font-medium">Configured</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">SSL/TLS</span>
                      <span className="text-sm font-medium">Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Status</span>
                      <Badge className="bg-nalco-green text-white">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-full mt-3">
                        <Edit className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Email Configuration</DialogTitle>
                        <DialogDescription>
                          Configure SMTP settings for email notifications
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>SMTP Server</Label>
                          <Input placeholder="smtp.nalco.com" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label>Port</Label>
                            <Input placeholder="587" />
                          </div>
                          <div>
                            <Label>Security</Label>
                            <Select defaultValue="tls">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tls">TLS</SelectItem>
                                <SelectItem value="ssl">SSL</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Username</Label>
                          <Input placeholder="noreply@nalco.com" />
                        </div>
                        <div>
                          <Label>Password</Label>
                          <Input type="password" placeholder="••••••••" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button
                          className="bg-nalco-green hover:bg-nalco-green/90"
                          onClick={() => {
                            alert("Email configuration updated successfully!");
                          }}
                        >
                          Save Configuration
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Reports & Analytics</h3>
              <Button size="sm" className="bg-nalco-red hover:bg-nalco-red/90">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-medium mb-2">System Usage</h4>
                  <p className="text-2xl font-bold text-nalco-blue">89%</p>
                  <p className="text-sm text-nalco-gray">Overall utilization</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-medium mb-2">Active Users</h4>
                  <p className="text-2xl font-bold text-nalco-green">248</p>
                  <p className="text-sm text-nalco-gray">Currently online</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-medium mb-2">Data Storage</h4>
                  <p className="text-2xl font-bold text-nalco-red">2.4TB</p>
                  <p className="text-sm text-nalco-gray">Total used</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Security Center</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Security Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Firewall</span>
                      <Badge className="bg-nalco-green text-white">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">SSL Certificate</span>
                      <Badge className="bg-nalco-green text-white">Valid</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Backup</span>
                      <span className="text-sm">2 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Recent Alerts</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <p className="font-medium">Failed login attempt</p>
                      <p className="text-nalco-gray">
                        From 192.168.1.100 • 2h ago
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Unusual data access</p>
                      <p className="text-nalco-gray">User: EMP005 • 5h ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "database":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Database Management</h3>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-600/90"
                onClick={async () => {
                  const confirmed = confirm(
                    "Are you sure you want to start a database backup? This may take several minutes.",
                  );
                  if (confirmed) {
                    setProcessing("backup-database");
                    setError("");
                    setSuccess("");

                    try {
                      // Simulate backup process
                      await new Promise((resolve) => setTimeout(resolve, 3000));

                      const backupId = `BKP${Date.now()}`;
                      const backupSize = Math.random() * 2 + 1; // Random size between 1-3 GB

                      setSuccess(
                        `Database backup completed successfully!\n\n` +
                          `Backup ID: ${backupId}\n` +
                          `Backup Size: ${backupSize.toFixed(2)} GB\n` +
                          `Completion Time: ${new Date().toLocaleString()}\n` +
                          `Storage Location: /backups/${backupId}.sql\n\n` +
                          `The backup has been stored securely and can be used for restore operations.`,
                      );
                    } catch (error) {
                      setError(
                        "Database backup failed. Please check system logs and try again.",
                      );
                    } finally {
                      setProcessing(null);
                    }
                  }
                }}
                disabled={processing === "backup-database"}
              >
                {processing === "backup-database" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Backing up...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Backup Now
                  </>
                )}
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Database Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Connection</span>
                      <Badge className="bg-nalco-green text-white">
                        Healthy
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Size</span>
                      <span className="text-sm">1.2 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tables</span>
                      <span className="text-sm">45</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Backup History</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <p className="font-medium">Auto Backup #247</p>
                      <p className="text-nalco-gray">
                        March 26, 2024 • 2:00 AM
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Manual Backup #246</p>
                      <p className="text-nalco-gray">
                        March 25, 2024 • 4:30 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "create-user":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create New User</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="Enter full name" />
              </div>
              <div>
                <Label>Employee ID</Label>
                <Input placeholder="EMP###" />
              </div>
              <div>
                <Label>Email</Label>
                <Input placeholder="user@nalco.com" type="email" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input placeholder="+91-9876543210" />
              </div>
              <div>
                <Label>Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="authority">Authority</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Additional Notes</Label>
              <Textarea
                placeholder="Any additional information about the user"
                rows={3}
              />
            </div>
          </div>
        );
      default:
        return <div>Module content not available</div>;
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
                              disabled={
                                moduleLoading === module.path.split("/").pop()
                              }
                            >
                              {moduleLoading ===
                              module.path.split("/").pop() ? (
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
                    className="flex items-center justify-between border-b pb-4 last:border-b-0 hover:bg-nalco-gray/5 rounded-lg p-2 transition-colors cursor-pointer"
                    onClick={() => {
                      // Navigate based on activity type
                      if (activity.action.includes("user")) {
                        setModuleDialog({
                          open: true,
                          type: "users",
                          title: "User Management",
                        });
                      } else if (activity.action.includes("department")) {
                        setModuleDialog({
                          open: true,
                          type: "departments",
                          title: "Department Setup",
                        });
                      } else if (
                        activity.action.includes("backup") ||
                        activity.action.includes("maintenance")
                      ) {
                        setModuleDialog({
                          open: true,
                          type: "database",
                          title: "Database Management",
                        });
                      } else if (activity.action.includes("login")) {
                        setModuleDialog({
                          open: true,
                          type: "security",
                          title: "Security Center",
                        });
                      } else {
                        // Generic issue navigation
                        navigate("/issues");
                      }

                      alert(
                        `Navigating to ${activity.action} details...\nActivity ID: ACT${Date.now()}\nUser: ${activity.user}\nTime: ${activity.time}`,
                      );
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nalco-gray/10">
                        <Clock className="h-5 w-5 text-nalco-gray" />
                      </div>
                      <div>
                        <h4 className="font-medium text-nalco-black hover:text-nalco-blue transition-colors">
                          {activity.action}
                        </h4>
                        <p className="text-sm text-nalco-gray">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                      <div className="text-nalco-gray hover:text-nalco-blue transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
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
                onClick={async () => {
                  const confirmed = confirm(
                    "Are you sure you want to start a database backup? This may take several minutes.",
                  );
                  if (confirmed) {
                    alert(
                      "Database backup initiated...\nBackup ID: BKP" +
                        Date.now() +
                        "\nEstimated time: 10-15 minutes\nYou will be notified when complete.",
                    );
                  }
                }}
              >
                Backup Database
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  const reportData =
                    `SYSTEM REPORTS SUMMARY\n\n` +
                    `Generated: ${new Date().toLocaleString()}\n` +
                    `Report Period: Last 30 days\n\n` +
                    `SYSTEM STATISTICS:\n` +
                    `- Total Users: 11\n` +
                    `- Active Departments: 5\n` +
                    `- System Uptime: 99.9%\n` +
                    `- Database Size: 1.2 GB\n\n` +
                    `USAGE METRICS:\n` +
                    `- Average Daily Logins: 248\n` +
                    `- Peak Usage Time: 10:00 AM - 2:00 PM\n` +
                    `- Most Used Features: Employee Portal, Issue Tracker\n\n` +
                    `PERFORMANCE:\n` +
                    `- Average Response Time: 120ms\n` +
                    `- Error Rate: 0.1%\n` +
                    `- User Satisfaction: 4.6/5`;

                  const blob = new Blob([reportData], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `system_reports_${new Date().toISOString().split("T")[0]}.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);

                  alert(
                    "System reports generated and downloaded successfully!",
                  );
                }}
              >
                Generate Reports
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const confirmed = confirm(
                    "Enable system maintenance mode? This will temporarily disable user access.",
                  );
                  if (confirmed) {
                    alert(
                      "System Maintenance Mode ENABLED\n\n" +
                        "- User access temporarily disabled\n" +
                        "- Maintenance window: 2 hours\n" +
                        "- Automatic restoration scheduled\n" +
                        "- Admin access remains active",
                    );
                  }
                }}
              >
                System Maintenance
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  const auditReport =
                    `SECURITY AUDIT REPORT\n\n` +
                    `Audit Date: ${new Date().toLocaleString()}\n` +
                    `Audit ID: SA${Date.now()}\n\n` +
                    `SECURITY STATUS:\n` +
                    `✓ Firewall: Active and configured\n` +
                    `✓ SSL Certificate: Valid (expires Nov 2025)\n` +
                    `✓ User Authentication: Multi-factor enabled\n` +
                    `✓ Database Encryption: AES-256 active\n\n` +
                    `RECENT ACTIVITIES:\n` +
                    `- Failed login attempts: 3 (last 24h)\n` +
                    `- Password changes: 5 (last week)\n` +
                    `- Admin access logs: Normal\n\n` +
                    `RECOMMENDATIONS:\n` +
                    `1. Review user access permissions quarterly\n` +
                    `2. Update security policies documentation\n` +
                    `3. Schedule penetration testing\n\n` +
                    `THREAT LEVEL: LOW\n` +
                    `OVERALL SECURITY SCORE: 9.2/10`;

                  const blob = new Blob([auditReport], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `security_audit_${new Date().toISOString().split("T")[0]}.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);

                  alert("Security audit completed and report downloaded!");
                }}
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

        {/* Module Access Dialog */}
        <Dialog
          open={moduleDialog.open}
          onOpenChange={(open) => setModuleDialog({ ...moduleDialog, open })}
        >
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-nalco-black">
                {moduleDialog.title}
              </DialogTitle>
              <DialogDescription>
                Manage {moduleDialog.title.toLowerCase()} and system
                configurations
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
              {moduleDialog.type === "create-user" && (
                <Button
                  className="bg-nalco-blue hover:bg-nalco-blue/90"
                  onClick={() => {
                    alert("User created successfully!");
                    setModuleDialog({ open: false, type: "", title: "" });
                  }}
                >
                  Create User
                </Button>
              )}
              <Button
                className="bg-nalco-green hover:bg-nalco-green/90"
                onClick={() => {
                  alert("Changes saved successfully!");
                  setModuleDialog({ open: false, type: "", title: "" });
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
