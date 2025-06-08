// @ts-nocheck
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// Format user response - only return the fields we want
const formatUserResponse = (user) => {
  const base = {
    id: user._id.toString(),
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    accountStatus: user.accountStatus,
    createdAt: user.createdAt
  };
  if (user.role === 'patient') {
    return {
      ...base,
      patientId: user.patientId,
      age: user.age,
      condition: user.condition,
      lastVisit: user.lastVisit,
      status: user.status,
      phone: user.phone,
      address: user.address
    };
  }
  return base;
};

/**
 * User login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      secretKey,
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      success: true,
      data: {
        token,
        user: formatUserResponse(user)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error logging in', 
      error: error.message 
    });
  }
};

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    console.log('Fetching all users...');
    
    // Verify admin access
    if (req.user.role !== 'admin') {
      console.log('Access denied: Non-admin user attempted to fetch all users');
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const users = await User.find({})
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    console.log(`Found ${users.length} users`);

    const formattedUsers = users.map(user => formatUserResponse(user));

    res.json({
      success: true,
      data: formattedUsers
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * Get a user by ID
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * Create a new user (Admin only)
 */
export const createUser = async (req, res) => {
  try {
    const { fullName, username, email, password, role, accountStatus, patientId, age, condition, lastVisit, status, phone, address } = req.body;

    // Validate required fields
    if (!fullName || !username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // If patient, validate patient-specific fields
    if (role === 'patient') {
      if (!patientId || !age || !condition || !phone || !address) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required patient fields (patientId, age, condition, phone, address)'
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userData = {
      fullName,
      username,
      email,
      role,
      accountStatus,
      password: hashedPassword
    };
    if (role === 'patient') {
      userData.patientId = patientId;
      userData.age = age;
      userData.condition = condition;
      userData.lastVisit = lastVisit;
      userData.status = status;
      userData.phone = phone;
      userData.address = address;
    }

    const user = new User(userData);
    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: formatUserResponse(savedUser)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

/**
 * Update a user by ID (Admin or Registration Officer)
 */
export const updateUser = async (req, res) => {
  try {
    const { fullName, username, email, role, accountStatus } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is taken by another user
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: userId } },
        { email }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken'
      });
    }

    // Update user fields
    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.accountStatus = accountStatus || user.accountStatus;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: formatUserResponse(updatedUser)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

/**
 * Delete a user by ID (Admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

/**
 * Toggle user status
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.accountStatus = status;
    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: formatUserResponse(updatedUser)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

/**
 * Reset password
 */
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  
  try {
    // Check for token in the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
    // Verify the token
    const decoded = jwt.verify(token, config.jwtSecret);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }
    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'New password is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Password reset successfully' 
    });
  }
  catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error resetting password', 
      error: error.message 
    });
  }
};

// Get user statistics for admin dashboard
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activatedAccounts = await User.countDocuments({ accountStatus: 'active' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalPhysicians = await User.countDocuments({ role: 'physician' });
    const totalPatients = await User.countDocuments({ role: 'patient' });

    // User type distribution for pie chart
    const userTypeDistribution = {
      admin: totalAdmins,
      physician: totalPhysicians,
      patient: totalPatients
    };

    res.json({
      success: true,
      totalUsers,
      activatedAccounts,
      totalAdmins,
      totalPhysicians,
      totalPatients,
      userTypeDistribution
    });
  } catch (error) {
    console.error('Error in getUserStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    console.log('Fetching all patients...');
    console.log('User making request:', { id: req.user._id, role: req.user.role });

    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });

    console.log(`Found ${patients.length} patients`);

    const formattedPatients = patients.map(formatUserResponse);
    console.log('Formatted patients:', formattedPatients);

    res.json({ 
      success: true, 
      data: formattedPatients 
    });
  } catch (error) {
    console.error('Error in getAllPatients:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching patients', 
      error: error.message 
    });
  }
};

