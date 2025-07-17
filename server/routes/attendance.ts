import { RequestHandler } from "express";
import { AttendanceRecord, AttendanceSummary } from "@shared/api";
import { mockAttendanceRecords, mockUsers } from "../data/mockData";

// In-memory storage
let attendanceRecords = [...mockAttendanceRecords];

// Get attendance records for an employee
export const getAttendanceRecords: RequestHandler = (req, res) => {
  const { employeeId } = req.params;
  const { startDate, endDate, month, year } = req.query;

  try {
    let employeeRecords = attendanceRecords.filter(
      (record) => record.employeeId === employeeId,
    );

    // Filter by date range
    if (startDate && endDate) {
      employeeRecords = employeeRecords.filter(
        (record) => record.date >= startDate && record.date <= endDate,
      );
    }

    // Filter by month and year
    if (month && year) {
      employeeRecords = employeeRecords.filter((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getMonth() + 1 === parseInt(month as string) &&
          recordDate.getFullYear() === parseInt(year as string)
        );
      });
    }

    // Sort by date (most recent first)
    employeeRecords.sort((a, b) => b.date.localeCompare(a.date));

    res.json({ success: true, data: employeeRecords });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch attendance records" });
  }
};

// Clock in/out
export const clockInOut: RequestHandler = (req, res) => {
  const { employeeId } = req.params;
  const { action, location } = req.body; // action: 'in' or 'out'

  try {
    const employee = mockUsers.find((user) => user.employeeId === employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    const today = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    // Find today's attendance record
    const existingRecordIndex = attendanceRecords.findIndex(
      (record) => record.employeeId === employeeId && record.date === today,
    );

    if (action === "in") {
      if (existingRecordIndex !== -1) {
        const existingRecord = attendanceRecords[existingRecordIndex];
        if (existingRecord.checkIn) {
          return res.status(400).json({
            success: false,
            error: "Already clocked in for today",
          });
        }
      }

      // Create or update record with clock in
      const recordData: AttendanceRecord = {
        id: `ATT${employeeId}_${today.replace(/-/g, "_")}`,
        employeeId,
        date: today,
        checkIn: currentTime,
        status: "present",
        location: location || "Office",
      };

      if (existingRecordIndex !== -1) {
        attendanceRecords[existingRecordIndex] = {
          ...attendanceRecords[existingRecordIndex],
          ...recordData,
        };
      } else {
        attendanceRecords.push(recordData);
      }

      res.json({
        success: true,
        data: recordData,
        message: "Clocked in successfully",
      });
    } else if (action === "out") {
      if (existingRecordIndex === -1) {
        return res.status(400).json({
          success: false,
          error: "No clock in record found for today",
        });
      }

      const record = attendanceRecords[existingRecordIndex];
      if (!record.checkIn) {
        return res.status(400).json({
          success: false,
          error: "Must clock in before clocking out",
        });
      }

      if (record.checkOut) {
        return res.status(400).json({
          success: false,
          error: "Already clocked out for today",
        });
      }

      // Calculate working hours
      const checkInTime = new Date(`${today}T${record.checkIn}:00`);
      const checkOutTime = new Date(`${today}T${currentTime}:00`);
      const workingHours =
        (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

      // Calculate overtime (assuming 8 hour work day)
      const overtimeHours = Math.max(0, workingHours - 8);

      const updatedRecord = {
        ...record,
        checkOut: currentTime,
        workingHours: Math.round(workingHours * 100) / 100,
        overtimeHours: Math.round(overtimeHours * 100) / 100,
      };

      attendanceRecords[existingRecordIndex] = updatedRecord;

      res.json({
        success: true,
        data: updatedRecord,
        message: "Clocked out successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid action. Use 'in' or 'out'",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to clock in/out" });
  }
};

// Get today's attendance status
export const getTodayAttendance: RequestHandler = (req, res) => {
  const { employeeId } = req.params;

  try {
    const today = new Date().toISOString().split("T")[0];
    const todayRecord = attendanceRecords.find(
      (record) => record.employeeId === employeeId && record.date === today,
    );

    const status = {
      date: today,
      hasClockIn: !!todayRecord?.checkIn,
      hasClockOut: !!todayRecord?.checkOut,
      checkIn: todayRecord?.checkIn || null,
      checkOut: todayRecord?.checkOut || null,
      workingHours: todayRecord?.workingHours || 0,
      status: todayRecord?.status || "absent",
    };

    res.json({ success: true, data: status });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch today's attendance" });
  }
};

// Get attendance summary for a period
export const getAttendanceSummary: RequestHandler = (req, res) => {
  const { employeeId } = req.params;
  const { month, year } = req.query;

  try {
    const targetMonth = month
      ? parseInt(month as string)
      : new Date().getMonth() + 1;
    const targetYear = year
      ? parseInt(year as string)
      : new Date().getFullYear();

    const monthRecords = attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        record.employeeId === employeeId &&
        recordDate.getMonth() + 1 === targetMonth &&
        recordDate.getFullYear() === targetYear
      );
    });

    // Calculate working days in the month (excluding weekends)
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    let totalWorkingDays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(targetYear, targetMonth - 1, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Not Sunday or Saturday
        totalWorkingDays++;
      }
    }

    const presentDays = monthRecords.filter(
      (record) => record.status === "present",
    ).length;
    const absentDays = monthRecords.filter(
      (record) => record.status === "absent",
    ).length;
    const halfDays = monthRecords.filter(
      (record) => record.status === "half-day",
    ).length;
    const leaveDays = monthRecords.filter(
      (record) => record.status === "leave",
    ).length;

    const totalHours = monthRecords.reduce(
      (sum, record) => sum + (record.workingHours || 0),
      0,
    );
    const overtimeHours = monthRecords.reduce(
      (sum, record) => sum + (record.overtimeHours || 0),
      0,
    );

    const attendancePercentage =
      totalWorkingDays > 0 ? (presentDays / totalWorkingDays) * 100 : 0;

    const summary: AttendanceSummary = {
      employeeId,
      month: new Date(targetYear, targetMonth - 1).toLocaleString("default", {
        month: "long",
      }),
      year: targetYear,
      totalWorkingDays,
      presentDays,
      absentDays,
      halfDays,
      leaveDays,
      holidays:
        totalWorkingDays - presentDays - absentDays - halfDays - leaveDays,
      totalHours: Math.round(totalHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      attendancePercentage: Math.round(attendancePercentage * 100) / 100,
    };

    res.json({ success: true, data: summary });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch attendance summary" });
  }
};

// Mark attendance manually (for admin/authority)
export const markAttendance: RequestHandler = (req, res) => {
  const { employeeId, date, status, checkIn, checkOut, remarks } = req.body;

  try {
    const employee = mockUsers.find((user) => user.employeeId === employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    // Check if record already exists
    const existingRecordIndex = attendanceRecords.findIndex(
      (record) => record.employeeId === employeeId && record.date === date,
    );

    let workingHours = 0;
    let overtimeHours = 0;

    if (checkIn && checkOut) {
      const checkInTime = new Date(`${date}T${checkIn}:00`);
      const checkOutTime = new Date(`${date}T${checkOut}:00`);
      workingHours =
        (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
      overtimeHours = Math.max(0, workingHours - 8);
    }

    const attendanceRecord: AttendanceRecord = {
      id: `ATT${employeeId}_${date.replace(/-/g, "_")}`,
      employeeId,
      date,
      checkIn,
      checkOut,
      workingHours: Math.round(workingHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      status,
      remarks,
    };

    if (existingRecordIndex !== -1) {
      attendanceRecords[existingRecordIndex] = attendanceRecord;
    } else {
      attendanceRecords.push(attendanceRecord);
    }

    res.json({
      success: true,
      data: attendanceRecord,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to mark attendance" });
  }
};

// Get department attendance overview (for authority)
export const getDepartmentAttendance: RequestHandler = (req, res) => {
  const { department } = req.params;
  const { date } = req.query;

  try {
    const targetDate =
      (date as string) || new Date().toISOString().split("T")[0];

    // Get employees in the department
    const departmentEmployees = mockUsers.filter(
      (user) => user.department === department && user.isActive,
    );

    const attendanceData = departmentEmployees.map((employee) => {
      const attendanceRecord = attendanceRecords.find(
        (record) =>
          record.employeeId === employee.employeeId &&
          record.date === targetDate,
      );

      return {
        employeeId: employee.employeeId,
        employeeName: employee.name,
        designation: employee.designation,
        attendance: attendanceRecord || {
          id: "",
          employeeId: employee.employeeId,
          date: targetDate,
          status: "absent",
        },
      };
    });

    const summary = {
      department,
      date: targetDate,
      totalEmployees: departmentEmployees.length,
      present: attendanceData.filter(
        (emp) => emp.attendance.status === "present",
      ).length,
      absent: attendanceData.filter((emp) => emp.attendance.status === "absent")
        .length,
      onLeave: attendanceData.filter((emp) => emp.attendance.status === "leave")
        .length,
      halfDay: attendanceData.filter(
        (emp) => emp.attendance.status === "half-day",
      ).length,
      attendancePercentage:
        departmentEmployees.length > 0
          ? (attendanceData.filter((emp) => emp.attendance.status === "present")
              .length /
              departmentEmployees.length) *
            100
          : 0,
    };

    res.json({
      success: true,
      data: {
        summary,
        employeeAttendance: attendanceData,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch department attendance" });
  }
};
