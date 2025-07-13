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
import { ArrowLeft, Calendar, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Leave() {
  const navigate = useNavigate();

  const leaveApplications = [
    {
      id: "LA001",
      type: "Annual Leave",
      dates: "2024-03-15 to 2024-03-17",
      days: 3,
      status: "Approved",
      appliedOn: "2024-02-28",
    },
    {
      id: "LA002",
      type: "Sick Leave",
      dates: "2024-02-20 to 2024-02-21",
      days: 2,
      status: "Approved",
      appliedOn: "2024-02-19",
    },
    {
      id: "LA003",
      type: "Personal Leave",
      dates: "2024-04-10 to 2024-04-12",
      days: 3,
      status: "Pending",
      appliedOn: "2024-03-25",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-nalco-green text-white";
      case "pending":
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
                Leave Management
              </h1>
              <p className="text-nalco-gray">
                Apply for leave and track your applications
              </p>
            </div>
          </div>
          <Button className="bg-nalco-red hover:bg-nalco-red/90">
            <Plus className="h-4 w-4 mr-2" />
            Apply for Leave
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Leave Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-nalco-black">
                <Calendar className="h-5 w-5 mr-2" />
                Leave Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-nalco-red">12</p>
                <p className="text-sm text-nalco-gray">Days Remaining</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Annual Leave</span>
                  <span className="font-medium">8 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sick Leave</span>
                  <span className="font-medium">4 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Personal Leave</span>
                  <span className="font-medium">0 days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Leave Application */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-nalco-black">
                New Leave Application
              </CardTitle>
              <CardDescription>Submit a new leave request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="emergency">Emergency Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="half-day">Half Day</SelectItem>
                      <SelectItem value="full-day">Full Day</SelectItem>
                      <SelectItem value="multiple">Multiple Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for your leave request"
                  rows={3}
                />
              </div>

              <Button className="bg-nalco-blue hover:bg-nalco-blue/90">
                Submit Application
              </Button>
            </CardContent>
          </Card>

          {/* Leave History */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-nalco-black">Leave History</CardTitle>
              <CardDescription>
                Your recent leave applications and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nalco-blue/10">
                        <Clock className="h-5 w-5 text-nalco-blue" />
                      </div>
                      <div>
                        <h4 className="font-medium text-nalco-black">
                          {application.type}
                        </h4>
                        <p className="text-sm text-nalco-gray">
                          {application.dates} • {application.days} day(s)
                        </p>
                        <p className="text-xs text-nalco-gray">
                          Applied on {application.appliedOn}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
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
      </div>
    </Layout>
  );
}
