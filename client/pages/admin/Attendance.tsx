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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Building2,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminAttendance() {
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
  const [allEmployeesAttendance, setAllEmployeesAttendance] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
          checkIn: "08:30 AM",
          checkOut: "08:00 PM",
          hours: "10h 30m",
          status: "Present",
          overtime: "2h 30m",
        },
        {
          date: "2024-03-24",
          checkIn: "08:15 AM",
          checkOut: "07:45 PM",
          hours: "10h 30m",
          status: "Present",
          overtime: "2h 30m",
        },
      ];
      setAttendanceData(defaultData);
    }

    // Load all employees attendance data
    const allEmployeesData = [
      {
        name: "Rajesh Kumar Singh",
        id: "EMP001",
        department: "HR",
        designation: "HR Executive",
        checkIn: "09:15 AM",
        checkOut: "06:30 PM",
        status: "Present",
        hours: "8h 45m",
        overtime: "30m",
      },
      {
        name: "Dr. Priya Sharma",
        id: "AUTH001",
        department: "HR",
        designation: "HR Manager",
        checkIn: "08:45 AM",
        checkOut: "07:15 PM",
        status: "Present",
        hours: "9h 30m",
        overtime: "1h 30m",
      },
      {
        name: "Vikram Patel",
        id: "ADMIN001",
        department: "Admin",
        designation: "System Admin",
        checkIn: "08:30 AM",
        checkOut: "08:00 PM",
        status: "Present",
        hours: "10h 30m",
        overtime: "2h 30m",
      },
      {
        name: "Sunita Devi",
        id: "EMP002",
        department: "HR",
        designation: "HR Assistant",
        checkIn: "09:00 AM",
        checkOut: "-",
        status: "Working",
        hours: "6h 30m",
        overtime: "0m",
      },
      {
        name: "Mohammad Alam",
        id: "EMP003",
        department: "Operations",
        designation: "Trainee",
        checkIn: "-",
        checkOut: "-",
        status: "Leave",
        hours: "0h",
        overtime: "0m",
      },
      {
        name: "Ramesh Chandran",
        id: "EMP004",
        department: "Operations",
        designation: "Plant Manager",
        checkIn: "08:00 AM",
        checkOut: "07:00 PM",
        status: "Present",
        hours: "10h",
        overtime: "2h",
      },
      {
        name: "Anita Das",
        id: "EMP005",
        department: "Engineering",
        designation: "Engineer",
        checkIn: "08:30 AM",
        checkOut: "06:45 PM",
        status: "Present",
        hours: "9h 15m",
        overtime: "1h 15m",
      },
      {
        name: "Suresh Babu",
        id: "EMP006",
        department: "Finance",
        designation: "Accountant",
        checkIn: "09:30 AM",
        checkOut: "06:15 PM",
        status: "Present",
        hours: "8h 15m",
        overtime: "0m",
      },
    ];
    setAllEmployeesAttendance(allEmployeesData);
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

  const getDepartmentColor = (department: string) => {
    switch (department.toLowerCase()) {
      case "hr":
        return "bg-nalco-blue/10 text-nalco-blue";
      case "engineering":
        return "bg-nalco-green/10 text-nalco-green";
      case "operations":
        return "bg-nalco-red/10 text-nalco-red";
      case "finance":
        return "bg-yellow-500/10 text-yellow-600";
      case "admin":
        return "bg-purple-500/10 text-purple-600";
      default:
        return "bg-nalco-gray/10 text-nalco-gray";
    }
  };

  const handleExportAttendance = () => {
    const filteredData = allEmployeesAttendance.filter(emp => {
      const matchesDepartment = selectedDepartment === "all" || emp.department.toLowerCase() === selectedDepartment;
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           emp.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDepartment && matchesSearch;
    });

    const csvContent = `Name,Employee ID,Department,Designation,Check In,Check Out,Status,Hours,Overtime\n${filteredData
      .map(
        (emp) =>
          `${emp.name},${emp.id},${emp.department},${emp.designation},${emp.checkIn},${emp.checkOut},${emp.status},${emp.hours},${emp.overtime}`,
      )
      .join("\n")}`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `organization_attendance_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredEmployees = allEmployeesAttendance.filter(emp => {
    const matchesDepartment = selectedDepartment === "all" || emp.department.toLowerCase() === selectedDepartment;
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  // Calculate organization statistics
  const presentEmployees = allEmployeesAttendance.filter(emp => emp.status === "Present").length;
  const totalEmployees = allEmployeesAttendance.length;
  const attendanceRate = Math.round((presentEmployees / totalEmployees) * 100);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-nalco-black">
                Organization Attendance
              </h1>
              <p className="text-nalco-gray">
                Monitor attendance across all departments and manage your own
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportAttendance}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Organization Statistics */}
        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-nalco-blue" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Total Employees
                </p>
                <p className="text-2xl font-bold text-nalco-black">{totalEmployees}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <CheckCircle className="h-8 w-8 text-nalco-green" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Present Today
                </p>
                <p className="text-2xl font-bold text-nalco-black">{presentEmployees}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <BarChart3 className="h-8 w-8 text-nalco-green" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-nalco-black">{attendanceRate}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Avg Hours
                </p>
                <p className="text-2xl font-bold text-nalco-black">8.7h</p>
              </div>
            </CardContent>
          </Card>
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

        {/* All Employees Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-nalco-black">
              <Building2 className="h-5 w-5 mr-2" />
              Organization Attendance Overview
            </CardTitle>
            <CardDescription>
              Current status of all employees across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1">
                <Label>Search Employee</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-nalco-gray" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label>Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEmployees.map((employee, index) => (
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
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-nalco-gray">
                        {employee.id}
                      </p>
                      <Badge className={getDepartmentColor(employee.department)}>
                        {employee.department}
                      </Badge>
                    </div>
                    <p className="text-xs text-nalco-gray mb-2">
                      {employee.designation}
                    </p>
                    <div className="text-xs text-nalco-gray space-y-1">
                      <p>In: {employee.checkIn}</p>
                      <p>Out: {employee.checkOut}</p>
                      <p>Hours: {employee.hours}</p>
                      {employee.overtime !== "0m" && (
                        <p className="text-yellow-600">OT: {employee.overtime}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-8">
                <p className="text-nalco-gray">No employees found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
