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
import { ArrowLeft, Clock, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Attendance() {
  const navigate = useNavigate();

  const attendanceData = [
    {
      date: "2024-03-25",
      checkIn: "09:15 AM",
      checkOut: "06:30 PM",
      hours: "8h 45m",
      status: "Present",
      overtime: "30m",
    },
    {
      date: "2024-03-24",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      hours: "8h 30m",
      status: "Present",
      overtime: "0m",
    },
    {
      date: "2024-03-23",
      checkIn: "09:30 AM",
      checkOut: "06:15 PM",
      hours: "8h 15m",
      status: "Present",
      overtime: "0m",
    },
    {
      date: "2024-03-22",
      checkIn: "-",
      checkOut: "-",
      hours: "0h",
      status: "Leave",
      overtime: "0m",
    },
    {
      date: "2024-03-21",
      checkIn: "09:45 AM",
      checkOut: "06:45 PM",
      hours: "8h 30m",
      status: "Present",
      overtime: "30m",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-nalco-green text-white";
      case "leave":
        return "bg-nalco-blue text-white";
      case "absent":
        return "bg-nalco-red text-white";
      case "partial":
        return "bg-yellow-500 text-white";
      default:
        return "bg-nalco-gray text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return <CheckCircle className="h-4 w-4" />;
      case "absent":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center">
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
            <h1 className="text-3xl font-bold text-nalco-black">Attendance</h1>
            <p className="text-nalco-gray">
              View your attendance and working hours
            </p>
          </div>
        </div>

        {/* Today's Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-nalco-black">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="h-16 w-16 rounded-full bg-nalco-green/10 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-nalco-green" />
                  </div>
                </div>
                <p className="text-sm text-nalco-gray">Check In</p>
                <p className="text-xl font-bold text-nalco-black">09:15 AM</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="h-16 w-16 rounded-full bg-nalco-red/10 flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-nalco-red" />
                  </div>
                </div>
                <p className="text-sm text-nalco-gray">Check Out</p>
                <p className="text-xl font-bold text-nalco-black">-</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="h-16 w-16 rounded-full bg-nalco-blue/10 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-nalco-blue" />
                  </div>
                </div>
                <p className="text-sm text-nalco-gray">Hours Today</p>
                <p className="text-xl font-bold text-nalco-black">7h 45m</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Button className="bg-nalco-red hover:bg-nalco-red/90">
                    Check Out
                  </Button>
                </div>
                <p className="text-sm text-nalco-gray">Current Status</p>
                <Badge className="bg-nalco-green text-white">Working</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Summary */}
        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="h-8 w-8 text-nalco-green" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Days Present
                </p>
                <p className="text-2xl font-bold text-nalco-black">20</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-nalco-blue" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Total Hours
                </p>
                <p className="text-2xl font-bold text-nalco-black">168h</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">Overtime</p>
                <p className="text-2xl font-bold text-nalco-black">12h</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <XCircle className="h-8 w-8 text-nalco-red" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Days Absent
                </p>
                <p className="text-2xl font-bold text-nalco-black">2</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-nalco-black">
              Recent Attendance
            </CardTitle>
            <CardDescription>
              Your attendance record for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceData.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-nalco-gray/10">
                      {getStatusIcon(record.status)}
                    </div>
                    <div>
                      <h4 className="font-medium text-nalco-black">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h4>
                      <p className="text-sm text-nalco-gray">
                        {record.checkIn} - {record.checkOut} • {record.hours}
                        {record.overtime !== "0m" && (
                          <span className="text-yellow-600">
                            {" "}
                            (+{record.overtime} OT)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Policies */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-nalco-black">
              Attendance Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-nalco-black mb-2">
                  Working Hours
                </h4>
                <ul className="text-sm text-nalco-gray space-y-1">
                  <li>• Standard hours: 9:00 AM - 6:00 PM</li>
                  <li>• Core hours: 10:00 AM - 4:00 PM</li>
                  <li>• Lunch break: 1 hour (12:00 PM - 1:00 PM)</li>
                  <li>• Minimum daily hours: 8 hours</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-nalco-black mb-2">
                  Attendance Rules
                </h4>
                <ul className="text-sm text-nalco-gray space-y-1">
                  <li>• Grace period: 15 minutes for check-in</li>
                  <li>• Late arrival: Report to supervisor</li>
                  <li>• Overtime: Requires pre-approval</li>
                  <li>• Missing punch: Submit attendance correction</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
