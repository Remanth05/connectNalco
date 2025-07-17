import { RequestHandler } from "express";
import { Facility, FacilityBooking, FacilityBookingRequest } from "@shared/api";
import {
  mockFacilities,
  mockFacilityBookings,
  mockUsers,
} from "../data/mockData";

// In-memory storage
let facilities = [...mockFacilities];
let facilityBookings = [...mockFacilityBookings];

// Get all facilities
export const getFacilities: RequestHandler = (req, res) => {
  const { type, isActive } = req.query;

  try {
    let filteredFacilities = [...facilities];

    if (type) {
      filteredFacilities = filteredFacilities.filter(
        (facility) => facility.type === type,
      );
    }

    if (isActive !== undefined) {
      filteredFacilities = filteredFacilities.filter(
        (facility) => facility.isActive === (isActive === "true"),
      );
    }

    res.json({ success: true, data: filteredFacilities });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch facilities" });
  }
};

// Get facility by ID
export const getFacility: RequestHandler = (req, res) => {
  const { facilityId } = req.params;

  try {
    const facility = facilities.find((f) => f.id === facilityId);

    if (!facility) {
      return res
        .status(404)
        .json({ success: false, error: "Facility not found" });
    }

    res.json({ success: true, data: facility });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch facility" });
  }
};

// Check facility availability
export const checkFacilityAvailability: RequestHandler = (req, res) => {
  const { facilityId } = req.params;
  const { date, startTime, endTime } = req.query;

  try {
    const facility = facilities.find((f) => f.id === facilityId);

    if (!facility) {
      return res
        .status(404)
        .json({ success: false, error: "Facility not found" });
    }

    // Check for conflicting bookings
    const conflictingBookings = facilityBookings.filter(
      (booking) =>
        booking.facilityId === facilityId &&
        booking.date === date &&
        booking.status === "approved" &&
        ((startTime >= booking.startTime && startTime < booking.endTime) ||
          (endTime > booking.startTime && endTime <= booking.endTime) ||
          (startTime <= booking.startTime && endTime >= booking.endTime)),
    );

    const isAvailable = conflictingBookings.length === 0;

    res.json({
      success: true,
      data: {
        facilityId,
        date,
        startTime,
        endTime,
        isAvailable,
        conflictingBookings: isAvailable ? [] : conflictingBookings,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to check availability" });
  }
};

// Book facility
export const bookFacility: RequestHandler = (req, res) => {
  const { employeeId } = req.params;
  const bookingData: FacilityBookingRequest = req.body;

  try {
    const employee = mockUsers.find((user) => user.employeeId === employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    const facility = facilities.find((f) => f.id === bookingData.facilityId);
    if (!facility) {
      return res
        .status(404)
        .json({ success: false, error: "Facility not found" });
    }

    // Check for conflicting bookings
    const conflictingBookings = facilityBookings.filter(
      (booking) =>
        booking.facilityId === bookingData.facilityId &&
        booking.date === bookingData.date &&
        booking.status === "approved" &&
        ((bookingData.startTime >= booking.startTime &&
          bookingData.startTime < booking.endTime) ||
          (bookingData.endTime > booking.startTime &&
            bookingData.endTime <= booking.endTime) ||
          (bookingData.startTime <= booking.startTime &&
            bookingData.endTime >= booking.endTime)),
    );

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Facility is already booked for the requested time slot",
        data: { conflictingBookings },
      });
    }

    const newBooking: FacilityBooking = {
      id: `BOOK${String(facilityBookings.length + 1).padStart(3, "0")}`,
      facilityId: bookingData.facilityId,
      facilityName: facility.name,
      employeeId,
      employeeName: employee.name,
      date: bookingData.date,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      purpose: bookingData.purpose,
      attendees: bookingData.attendees,
      status: "pending",
      bookingDate: new Date().toISOString().split("T")[0],
    };

    facilityBookings.push(newBooking);

    res.status(201).json({
      success: true,
      data: newBooking,
      message: "Facility booking request submitted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to book facility" });
  }
};

// Get bookings for an employee
export const getEmployeeBookings: RequestHandler = (req, res) => {
  const { employeeId } = req.params;
  const { status, upcoming } = req.query;

  try {
    let employeeBookings = facilityBookings.filter(
      (booking) => booking.employeeId === employeeId,
    );

    if (status) {
      employeeBookings = employeeBookings.filter(
        (booking) => booking.status === status,
      );
    }

    if (upcoming === "true") {
      const today = new Date().toISOString().split("T")[0];
      employeeBookings = employeeBookings.filter(
        (booking) => booking.date >= today,
      );
    }

    // Sort by date and time
    employeeBookings.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });

    res.json({ success: true, data: employeeBookings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch employee bookings" });
  }
};

// Get all bookings (for facility management)
export const getAllBookings: RequestHandler = (req, res) => {
  const { facilityId, date, status } = req.query;

  try {
    let filteredBookings = [...facilityBookings];

    if (facilityId) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.facilityId === facilityId,
      );
    }

    if (date) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.date === date,
      );
    }

    if (status) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.status === status,
      );
    }

    // Sort by date and time
    filteredBookings.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });

    res.json({ success: true, data: filteredBookings });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch bookings" });
  }
};

// Process booking (approve/reject)
export const processBooking: RequestHandler = (req, res) => {
  const { bookingId } = req.params;
  const { action, reason, userId } = req.body;

  try {
    const bookingIndex = facilityBookings.findIndex(
      (booking) => booking.id === bookingId,
    );

    if (bookingIndex === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    const booking = facilityBookings[bookingIndex];

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Booking has already been processed",
      });
    }

    const processingUser = mockUsers.find((user) => user.employeeId === userId);
    if (!processingUser) {
      return res
        .status(404)
        .json({ success: false, error: "Processing user not found" });
    }

    const updatedBooking = {
      ...booking,
      status:
        action === "approve" ? ("approved" as const) : ("rejected" as const),
      approvedBy: processingUser.name,
    };

    if (action === "reject" && reason) {
      updatedBooking.rejectedReason = reason;
    }

    facilityBookings[bookingIndex] = updatedBooking;

    res.json({
      success: true,
      data: updatedBooking,
      message: `Booking ${action}d successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to process booking" });
  }
};

// Cancel booking
export const cancelBooking: RequestHandler = (req, res) => {
  const { bookingId } = req.params;
  const { employeeId } = req.body;

  try {
    const bookingIndex = facilityBookings.findIndex(
      (booking) => booking.id === bookingId,
    );

    if (bookingIndex === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    const booking = facilityBookings[bookingIndex];

    // Only allow the person who made the booking to cancel it
    if (booking.employeeId !== employeeId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to cancel this booking",
      });
    }

    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, error: "Booking is already cancelled" });
    }

    const updatedBooking = {
      ...booking,
      status: "cancelled" as const,
    };

    facilityBookings[bookingIndex] = updatedBooking;

    res.json({
      success: true,
      data: updatedBooking,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to cancel booking" });
  }
};

// Get facility schedule for a specific date
export const getFacilitySchedule: RequestHandler = (req, res) => {
  const { facilityId } = req.params;
  const { date } = req.query;

  try {
    const facility = facilities.find((f) => f.id === facilityId);
    if (!facility) {
      return res
        .status(404)
        .json({ success: false, error: "Facility not found" });
    }

    const dayBookings = facilityBookings.filter(
      (booking) =>
        booking.facilityId === facilityId &&
        booking.date === date &&
        booking.status === "approved",
    );

    // Sort by start time
    dayBookings.sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.json({
      success: true,
      data: {
        facility,
        date,
        bookings: dayBookings,
        totalBookings: dayBookings.length,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch facility schedule" });
  }
};
