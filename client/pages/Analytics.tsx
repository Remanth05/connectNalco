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
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Refresh,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Analytics() {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleExport = () => {
    const analyticsData = `
NALCO ANALYTICS DASHBOARD REPORT
Generated: ${new Date().toLocaleString()}

KEY METRICS:
- Employee Satisfaction: 4.6/5.0
- System Uptime: 99.9%
- Active Users: 2,483
- Issues Resolved: 1,247 (this month)

PERFORMANCE INDICATORS:
- Plant Efficiency: 94.2%
- Safety Score: 98.1%
- Productivity Index: 87.5%
- Cost Optimization: 12.3% saved

DEPARTMENTAL BREAKDOWN:
- Operations: 145 employees, 96% efficiency
- Engineering: 89 employees, 91% efficiency  
- HR: 15 employees, 88% efficiency
- Finance: 22 employees, 93% efficiency

TRENDS (Last 6 Months):
- Employee engagement: +15%
- System usage: +23%
- Issue resolution time: -18%
- Safety incidents: -42%

RECOMMENDATIONS:
1. Continue focus on safety initiatives
2. Expand digital transformation programs
3. Increase cross-departmental collaboration
4. Implement predictive maintenance systems
    `;

    const blob = new Blob([analyticsData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nalco_analytics_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const keyMetrics = [
    {
      title: "Employee Satisfaction",
      value: "4.6/5.0",
      change: "+0.3",
      trend: "up",
      icon: Users,
      color: "text-nalco-green",
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "+0.1%",
      trend: "up",
      icon: CheckCircle,
      color: "text-nalco-green",
    },
    {
      title: "Active Users",
      value: "2,483",
      change: "+156",
      trend: "up",
      icon: Users,
      color: "text-nalco-blue",
    },
    {
      title: "Issues Resolved",
      value: "1,247",
      change: "+89",
      trend: "up",
      icon: CheckCircle,
      color: "text-nalco-green",
    },
  ];

  const performanceData = [
    {
      category: "Plant Efficiency",
      current: 94.2,
      target: 95.0,
      status: "good",
    },
    {
      category: "Safety Score",
      current: 98.1,
      target: 98.0,
      status: "excellent",
    },
    {
      category: "Productivity Index",
      current: 87.5,
      target: 90.0,
      status: "needs-improvement",
    },
    {
      category: "Cost Optimization",
      current: 12.3,
      target: 10.0,
      status: "excellent",
    },
  ];

  const departmentData = [
    {
      name: "Operations",
      employees: 145,
      efficiency: 96,
      budget: "₹50 Cr",
      status: "excellent",
    },
    {
      name: "Engineering", 
      employees: 89,
      efficiency: 91,
      budget: "₹35 Cr",
      status: "good",
    },
    {
      name: "Human Resources",
      employees: 15,
      efficiency: 88,
      budget: "₹5 Cr",
      status: "good",
    },
    {
      name: "Finance & Accounts",
      employees: 22,
      efficiency: 93,
      budget: "₹12 Cr",
      status: "good",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-nalco-green text-white";
      case "good":
        return "bg-nalco-blue text-white";
      case "needs-improvement":
        return "bg-yellow-500 text-white";
      case "critical":
        return "bg-nalco-red text-white";
      default:
        return "bg-nalco-gray text-white";
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-nalco-green" />
    ) : (
      <TrendingDown className="h-4 w-4 text-nalco-red" />
    );
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
              onClick={() => navigate("/")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-nalco-black">
                Analytics Dashboard
              </h1>
              <p className="text-nalco-gray">
                Real-time insights and performance metrics for NALCO operations
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <Refresh className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
            <Button onClick={handleExport} className="bg-nalco-blue hover:bg-nalco-blue/90">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          {keyMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardContent className="flex items-center p-6">
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-nalco-gray">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-nalco-black">
                      {metric.value}
                    </p>
                    <div className="flex items-center">
                      {getTrendIcon(metric.trend)}
                      <span className="text-xs text-nalco-green ml-1">
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="text-nalco-black">
                Performance Indicators
              </CardTitle>
              <CardDescription>
                Current performance vs target metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-nalco-black">
                        {item.category}
                      </span>
                      <Badge className={getStatusColor(item.status)}>
                        {item.current}%
                      </Badge>
                    </div>
                    <div className="w-full bg-nalco-gray/20 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.current >= item.target
                            ? "bg-nalco-green"
                            : item.current >= item.target * 0.9
                            ? "bg-nalco-blue"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${Math.min(item.current, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-nalco-gray">
                      <span>Target: {item.target}%</span>
                      <span>
                        {item.current >= item.target ? "✓ Target met" : "◯ Below target"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-nalco-black">
                Department Performance
              </CardTitle>
              <CardDescription>
                Efficiency and resource allocation by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-nalco-gray/5 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nalco-blue/10">
                        <Building2 className="h-5 w-5 text-nalco-blue" />
                      </div>
                      <div>
                        <h4 className="font-medium text-nalco-black">
                          {dept.name}
                        </h4>
                        <p className="text-sm text-nalco-gray">
                          {dept.employees} employees • {dept.budget}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-nalco-black">
                        {dept.efficiency}%
                      </div>
                      <Badge className={getStatusColor(dept.status)}>
                        {dept.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-nalco-black">Trends & Insights</CardTitle>
              <CardDescription>
                Key trends and actionable insights for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium text-nalco-black">Positive Trends</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-nalco-green/10 rounded">
                      <span className="text-sm">Employee Engagement</span>
                      <span className="text-sm font-medium text-nalco-green">+15%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-nalco-green/10 rounded">
                      <span className="text-sm">System Usage</span>
                      <span className="text-sm font-medium text-nalco-green">+23%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-nalco-green/10 rounded">
                      <span className="text-sm">Safety Score</span>
                      <span className="text-sm font-medium text-nalco-green">+8%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-nalco-black">Improvements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-nalco-blue/10 rounded">
                      <span className="text-sm">Issue Resolution Time</span>
                      <span className="text-sm font-medium text-nalco-blue">-18%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-nalco-blue/10 rounded">
                      <span className="text-sm">Safety Incidents</span>
                      <span className="text-sm font-medium text-nalco-blue">-42%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-nalco-blue/10 rounded">
                      <span className="text-sm">Operating Costs</span>
                      <span className="text-sm font-medium text-nalco-blue">-12%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-nalco-black">Recommendations</CardTitle>
            <CardDescription>
              Data-driven recommendations for operational improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-nalco-green mt-0.5" />
                  <div>
                    <h4 className="font-medium text-nalco-black">
                      Continue Safety Focus
                    </h4>
                    <p className="text-sm text-nalco-gray">
                      Safety initiatives are showing excellent results. Expand safety training programs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <BarChart3 className="h-5 w-5 text-nalco-blue mt-0.5" />
                  <div>
                    <h4 className="font-medium text-nalco-black">
                      Digital Transformation
                    </h4>
                    <p className="text-sm text-nalco-gray">
                      Accelerate digital initiatives to maintain competitive advantage.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Users className="h-5 w-5 text-nalco-red mt-0.5" />
                  <div>
                    <h4 className="font-medium text-nalco-black">
                      Cross-Departmental Collaboration
                    </h4>
                    <p className="text-sm text-nalco-gray">
                      Increase collaboration between departments to improve overall efficiency.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-nalco-black">
                      Predictive Maintenance
                    </h4>
                    <p className="text-sm text-nalco-gray">
                      Implement predictive maintenance systems to reduce downtime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
