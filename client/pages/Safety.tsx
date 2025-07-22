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
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Plus,
  Eye,
  Download,
  Calendar,
  Bell,
  BarChart3,
  TrendingDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Safety() {
  const navigate = useNavigate();
  const [newIncidentDialog, setNewIncidentDialog] = useState(false);

  const handleReportIncident = () => {
    alert("Safety incident reported successfully!\n\nIncident ID: INC" + Date.now() + "\nStatus: Under Investigation\nAssigned to: Safety Officer\n\nYou will receive updates via email and notifications.");
    setNewIncidentDialog(false);
  };

  const handleExportReport = () => {
    const safetyReport = `
NALCO SAFETY MANAGEMENT REPORT
Generated: ${new Date().toLocaleString()}

SAFETY OVERVIEW:
- Safety Score: 98.1%
- Zero-incident days: 127 days
- Last incident: March 15, 2024 (Minor - First Aid)
- Safety compliance: 99.2%

INCIDENT STATISTICS (Last 6 Months):
- Total incidents: 8
- Critical incidents: 0
- Major incidents: 1
- Minor incidents: 7
- Near misses: 23

SAFETY METRICS:
- Lost Time Injury Rate: 0.12 per 200,000 hours
- Total Recordable Rate: 0.85 per 200,000 hours
- Safety Training Completion: 96.8%
- PPE Compliance: 98.5%

DEPARTMENT SAFETY SCORES:
- Operations: 97.8%
- Engineering: 98.9%
- Maintenance: 96.2%
- Administration: 99.1%

SAFETY INITIATIVES:
✓ Monthly safety meetings conducted
✓ Emergency drill compliance: 100%
✓ Safety equipment inspections: Current
✓ Incident investigation protocols: Active

RECOMMENDATIONS:
1. Continue focus on proactive safety measures
2. Enhance maintenance safety protocols
3. Expand safety training for contractors
4. Update emergency response procedures

SAFETY OFFICER: Dr. Anita Sharma
REPORT STATUS: Current and Accurate
    `;

    const blob = new Blob([safetyReport], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nalco_safety_report_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const safetyMetrics = [
    {
      title: "Safety Score",
      value: "98.1%",
      change: "+0.7%",
      icon: Shield,
      color: "text-nalco-green",
      status: "excellent",
    },
    {
      title: "Zero-Incident Days",
      value: "127",
      change: "+15",
      icon: CheckCircle,
      color: "text-nalco-green",
      status: "excellent",
    },
    {
      title: "Open Incidents",
      value: "3",
      change: "-2",
      icon: AlertTriangle,
      color: "text-yellow-600",
      status: "monitoring",
    },
    {
      title: "Safety Training",
      value: "96.8%",
      change: "+2.1%",
      icon: Users,
      color: "text-nalco-blue",
      status: "good",
    },
  ];

  const recentIncidents = [
    {
      id: "INC20240325001",
      type: "Minor",
      description: "Slip and fall in cafeteria",
      location: "Administrative Block",
      reportedBy: "John Smith",
      date: "March 25, 2024",
      status: "Closed",
      severity: "low",
    },
    {
      id: "INC20240322002",
      type: "Near Miss",
      description: "Unsecured equipment observed",
      location: "Plant Area 2",
      reportedBy: "Safety Inspector",
      date: "March 22, 2024",
      status: "Investigating",
      severity: "medium",
    },
    {
      id: "INC20240320003",
      type: "Equipment",
      description: "Safety guard malfunction",
      location: "Manufacturing Unit",
      reportedBy: "Operator Team",
      date: "March 20, 2024",
      status: "Resolved",
      severity: "high",
    },
    {
      id: "INC20240315004",
      type: "Minor",
      description: "First aid required for cut",
      location: "Maintenance Shop",
      reportedBy: "Maintenance Staff",
      date: "March 15, 2024",
      status: "Closed",
      severity: "low",
    },
  ];

  const safetyProtocols = [
    {
      title: "Personal Protective Equipment (PPE)",
      compliance: 98.5,
      lastUpdate: "March 20, 2024",
      status: "current",
    },
    {
      title: "Emergency Response Procedures",
      compliance: 95.2,
      lastUpdate: "February 15, 2024",
      status: "needs-update",
    },
    {
      title: "Chemical Handling Protocols",
      compliance: 99.1,
      lastUpdate: "March 18, 2024",
      status: "current",
    },
    {
      title: "Fire Safety Measures",
      compliance: 97.8,
      lastUpdate: "March 10, 2024",
      status: "current",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-nalco-green text-white";
      case "good":
        return "bg-nalco-blue text-white";
      case "monitoring":
        return "bg-yellow-500 text-white";
      case "critical":
        return "bg-nalco-red text-white";
      default:
        return "bg-nalco-gray text-white";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-nalco-green text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "high":
        return "bg-nalco-red text-white";
      default:
        return "bg-nalco-gray text-white";
    }
  };

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case "Closed":
      case "Resolved":
        return "bg-nalco-green text-white";
      case "Investigating":
        return "bg-nalco-blue text-white";
      case "Open":
        return "bg-yellow-500 text-white";
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
              onClick={() => navigate("/")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-nalco-black">
                Safety Management
              </h1>
              <p className="text-nalco-gray">
                Comprehensive safety monitoring and incident management system
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Dialog open={newIncidentDialog} onOpenChange={setNewIncidentDialog}>
              <DialogTrigger asChild>
                <Button className="bg-nalco-red hover:bg-nalco-red/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Report Incident
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Report Safety Incident</DialogTitle>
                  <DialogDescription>
                    Report any safety incident, near miss, or concern immediately
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Incident Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="injury">Personal Injury</SelectItem>
                        <SelectItem value="near-miss">Near Miss</SelectItem>
                        <SelectItem value="equipment">Equipment Related</SelectItem>
                        <SelectItem value="environmental">Environmental</SelectItem>
                        <SelectItem value="fire">Fire/Explosion</SelectItem>
                        <SelectItem value="chemical">Chemical Exposure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Severity Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Minor injury/no treatment</SelectItem>
                        <SelectItem value="medium">Medium - First aid required</SelectItem>
                        <SelectItem value="high">High - Medical attention required</SelectItem>
                        <SelectItem value="critical">Critical - Emergency response</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input placeholder="Exact location of incident" />
                  </div>
                  <div>
                    <Label>Date & Time</Label>
                    <Input type="datetime-local" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>People Involved</Label>
                    <Input placeholder="Names and employee IDs" />
                  </div>
                </div>
                <div>
                  <Label>Incident Description</Label>
                  <Textarea 
                    placeholder="Provide detailed description of what happened, including immediate actions taken"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Immediate Actions Taken</Label>
                  <Textarea 
                    placeholder="Describe any immediate corrective actions or first aid provided"
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewIncidentDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-nalco-red hover:bg-nalco-red/90"
                    onClick={handleReportIncident}
                  >
                    Submit Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Safety Metrics */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          {safetyMetrics.map((metric, index) => {
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
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Incidents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-nalco-black">Recent Incidents</CardTitle>
              <CardDescription>
                Latest safety incidents and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIncidents.map((incident, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-nalco-gray/10">
                        <AlertTriangle className="h-5 w-5 text-nalco-gray" />
                      </div>
                      <div>
                        <h4 className="font-medium text-nalco-black">
                          {incident.description}
                        </h4>
                        <p className="text-sm text-nalco-gray">
                          {incident.id} • {incident.location} • {incident.date}
                        </p>
                        <p className="text-xs text-nalco-gray">
                          Reported by: {incident.reportedBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getIncidentStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.type}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Incident Details - {incident.id}</DialogTitle>
                            <DialogDescription>
                              Complete information about this safety incident
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <Label>Incident ID</Label>
                                <Input value={incident.id} disabled />
                              </div>
                              <div>
                                <Label>Type</Label>
                                <Input value={incident.type} disabled />
                              </div>
                              <div>
                                <Label>Date Reported</Label>
                                <Input value={incident.date} disabled />
                              </div>
                              <div>
                                <Label>Location</Label>
                                <Input value={incident.location} disabled />
                              </div>
                              <div>
                                <Label>Reported By</Label>
                                <Input value={incident.reportedBy} disabled />
                              </div>
                              <div>
                                <Label>Current Status</Label>
                                <Input value={incident.status} disabled />
                              </div>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea value={incident.description} disabled rows={3} />
                            </div>
                            <div>
                              <Label>Investigation Notes</Label>
                              <Textarea 
                                value="Initial investigation completed. Root cause identified as inadequate floor marking. Corrective action: Floor has been properly marked and anti-slip mats installed."
                                disabled
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label>Corrective Actions</Label>
                              <Textarea 
                                value="1. Floor re-marked with safety tape\n2. Anti-slip mats installed\n3. Additional signage placed\n4. Staff briefed on area hazards"
                                disabled
                                rows={4}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Close</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Protocols */}
          <Card>
            <CardHeader>
              <CardTitle className="text-nalco-black">Safety Protocols</CardTitle>
              <CardDescription>
                Current status of safety protocols and compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {safetyProtocols.map((protocol, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-nalco-black text-sm">
                        {protocol.title}
                      </h4>
                      <Badge 
                        className={
                          protocol.status === "current" 
                            ? "bg-nalco-green text-white" 
                            : "bg-yellow-500 text-white"
                        }
                      >
                        {protocol.compliance}%
                      </Badge>
                    </div>
                    <div className="w-full bg-nalco-gray/20 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          protocol.compliance >= 98
                            ? "bg-nalco-green"
                            : protocol.compliance >= 95
                            ? "bg-nalco-blue"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${protocol.compliance}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-nalco-gray">
                      <span>Updated: {protocol.lastUpdate}</span>
                      <span>
                        {protocol.status === "current" ? "✓ Current" : "⚠ Needs Update"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Safety Statistics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-nalco-black">Safety Statistics</CardTitle>
            <CardDescription>
              Key safety metrics and performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-nalco-green mb-2">0.12</div>
                <div className="text-sm text-nalco-gray">Lost Time Injury Rate</div>
                <div className="text-xs text-nalco-gray">per 200,000 hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-nalco-blue mb-2">0.85</div>
                <div className="text-sm text-nalco-gray">Total Recordable Rate</div>
                <div className="text-xs text-nalco-gray">per 200,000 hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-nalco-green mb-2">96.8%</div>
                <div className="text-sm text-nalco-gray">Training Completion</div>
                <div className="text-xs text-nalco-gray">all employees</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-nalco-black">Emergency Contacts</CardTitle>
            <CardDescription>
              Important contact information for emergency situations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-nalco-black mb-2">
                  <Bell className="h-4 w-4 inline mr-2" />
                  Emergency Services
                </h4>
                <p className="text-sm text-nalco-gray">Fire/Medical: 108</p>
                <p className="text-sm text-nalco-gray">Police: 100</p>
                <p className="text-sm text-nalco-gray">Plant Security: 2345</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-nalco-black mb-2">
                  <Users className="h-4 w-4 inline mr-2" />
                  Safety Team
                </h4>
                <p className="text-sm text-nalco-gray">Safety Officer: Dr. Anita Sharma</p>
                <p className="text-sm text-nalco-gray">Phone: +91-9876543201</p>
                <p className="text-sm text-nalco-gray">Email: safety@nalco.com</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-nalco-black mb-2">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Medical Support
                </h4>
                <p className="text-sm text-nalco-gray">Plant Medical Center: 2350</p>
                <p className="text-sm text-nalco-gray">First Aid Stations: 4 locations</p>
                <p className="text-sm text-nalco-gray">Nearest Hospital: 5km</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
