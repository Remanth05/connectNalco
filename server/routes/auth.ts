import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { LeaveBalanceModel } from "../models/HR";
import { Notification } from "../models/Notification";
import { ApiResponse } from "@shared/api";
import mongoose from "mongoose";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

// Helper to check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Mock user for development without MongoDB
const mockUser = {
  _id: "dev_user_001",
  employeeId: "ADMIN001",
  name: "Development User",
  email: "admin@nalco.com",
  role: "admin",
  department: "Information Technology",
  designation: "System Administrator",
  phone: "+91-6752-242001",
  status: "active",
  avatar: "DU",
  location: "Damanjodi Plant",
  team: "IT Support",
  joinDate: new Date("2024-01-01"),
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Register new user
export const registerUser: RequestHandler = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      email,
      password,
      phone,
      role = "employee",
      department,
      designation,
      joinDate,
      location,
      team,
    } = req.body;

    // Check if MongoDB is connected
    if (!isMongoConnected()) {
      const response: ApiResponse<null> = {
        success: false,
        error:
          "User registration requires MongoDB. Please set up MongoDB to enable user registration.",
      };
      return res.status(503).json(response);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { employeeId }],
    });

    if (existingUser) {
      const response: ApiResponse<null> = {
        success: false,
        error: "User with this email or employee ID already exists",
      };
      return res.status(400).json(response);
    }

    // Generate avatar from name
    const avatar = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();

    const finalDesignation =
      designation ||
      (role === "admin"
        ? "System Administrator"
        : role === "authority"
          ? "Department Authority"
          : "Associate Engineer");

    // Create user
    const user = new User({
      employeeId,
      name,
      email,
      password,
      phone,
      role,
      department: department || "Human Resources",
      designation: finalDesignation,
      joinDate: joinDate ? new Date(joinDate) : new Date(),
      location: location || "Damanjodi Plant",
      team,
      avatar,
    });

    await user.save();

    // Auto-create initial leave balance for new employee
    await LeaveBalanceModel.findOneAndUpdate(
      { employeeId: user.employeeId },
      {
        $setOnInsert: {
          employeeId: user.employeeId,
          annual: 21,
          sick: 12,
          casual: 7,
          totalAllocated: 40,
          totalUsed: 0,
          totalRemaining: 40,
        },
      },
      { upsert: true },
    ).catch(() => {});

    // Send welcome notification
    await Notification.create({
      notificationId: `NOTIF_${Date.now()}_${user.employeeId}`,
      employeeId: user.employeeId,
      title: "Welcome to ConnectNALCO",
      message: `Welcome ${user.name}! Your account has been created successfully with employee ID ${user.employeeId}.`,
      type: "info",
    }).catch(() => {});

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, employeeId: user.employeeId, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE as any },
    );

    const response: ApiResponse<{
      user: any;
      token: string;
    }> = {
      success: true,
      data: {
        user: {
          _id: user._id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          department: user.department,
          designation: user.designation,
          joinDate: user.joinDate,
          status: user.status,
          avatar: user.avatar,
          location: user.location,
          team: user.team,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("Register error:", error);
    let errorMessage = "Internal server error during registration";
    if (error?.name === "ValidationError") {
      errorMessage = Object.values(error.errors || {})
        .map((e: any) => e.message)
        .join(", ");
    } else if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      errorMessage = `A user with this ${field} already exists`;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    const response: ApiResponse<null> = {
      success: false,
      error: errorMessage,
    };
    res
      .status(
        error?.name === "ValidationError" || error?.code === 11000 ? 400 : 500,
      )
      .json(response);
  }
};

// Login user
export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { employeeId, password, role } = req.body;

    if (!employeeId || !password || !role) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Employee ID, password, and role are required",
      };
      return res.status(400).json(response);
    }

    // Check if MongoDB is connected
    if (!isMongoConnected()) {
      // Development mode fallback - check against demo credentials
      const isValidCredentials =
        (employeeId === "ADMIN001" &&
          password === "admin123" &&
          role === "admin") ||
        (employeeId === "AUTH001" &&
          password === "auth123" &&
          role === "authority") ||
        (employeeId === "EMP001" &&
          password === "emp123" &&
          role === "employee");

      if (isValidCredentials) {
        // Create appropriate mock user based on role
        const mockUserData = {
          ...mockUser,
          employeeId,
          role,
          name:
            role === "admin"
              ? "Admin User"
              : role === "authority"
                ? "Authority User"
                : "Employee User",
        };

        const token = jwt.sign(
          {
            userId: mockUserData._id,
            employeeId: mockUserData.employeeId,
            role: mockUserData.role,
          },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRE as any },
        );

        const response: ApiResponse<{
          user: typeof mockUserData;
          token: string;
        }> = {
          success: true,
          data: {
            user: mockUserData,
            token,
          },
        };

        return res.json(response);
      } else {
        const response: ApiResponse<null> = {
          success: false,
          error:
            "Invalid credentials. Use demo credentials: ADMIN001/admin123, AUTH001/auth123, or EMP001/emp123",
        };
        return res.status(401).json(response);
      }
    }

    // Find user by employeeId and role
    const user = await User.findOne({ employeeId, role }).select("+password");
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Invalid credentials",
      };
      return res.status(401).json(response);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Invalid credentials",
      };
      return res.status(401).json(response);
    }

    // Check if user is active
    if (user.status !== "active") {
      const response: ApiResponse<null> = {
        success: false,
        error: "Account is not active. Please contact administrator.",
      };
      return res.status(401).json(response);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, employeeId: user.employeeId, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE as any },
    );

    const response: ApiResponse<{
      user: any;
      token: string;
    }> = {
      success: true,
      data: {
        user: {
          _id: user._id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          department: user.department,
          designation: user.designation,
          joinDate: user.joinDate,
          status: user.status,
          avatar: user.avatar,
          location: user.location,
          team: user.team,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Internal server error during login",
    };
    res.status(500).json(response);
  }
};

// Get current user profile
export const getCurrentUser: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      const response: ApiResponse<null> = {
        success: false,
        error: "No token provided",
      };
      return res.status(401).json(response);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Check if MongoDB is connected
    if (!isMongoConnected()) {
      // Return mock user for development
      const response: ApiResponse<typeof mockUser> = {
        success: true,
        data: mockUser,
      };
      return res.json(response);
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
    };

    res.json(response);
  } catch (error) {
    console.error("Get current user error:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Invalid token",
    };
    res.status(401).json(response);
  }
};

// Get all users (admin only)
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    const response: ApiResponse<typeof users> = {
      success: true,
      data: users,
    };

    res.json(response);
  } catch (error) {
    console.error("Get all users error:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Internal server error",
    };
    res.status(500).json(response);
  }
};

// Update user
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove password from update data if present (use separate endpoint for password change)
    delete updateData.password;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
    };

    res.json(response);
  } catch (error) {
    console.error("Update user error:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Internal server error",
    };
    res.status(500).json(response);
  }
};

// Change user password
export const changePassword: RequestHandler = async (req, res) => {
  try {
    const { employeeId, currentPassword, newPassword } = req.body;

    if (!employeeId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Employee ID, current password, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters long",
      });
    }

    if (!isMongoConnected()) {
      return res.status(503).json({
        success: false,
        error: "Database is not connected",
      });
    }

    const user = await User.findOne({ employeeId }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully in database!",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error while changing password",
    });
  }
};
