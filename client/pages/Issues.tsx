import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Issues() {
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

  const issueCategories = [
    {
      icon: Zap,
      title: "Electrical",
      description: "Power systems, lighting, and electrical equipment",
      count: "12 active",
    },
    {
      icon: Tool,
      title: "Mechanical",
      description: "Machinery, equipment maintenance, and repairs",
      count: "8 active",
    },
    {
      icon: Shield,
      title: "Safety",
      description: "Safety violations, accidents, and hazard reports",
      count: "3 active",
    },
    {
      icon: Building,
      title: "Infrastructure",
      description: "Building maintenance, facilities, and utilities",
      count: "5 active",
    },
  ];

  const recentIssues = [
    {
      id: "INC-2024-001",
      title: "Conveyor belt malfunction in Section A",
      category: "Mechanical",
      priority: "High",
      status: "In Progress",
      assignee: "Rajesh Kumar",
      created: "2 hours ago",
    },
    {
      id: "INC-2024-002",
      title: "Emergency lighting not working in Block B",
      category: "Electrical",
      priority: "Critical",
      status: "Open",
      assignee: "Unassigned",
      created: "4 hours ago",
    },
    {
      id: "INC-2024-003",
      title: "Chemical spill in processing unit",
      category: "Safety",
      priority: "Critical",
      status: "Resolved",
      assignee: "Safety Team",
      created: "1 day ago",
    },
    {
      id: "INC-2024-004",
      title: "Air conditioning not working in Admin block",
      category: "Infrastructure",
      priority: "Medium",
      status: "Open",
      assignee: "Maintenance",
      created: "2 days ago",
    },
  ];

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
          <Button className="bg-nalco-red hover:bg-nalco-red/90">
            <Plus className="mr-2 h-4 w-4" />
            Report New Issue
          </Button>
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
                    <p className="text-sm font-medium text-nalco-blue">
                      {category.count}
                    </p>
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
            <Input placeholder="Search issues..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
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
              {recentIssues.map((issue, index) => (
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
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
