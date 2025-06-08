// // @ts-nocheck

import User from '../models/user.model.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activatedAccounts = await User.countDocuments({ accountStatus: 'active' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalPhysicians = await User.countDocuments({ role: 'physician' });
    const totalPatients = await User.countDocuments({ role: 'patient' });

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
    console.error('Error in getAdminStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard statistics',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};