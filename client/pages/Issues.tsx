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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Zap,
  Wrench,
  Shield,
  Building,
  Loader2,
  Upload,
  Eye,
  Edit,
  User,
  Calendar,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Issues() {
  const { user } = useAuth();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<string>("");
  const [assigneeValue, setAssigneeValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [notifyMembers, setNotifyMembers] = useState<string[]>([]);

  // Form state for new issue
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    location: "",
    urgency: "medium",
  });
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const issueStats = [
    {
      icon: AlertTriangle,
      title: "Open Issues",
      value: "23",
      color: "text-nalco-red",
      bgColor: "bg-nalco-red/10",
    },
    {
      icon: Clock,
      title: "In Progress",
      value: "8",
      color: "text-nalco-blue",
      bgColor: "bg-nalco-blue/10",
    },
    {
      icon: CheckCircle,
      title: "Resolved",
      value: "145",
      color: "text-nalco-green",
      bgColor: "bg-nalco-green/10",
    },
    {
      icon: XCircle,
      title: "Critical",
      value: "2",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const [departmentIssuesDialogOpen, setDepartmentIssuesDialogOpen] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const issueCategories = [
    {
      icon: Zap,
      title: "Electrical",
      description: "Power systems, lighting, and electrical equipment",
      count: "12 active",
      totalIssues: 15,
      openIssues: 12,
      inProgressIssues: 2,
      resolvedIssues: 1,
      issues: [
        {
          id: "ELE-001",
          title: "Main power panel malfunction",
          priority: "Critical",
          status: "Open",
        },
        {
          id: "ELE-002",
          title: "Lighting issues in Block A",
          priority: "High",
          status: "In Progress",
        },
        {
          id: "ELE-003",
          title: "Backup generator maintenance",
          priority: "Medium",
          status: "Open",
        },
      ],
    },
    {
      icon: Wrench,
      title: "Mechanical",
      description: "Machinery, equipment maintenance, and repairs",
      count: "8 active",
      totalIssues: 12,
      openIssues: 8,
      inProgressIssues: 3,
      resolvedIssues: 1,
      issues: [
        {
          id: "MECH-001",
          title: "Conveyor belt malfunction",
          priority: "High",
          status: "In Progress",
        },
        {
          id: "MECH-002",
          title: "Pump pressure issues",
          priority: "Medium",
          status: "Open",
        },
        {
          id: "MECH-003",
          title: "Equipment calibration needed",
          priority: "Low",
          status: "Open",
        },
      ],
    },
    {
      icon: Shield,
      title: "Safety",
      description: "Safety violations, accidents, and hazard reports",
      count: "3 active",
      totalIssues: 5,
      openIssues: 3,
      inProgressIssues: 1,
      resolvedIssues: 1,
      issues: [
        {
          id: "SAF-001",
          title: "Emergency exit blocked",
          priority: "Critical",
          status: "Open",
        },
        {
          id: "SAF-002",
          title: "Missing safety equipment",
          priority: "High",
          status: "Open",
        },
        {
          id: "SAF-003",
          title: "Chemical spill cleanup",
          priority: "Medium",
          status: "In Progress",
        },
      ],
    },
    {
      icon: Building,
      title: "Infrastructure",
      description: "Building maintenance, facilities, and utilities",
      count: "5 active",
      totalIssues: 8,
      openIssues: 5,
      inProgressIssues: 2,
      resolvedIssues: 1,
      issues: [
        {
          id: "INF-001",
          title: "HVAC system not working",
          priority: "Medium",
          status: "Open",
        },
        {
          id: "INF-002",
          title: "Plumbing issues in restroom",
          priority: "High",
          status: "In Progress",
        },
        {
          id: "INF-003",
          title: "Roof leak in warehouse",
          priority: "High",
          status: "Open",
        },
      ],
    },
  ];

  const [recentIssues, setRecentIssues] = useState([
    {
      id: "INC-2024-001",
      title: "Conveyor belt malfunction in Section A",
      description:
        "Main conveyor belt in Section A is making unusual noises and has stopped intermittently. Requires immediate inspection.",
      category: "Mechanical",
      priority: "High",
      status: "In Progress",
      assignee: "Rajesh Kumar",
      created: "2 hours ago",
      location: "Section A - Production Floor",
      reportedBy: "Mohammad Alam",
      estimatedResolution: "Tomorrow",
    },
    {
      id: "INC-2024-002",
      title: "Emergency lighting not working in Block B",
      description:
        "Emergency lighting system in Block B is completely non-functional. This is a critical safety issue.",
      category: "Electrical",
      priority: "Critical",
      status: "Open",
      assignee: "Unassigned",
      created: "4 hours ago",
      location: "Block B - Emergency Exit Routes",
      reportedBy: "Geeta Mishra",
      estimatedResolution: "Within 6 hours",
    },
    {
      id: "INC-2024-003",
      title: "Chemical spill in processing unit",
      description:
        "Minor chemical spill in Unit 3. Area has been secured and cleaned. Documentation required.",
      category: "Safety",
      priority: "Critical",
      status: "Resolved",
      assignee: "Safety Team",
      created: "1 day ago",
      location: "Unit 3 - Chemical Processing",
      reportedBy: "Ravi Teja",
      estimatedResolution: "Completed",
    },
    {
      id: "INC-2024-004",
      title: "Air conditioning not working in Admin block",
      description:
        "HVAC system in admin building is not functioning properly. Temperature control issues.",
      category: "Infrastructure",
      priority: "Medium",
      status: "Open",
      assignee: "Maintenance",
      created: "2 days ago",
      location: "Admin Block - All Floors",
      reportedBy: "Sunita Devi",
      estimatedResolution: "This week",
    },
  ]);

  const handleSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (
        !newIssue.title ||
        !newIssue.description ||
        !newIssue.category ||
        !newIssue.priority
      ) {
        setError("Please fill in all required fields");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const issueId = `INC-2024-${String(recentIssues.length + 1).padStart(3, "0")}`;
      const issue = {
        id: issueId,
        title: newIssue.title,
        description: newIssue.description,
        category: newIssue.category,
        priority: newIssue.priority,
        status: "Open",
        assignee: "Unassigned",
        created: "Just now",
        location: newIssue.location || "Not specified",
        reportedBy: user?.name || "Anonymous",
        estimatedResolution: "Pending assessment",
      };

      setRecentIssues([issue, ...recentIssues]);
      setSuccess(`Issue ${issueId} has been reported successfully!`);
      setReportDialogOpen(false);
      setNewIssue({
        title: "",
        description: "",
        category: "",
        priority: "",
        location: "",
        urgency: "medium",
      });
      setAttachedFiles([]);
    } catch (error) {
      setError("Failed to submit issue. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewIssue = (issue: any) => {
    setSelectedIssue(issue);
    setViewDialogOpen(true);
  };

  const filteredIssues = recentIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      issue.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority =
      !priorityFilter ||
      priorityFilter === "all" ||
      issue.priority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-nalco-red/10 text-nalco-red";
      case "in progress":
        return "bg-nalco-blue/10 text-nalco-blue";
      case "resolved":
        return "bg-nalco-green/10 text-nalco-green";
      default:
        return "bg-nalco-gray/10 text-nalco-gray";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Alerts */}
        {success && (
          <Alert className="mb-6 border-nalco-green bg-nalco-green/10">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-nalco-green">
              {success}
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-nalco-black">
              Issue Tracker
            </h1>
            <p className="text-nalco-gray">
              Report, track, and resolve plant issues efficiently.
            </p>
          </div>
          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-nalco-red hover:bg-nalco-red/90">
                <Plus className="mr-2 h-4 w-4" />
                Report New Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Report New Issue</DialogTitle>
                <DialogDescription>
                  Provide detailed information about the issue you're reporting
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitIssue} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={newIssue.title}
                      onChange={(e) =>
                        setNewIssue({ ...newIssue, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newIssue.category}
                      onValueChange={(value) =>
                        setNewIssue({ ...newIssue, category: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="mechanical">Mechanical</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="infrastructure">
                          Infrastructure
                        </SelectItem>
                        <SelectItem value="it">IT & Technology</SelectItem>
                        <SelectItem value="environmental">
                          Environmental
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority *</Label>
                    <Select
                      value={newIssue.priority}
                      onValueChange={(value) =>
                        setNewIssue({ ...newIssue, priority: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Specific location of the issue"
                      value={newIssue.location}
                      onChange={(e) =>
                        setNewIssue({ ...newIssue, location: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the issue, including steps to reproduce if applicable"
                    rows={4}
                    value={newIssue.description}
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="p-4 bg-nalco-blue/5 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Upload className="h-5 w-5 text-nalco-blue" />
                    <div>
                      <p className="text-sm font-medium">
                        Attach Files (Optional)
                      </p>
                      <p className="text-xs text-nalco-gray">
                        Upload photos or documents related to this issue
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          setAttachedFiles(Array.from(e.target.files));
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      Choose Files
                    </Button>
                    {attachedFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-nalco-gray mb-1">
                          {attachedFiles.length} file(s) selected:
                        </p>
                        <div className="space-y-1">
                          {attachedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-xs bg-white/50 p-2 rounded"
                            >
                              <span className="text-nalco-gray">
                                {file.name}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 text-nalco-red"
                                onClick={() => {
                                  setAttachedFiles((files) =>
                                    files.filter((_, i) => i !== index),
                                  );
                                }}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setReportDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-nalco-red hover:bg-nalco-red/90"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Issue"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Issue Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          {issueStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="flex items-center p-6">
                  <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-nalco-gray">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-nalco-black">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-nalco-black">
            Issue Categories
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {issueCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer transition-all hover:shadow-lg hover:shadow-nalco-red/10"
                  onClick={() => {
                    setSelectedCategory(category);
                    setDepartmentIssuesDialogOpen(true);
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center">
                      <div className="mr-3 rounded-lg bg-nalco-red/10 p-2">
                        <Icon className="h-5 w-5 text-nalco-red" />
                      </div>
                      <CardTitle className="text-lg text-nalco-black">
                        {category.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-2 text-nalco-gray">
                      {category.description}
                    </CardDescription>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-nalco-blue">
                        {category.count}
                      </p>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className="text-nalco-red">
                          Open: {category.openIssues}
                        </span>
                        <span className="text-yellow-600">
                          In Progress: {category.inProgressIssues}
                        </span>
                        <span className="text-nalco-green">
                          Resolved: {category.resolvedIssues}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nalco-gray" />
            <Input
              placeholder="Search issues..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Issues List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-nalco-black">Recent Issues</CardTitle>
            <CardDescription>
              Latest issues reported across all departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-nalco-gray mx-auto mb-4" />
                  <p className="text-nalco-gray">
                    No issues found matching your criteria
                  </p>
                </div>
              ) : (
                filteredIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4 transition-all hover:bg-nalco-gray/5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-mono text-sm text-nalco-blue">
                            {issue.id}
                          </span>
                          <Badge
                            variant="secondary"
                            className={getPriorityColor(issue.priority)}
                          >
                            {issue.priority}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(issue.status)}
                          >
                            {issue.status}
                          </Badge>
                        </div>
                        <h3 className="mb-1 font-semibold text-nalco-black">
                          {issue.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-nalco-gray">
                          <span>Category: {issue.category}</span>
                          <span>Assignee: {issue.assignee}</span>
                          <span>Created: {issue.created}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewIssue(issue)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {user?.role === "authority" ||
                        user?.role === "admin" ? (
                          <Button
                            size="sm"
                            className="bg-nalco-blue hover:bg-nalco-blue/90"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Assign
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* View Issue Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span>{selectedIssue?.id}</span>
                <Badge
                  className={getPriorityColor(selectedIssue?.priority || "")}
                >
                  {selectedIssue?.priority}
                </Badge>
                <Badge className={getStatusColor(selectedIssue?.status || "")}>
                  {selectedIssue?.status}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Issue details and tracking information
              </DialogDescription>
            </DialogHeader>

            {selectedIssue && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-nalco-black mb-2">
                    {selectedIssue.title}
                  </h3>
                  <p className="text-nalco-gray">{selectedIssue.description}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-nalco-gray" />
                      <span className="text-sm font-medium">Category:</span>
                      <span className="text-sm">{selectedIssue.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-nalco-gray" />
                      <span className="text-sm font-medium">Location:</span>
                      <span className="text-sm">{selectedIssue.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-nalco-gray" />
                      <span className="text-sm font-medium">Reported by:</span>
                      <span className="text-sm">
                        {selectedIssue.reportedBy}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-nalco-gray" />
                      <span className="text-sm font-medium">Assigned to:</span>
                      <span className="text-sm">{selectedIssue.assignee}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-nalco-gray" />
                      <span className="text-sm font-medium">Created:</span>
                      <span className="text-sm">{selectedIssue.created}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-nalco-gray" />
                      <span className="text-sm font-medium">
                        Est. Resolution:
                      </span>
                      <span className="text-sm">
                        {selectedIssue.estimatedResolution}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div>
                  <h4 className="font-medium mb-3">Activity Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-nalco-green/10 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-nalco-green mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Issue Created</p>
                        <p className="text-xs text-nalco-gray">
                          Reported by {selectedIssue.reportedBy} •{" "}
                          {selectedIssue.created}
                        </p>
                      </div>
                    </div>
                    {selectedIssue.status === "In Progress" && (
                      <div className="flex items-start space-x-3 p-3 bg-nalco-blue/10 rounded-lg">
                        <Clock className="h-5 w-5 text-nalco-blue mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            Investigation Started
                          </p>
                          <p className="text-xs text-nalco-gray">
                            Assigned to {selectedIssue.assignee} • 1 hour ago
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedIssue.status === "Resolved" && (
                      <div className="flex items-start space-x-3 p-3 bg-nalco-green/10 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-nalco-green mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Issue Resolved</p>
                          <p className="text-xs text-nalco-gray">
                            Completed by {selectedIssue.assignee} •{" "}
                            {selectedIssue.created}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions for authorities/admins */}
                {(user?.role === "authority" || user?.role === "admin") && (
                  <div className="flex space-x-4 pt-4 border-t">
                    <Button
                      className="bg-nalco-blue hover:bg-nalco-blue/90"
                      onClick={() => {
                        setActionType("assign");
                        setActionDialogOpen(true);
                      }}
                    >
                      Assign to Team
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActionType("status");
                        setActionDialogOpen(true);
                      }}
                    >
                      Update Status
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActionType("comment");
                        setActionDialogOpen(true);
                      }}
                    >
                      Add Comment
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActionType("notify");
                        setActionDialogOpen(true);
                      }}
                    >
                      Notify Team
                    </Button>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Dialog for Assign/Status/Comment/Notify */}
        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {actionType === "assign" && "Assign Issue to Team"}
                {actionType === "status" && "Update Issue Status"}
                {actionType === "comment" && "Add Comment to Issue"}
                {actionType === "notify" && "Notify Team Members"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "assign" &&
                  "Assign this issue to a team member for resolution"}
                {actionType === "status" &&
                  "Update the current status of this issue"}
                {actionType === "comment" &&
                  "Add a comment or update to this issue"}
                {actionType === "notify" &&
                  "Notify relevant team members about this issue"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {actionType === "assign" && (
                <div>
                  <Label htmlFor="assignee">Assign to</Label>
                  <Select
                    value={assigneeValue}
                    onValueChange={setAssigneeValue}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rajesh.kumar">
                        Rajesh Kumar (Maintenance)
                      </SelectItem>
                      <SelectItem value="sunita.devi">
                        Sunita Devi (Safety)
                      </SelectItem>
                      <SelectItem value="mohammad.alam">
                        Mohammad Alam (IT)
                      </SelectItem>
                      <SelectItem value="kavitha.reddy">
                        Kavitha Reddy (Engineering)
                      </SelectItem>
                      <SelectItem value="maintenance.team">
                        Maintenance Team
                      </SelectItem>
                      <SelectItem value="safety.team">Safety Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {actionType === "status" && (
                <div>
                  <Label htmlFor="status">New Status</Label>
                  <Select value={statusValue} onValueChange={setStatusValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(actionType === "comment" ||
                actionType === "assign" ||
                actionType === "status") && (
                <div>
                  <Label htmlFor="comment">
                    Comment {actionType === "comment" ? "*" : "(Optional)"}
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Add your comment or notes..."
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {actionType === "notify" && (
                <div>
                  <Label>Notify Team Members</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      {
                        id: "rajesh.kumar",
                        name: "Rajesh Kumar",
                        dept: "Maintenance",
                      },
                      {
                        id: "sunita.devi",
                        name: "Sunita Devi",
                        dept: "Safety",
                      },
                      {
                        id: "mohammad.alam",
                        name: "Mohammad Alam",
                        dept: "IT",
                      },
                      {
                        id: "kavitha.reddy",
                        name: "Kavitha Reddy",
                        dept: "Engineering",
                      },
                      {
                        id: "department.head",
                        name: "Department Head",
                        dept: "Management",
                      },
                    ].map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={member.id}
                          checked={notifyMembers.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNotifyMembers([...notifyMembers, member.id]);
                            } else {
                              setNotifyMembers(
                                notifyMembers.filter((id) => id !== member.id),
                              );
                            }
                          }}
                        />
                        <Label htmlFor={member.id} className="text-sm">
                          {member.name} ({member.dept})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setActionDialogOpen(false);
                  setAssigneeValue("");
                  setStatusValue("");
                  setCommentValue("");
                  setNotifyMembers([]);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-nalco-blue hover:bg-nalco-blue/90"
                onClick={async () => {
                  // Simulate API call
                  setSubmitting(true);
                  await new Promise((resolve) => setTimeout(resolve, 1000));

                  let message = "";
                  if (actionType === "assign") {
                    message = `Issue assigned to ${assigneeValue} successfully!`;
                  } else if (actionType === "status") {
                    message = `Issue status updated to ${statusValue} successfully!`;
                  } else if (actionType === "comment") {
                    message = "Comment added successfully!";
                  } else if (actionType === "notify") {
                    message = `${notifyMembers.length} team member(s) notified successfully!`;
                  }

                  setSuccess(message);
                  setActionDialogOpen(false);
                  setAssigneeValue("");
                  setStatusValue("");
                  setCommentValue("");
                  setNotifyMembers([]);
                  setSubmitting(false);
                }}
                disabled={
                  submitting ||
                  (actionType === "assign" && !assigneeValue) ||
                  (actionType === "status" && !statusValue) ||
                  (actionType === "comment" && !commentValue) ||
                  (actionType === "notify" && notifyMembers.length === 0)
                }
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Department Issues Dialog */}
        <Dialog
          open={departmentIssuesDialogOpen}
          onOpenChange={setDepartmentIssuesDialogOpen}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {selectedCategory && (
                  <>
                    <selectedCategory.icon className="h-5 w-5" />
                    <span>{selectedCategory.title} Department Issues</span>
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedCategory &&
                  `View and manage all ${selectedCategory.title.toLowerCase()} related issues`}
              </DialogDescription>
            </DialogHeader>

            {selectedCategory && (
              <div className="space-y-6">
                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-nalco-black">
                        {selectedCategory.totalIssues}
                      </div>
                      <p className="text-sm text-nalco-gray">Total Issues</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-nalco-red">
                        {selectedCategory.openIssues}
                      </div>
                      <p className="text-sm text-nalco-gray">Open</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedCategory.inProgressIssues}
                      </div>
                      <p className="text-sm text-nalco-gray">In Progress</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-nalco-green">
                        {selectedCategory.resolvedIssues}
                      </div>
                      <p className="text-sm text-nalco-gray">Resolved</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Issues List */}
                <div>
                  <h4 className="font-medium mb-3">Recent Issues</h4>
                  <div className="space-y-3">
                    {selectedCategory.issues.map(
                      (issue: any, index: number) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:bg-nalco-gray/5 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedIssue(issue);
                            setDepartmentIssuesDialogOpen(false);
                            setViewDialogOpen(true);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-mono text-sm text-nalco-blue">
                                  {issue.id}
                                </span>
                                <Badge
                                  className={getPriorityColor(issue.priority)}
                                >
                                  {issue.priority}
                                </Badge>
                                <Badge className={getStatusColor(issue.status)}>
                                  {issue.status}
                                </Badge>
                              </div>
                              <h5 className="font-medium text-nalco-black">
                                {issue.title}
                              </h5>
                              <p className="text-sm text-nalco-gray">
                                Click to view details
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDepartmentIssuesDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                className="bg-nalco-red hover:bg-nalco-red/90"
                onClick={() => {
                  setDepartmentIssuesDialogOpen(false);
                  setReportDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Report New Issue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
