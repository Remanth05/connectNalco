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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthorityAttendance() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for attendance tracking
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [teamAttendance, setTeamAttendance] = useState([]);

  // Load attendance data from localStorage on mount
  useEffect(() => {
    const savedAttendance = localStorage.getItem(
      `attendance_${user?.employeeId}`,
    );
    if (savedAttendance) {
      const data = JSON.parse(savedAttendance);
      const today = new Date().toDateString();
      const todayData = data.find((record: any) => record.date === today);

      if (todayData) {
        setCheckedIn(!!todayData.checkIn);
        setCheckedOut(!!todayData.checkOut);
        setCheckInTime(todayData.checkIn);
        setCheckOutTime(todayData.checkOut);
      }
      setAttendanceData(data);
    } else {
      // Initialize with default data
      const defaultData = [
        {
          date: "2024-03-25",
          checkIn: "08:45 AM",
          checkOut: "07:15 PM",
          hours: "9h 30m",
          status: "Present",
          overtime: "1h 30m",
        },
        {
          date: "2024-03-24",
          checkIn: "08:30 AM",
          checkOut: "06:45 PM",
          hours: "9h 15m",
          status: "Present",
          overtime: "1h 15m",
        },
      ];
      setAttendanceData(defaultData);
    }

    // Load team attendance data
    const teamData = [
      {
        name: "Rajesh Kumar Singh",
        id: "EMP001",
        checkIn: "09:15 AM",
        checkOut: "06:30 PM",
        status: "Present",
        hours: "8h 45m",
        overtime: "30m",
      },
      {
        name: "Sunita Devi",
        id: "EMP002",
        checkIn: "09:00 AM",
        checkOut: "-",
        status: "Working",
        hours: "6h 30m",
        overtime: "0m",
      },
      {
        name: "Mohammad Alam",
        id: "EMP003",
        checkIn: "-",
        checkOut: "-",
        status: "Leave",
        hours: "0h",
        overtime: "0m",
      },
    ];
    setTeamAttendance(teamData);
  }, [user]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const calculateWorkingHours = () => {
    if (!checkInTime) return "0h 0m";

    try {
      const checkInDateTime = new Date(
        `${new Date().toDateString()} ${checkInTime}`,
      );
      const currentOrCheckOut =
        checkedOut && checkOutTime
          ? new Date(`${new Date().toDateString()} ${checkOutTime}`)
          : currentTime;

      if (
        isNaN(checkInDateTime.getTime()) ||
        isNaN(currentOrCheckOut.getTime())
      ) {
        return "0h 0m";
      }

      const diffMs = currentOrCheckOut.getTime() - checkInDateTime.getTime();

      if (diffMs < 0) {
        return "0h 0m";
      }

      const diffHours = diffMs / (1000 * 60 * 60);
      const hours = Math.floor(diffHours);
      const minutes = Math.floor((diffHours - hours) * 60);

      if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0) {
        return "0h 0m";
      }

      return `${hours}h ${minutes}m`;
    } catch (error) {
      console.error("Error calculating working hours:", error);
      return "0h 0m";
    }
  };

  const handleCheckIn = async () => {
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const checkInTimeString = currentTime.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCheckedIn(true);
      setCheckInTime(checkInTimeString);
      setSuccess(`Successfully checked in at ${checkInTimeString}`);

      const today = new Date().toDateString();
      const updatedData = [...attendanceData];
      const todayIndex = updatedData.findIndex(
        (record: any) => record.date === today,
      );

      const todayRecord = {
        date: today,
        checkIn: checkInTimeString,
        checkOut: checkedOut ? checkOutTime : "-",
        hours: checkedOut ? calculateWorkingHours() : "-",
        status: "Present",
        overtime: "0m",
      };

      if (todayIndex >= 0) {
        updatedData[todayIndex] = todayRecord;
      } else {
        updatedData.unshift(todayRecord);
      }

      setAttendanceData(updatedData);
      localStorage.setItem(
        `attendance_${user?.employeeId}`,
        JSON.stringify(updatedData),
      );
    } catch (error) {
      setError("Failed to check in. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const checkOutTimeString = currentTime.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCheckedOut(true);
      setCheckOutTime(checkOutTimeString);
      setSuccess(`Successfully checked out at ${checkOutTimeString}`);

      const today = new Date().toDateString();
      const updatedData = [...attendanceData];
      const todayIndex = updatedData.findIndex(
        (record: any) => record.date === today,
      );

      // Calculate working hours with the new checkout time
      const checkInDateTime = checkInTime
        ? new Date(`${today} ${checkInTime}`)
        : null;
      const checkOutDateTime = new Date(`${today} ${checkOutTimeString}`);

      let calculatedHours = "0h 0m";
      if (
        checkInDateTime &&
        !isNaN(checkInDateTime.getTime()) &&
        !isNaN(checkOutDateTime.getTime())
      ) {
        const diffMs = checkOutDateTime.getTime() - checkInDateTime.getTime();
        if (diffMs > 0) {
          const diffHours = diffMs / (1000 * 60 * 60);
          const hours = Math.floor(diffHours);
          const minutes = Math.floor((diffHours - hours) * 60);
          calculatedHours = `${hours}h ${minutes}m`;
        }
      }

      // Calculate overtime (assuming standard 8 hours)
      const totalMinutes =
        checkInDateTime &&
        !isNaN(checkInDateTime.getTime()) &&
        !isNaN(checkOutDateTime.getTime())
          ? Math.max(
              0,
              (checkOutDateTime.getTime() - checkInDateTime.getTime()) /
                (1000 * 60) -
                480,
            ) // 480 minutes = 8 hours
          : 0;
      const overtimeHours = Math.floor(totalMinutes / 60);
      const overtimeMinutes = Math.floor(totalMinutes % 60);
      const overtime =
        totalMinutes > 0 ? `${overtimeHours}h ${overtimeMinutes}m` : "0m";

      const todayRecord = {
        date: today,
        checkIn: checkInTime || "-",
        checkOut: checkOutTimeString,
        hours: calculatedHours,
        status: "Present",
        overtime: overtime,
      };

      if (todayIndex >= 0) {
        updatedData[todayIndex] = todayRecord;
      } else {
        updatedData.unshift(todayRecord);
      }

      setAttendanceData(updatedData);
      localStorage.setItem(
        `attendance_${user?.employeeId}`,
        JSON.stringify(updatedData),
      );
    } catch (error) {
      setError("Failed to check out. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-nalco-green text-white";
      case "working":
        return "bg-nalco-blue text-white";
      case "leave":
        return "bg-yellow-500 text-white";
      case "absent":
        return "bg-nalco-red text-white";
      default:
        return "bg-nalco-gray text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return <CheckCircle className="h-4 w-4" />;
      case "working":
        return <Clock className="h-4 w-4" />;
      case "absent":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleExportAttendance = () => {
    const csvContent = `Name,Employee ID,Check In,Check Out,Status,Hours,Overtime\n${teamAttendance
      .map(
        (emp) =>
          `${emp.name},${emp.id},${emp.checkIn},${emp.checkOut},${emp.status},${emp.hours},${emp.overtime}`,
      )
      .join("\n")}`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `team_attendance_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              onClick={() => navigate("/authority/dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-nalco-black">
                Attendance Management
              </h1>
              <p className="text-nalco-gray">
                Manage your attendance and monitor team presence
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportAttendance}>
              <Download className="h-4 w-4 mr-2" />
              Export Team Data
            </Button>
          </div>
        </div>

        {/* Personal Attendance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-nalco-black">
              <Calendar className="h-5 w-5 mr-2" />
              My Attendance -{" "}
              {currentTime.toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4 border-nalco-green bg-nalco-green/10">
                <AlertDescription className="text-nalco-green">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {!checkedIn ? (
                    <Button
                      className="bg-nalco-green hover:bg-nalco-green/90 h-16 w-32"
                      onClick={handleCheckIn}
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Checking In...
                        </>
                      ) : (
                        "Check In"
                      )}
                    </Button>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-nalco-green/10 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-nalco-green" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-nalco-gray">Check In</p>
                <p className="text-xl font-bold text-nalco-black">
                  {checkInTime || "-"}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {checkedOut ? (
                    <div className="h-16 w-16 rounded-full bg-nalco-red/10 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-nalco-red" />
                    </div>
                  ) : (
                    <Button
                      className="bg-nalco-red hover:bg-nalco-red/90 h-16 w-32"
                      onClick={handleCheckOut}
                      disabled={!checkedIn || processing}
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Checking Out...
                        </>
                      ) : !checkedIn ? (
                        "Check In First"
                      ) : (
                        "Check Out"
                      )}
                    </Button>
                  )}
                </div>
                <p className="text-sm text-nalco-gray">Check Out</p>
                <p className="text-xl font-bold text-nalco-black">
                  {checkedOut ? checkOutTime : "-"}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="h-16 w-16 rounded-full bg-nalco-blue/10 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-nalco-blue" />
                  </div>
                </div>
                <p className="text-sm text-nalco-gray">Hours Today</p>
                <p className="text-xl font-bold text-nalco-black">
                  {calculateWorkingHours()}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="h-16 w-16 rounded-full bg-nalco-blue/10 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-nalco-blue" />
                  </div>
                </div>
                <p className="text-sm text-nalco-gray">Current Status</p>
                <Badge
                  className={
                    checkedOut
                      ? "bg-nalco-red text-white"
                      : checkedIn
                        ? "bg-nalco-green text-white"
                        : "bg-nalco-gray text-white"
                  }
                >
                  {checkedOut
                    ? "Checked Out"
                    : checkedIn
                      ? "Working"
                      : "Not Checked In"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Attendance Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-nalco-black">
              <Users className="h-5 w-5 mr-2" />
              Team Attendance Today
            </CardTitle>
            <CardDescription>
              Current status of your team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {teamAttendance.map((employee, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-nalco-black">
                        {employee.name}
                      </h4>
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-nalco-gray mb-1">
                      ID: {employee.id}
                    </p>
                    <div className="text-xs text-nalco-gray space-y-1">
                      <p>In: {employee.checkIn}</p>
                      <p>Out: {employee.checkOut}</p>
                      <p>Hours: {employee.hours}</p>
                      {employee.overtime !== "0m" && (
                        <p className="text-yellow-600">
                          OT: {employee.overtime}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Statistics */}
        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-nalco-blue" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Team Present
                </p>
                <p className="text-2xl font-bold text-nalco-black">2/3</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-nalco-green" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">Avg Hours</p>
                <p className="text-2xl font-bold text-nalco-black">8.5h</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Total Overtime
                </p>
                <p className="text-2xl font-bold text-nalco-black">1.5h</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <CheckCircle className="h-8 w-8 text-nalco-green" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-nalco-black">94%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-nalco-black">
              Recent Attendance History
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
      </div>
    </Layout>
  );
}
