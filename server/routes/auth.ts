import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ApiResponse } from '@shared/api';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Helper to check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Mock user for development without MongoDB
const mockUser = {
  _id: 'dev_user_001',
  employeeId: 'ADMIN001',
  name: 'Development User',
  email: 'admin@nalco.com',
  role: 'admin',
  department: 'Information Technology',
  designation: 'System Administrator',
  phone: '+91-6752-242001',
  status: 'active',
  avatar: 'DU',
  location: 'Damanjodi Plant',
  team: 'IT Support',
  joinDate: new Date('2024-01-01'),
  createdAt: new Date(),
  updatedAt: new Date()
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
      role = 'employee',
      department,
      designation,
      joinDate,
      location,
      team
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { employeeId }]
    });

    if (existingUser) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User with this email or employee ID already exists'
      };
      return res.status(400).json(response);
    }

    // Generate avatar from name
    const avatar = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();

    // Create user
    const user = new User({
      employeeId,
      name,
      email,
      password,
      phone,
      role,
      department,
      designation,
      joinDate: joinDate ? new Date(joinDate) : new Date(),
      location: location || 'Damanjodi Plant',
      team,
      avatar
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, employeeId: user.employeeId, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    const response: ApiResponse<{
      user: Omit<typeof user, 'password'>;
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
          updatedAt: user.updatedAt
        },
        token
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Register error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error during registration'
    };
    res.status(500).json(response);
  }
};

// Login user
export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Email and password are required'
      };
      return res.status(400).json(response);
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid credentials'
      };
      return res.status(401).json(response);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid credentials'
      };
      return res.status(401).json(response);
    }

    // Check if user is active
    if (user.status !== 'active') {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Account is not active. Please contact administrator.'
      };
      return res.status(401).json(response);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, employeeId: user.employeeId, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    const response: ApiResponse<{
      user: Omit<typeof user, 'password'>;
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
          updatedAt: user.updatedAt
        },
        token
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error during login'
    };
    res.status(500).json(response);
  }
};

// Get current user profile
export const getCurrentUser: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'No token provided'
      };
      return res.status(401).json(response);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user
    };

    res.json(response);
  } catch (error) {
    console.error('Get current user error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid token'
    };
    res.status(401).json(response);
  }
};

// Get all users (admin only)
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    const response: ApiResponse<typeof users> = {
      success: true,
      data: users
    };

    res.json(response);
  } catch (error) {
    console.error('Get all users error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error'
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
      runValidators: true 
    }).select('-password');

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user
    };

    res.json(response);
  } catch (error) {
    console.error('Update user error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
};
