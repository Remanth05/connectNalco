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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDataSync, syncAttendanceUpdate } from "@/hooks/useDataSync";

export default function Attendance() {
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
  const [isWorkingDay, setIsWorkingDay] = useState(true);

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
      setAttendanceData(defaultData);
    }
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

      // Validate dates
      if (
        isNaN(checkInDateTime.getTime()) ||
        isNaN(currentOrCheckOut.getTime())
      ) {
        return "0h 0m";
      }

      const diffMs = currentOrCheckOut.getTime() - checkInDateTime.getTime();

      // Ensure positive difference
      if (diffMs < 0) {
        return "0h 0m";
      }

      const diffHours = diffMs / (1000 * 60 * 60);
      const hours = Math.floor(diffHours);
      const minutes = Math.floor((diffHours - hours) * 60);

      // Validate calculated values
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

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCheckedIn(true);
      setCheckInTime(checkInTimeString);
      setSuccess(`Successfully checked in at ${checkInTimeString}`);

      // Save to localStorage
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

      // Sync attendance update across the system
      if (user?.employeeId) {
        syncAttendanceUpdate(todayRecord, user.employeeId);
      }
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

      // Simulate API call to update attendance
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCheckedOut(true);
      setCheckOutTime(checkOutTimeString);
      setSuccess(`Successfully checked out at ${checkOutTimeString}`);

      // Update localStorage
      const today = new Date().toDateString();
      const updatedData = [...attendanceData];
      const todayIndex = updatedData.findIndex(
        (record: any) => record.date === today,
      );

      // Update check out time first to calculate correct working hours
      setCheckOutTime(checkOutTimeString);

      // Calculate working hours with the new checkout time
      const checkInDateTime = checkInTime ? new Date(`${today} ${checkInTime}`) : null;
      const checkOutDateTime = new Date(`${today} ${checkOutTimeString}`);

      let calculatedHours = "0h 0m";
      if (checkInDateTime && !isNaN(checkInDateTime.getTime()) && !isNaN(checkOutDateTime.getTime())) {
        const diffMs = checkOutDateTime.getTime() - checkInDateTime.getTime();
        if (diffMs > 0) {
          const diffHours = diffMs / (1000 * 60 * 60);
          const hours = Math.floor(diffHours);
          const minutes = Math.floor((diffHours - hours) * 60);
          calculatedHours = `${hours}h ${minutes}m`;
        }
      }

      // Calculate overtime (assuming standard 8 hours)
      const totalMinutes = checkInDateTime && !isNaN(checkInDateTime.getTime()) && !isNaN(checkOutDateTime.getTime())
        ? Math.max(0, (checkOutDateTime.getTime() - checkInDateTime.getTime()) / (1000 * 60) - 480) // 480 minutes = 8 hours
        : 0;
      const overtimeHours = Math.floor(totalMinutes / 60);
      const overtimeMinutes = Math.floor(totalMinutes % 60);
      const overtime = totalMinutes > 0 ? `${overtimeHours}h ${overtimeMinutes}m` : "0m";

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

      // Sync attendance update across the system
      if (user?.employeeId) {
        syncAttendanceUpdate(todayRecord, user.employeeId);
      }
    } catch (error) {
      setError("Failed to check out. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // attendanceData is now managed in state and loaded from localStorage

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
              Today's Status -{" "}
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
                  <div
                    className={`h-16 w-16 rounded-full ${checkedOut ? "bg-nalco-green/10" : "bg-nalco-red/10"} flex items-center justify-center`}
                  >
                    {checkedOut ? (
                      <CheckCircle className="h-8 w-8 text-nalco-green" />
                    ) : (
                      <XCircle className="h-8 w-8 text-nalco-red" />
                    )}
                  </div>
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
