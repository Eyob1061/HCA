import User from '../models/user.model.js';
import Appointment from '../models/appointment.model.js';
import PatientReport from '../models/patientreport.model.js';
import Advice from '../models/advice.model.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getPhysicianDashboardStats = async (req, res) => {
  try {
    // Total patients
    const totalPatients = await User.countDocuments({ role: 'patient' });

    // Today's appointments
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const todaysAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });

    // Pending reports (all reports for now)
    const pendingReports = await PatientReport.countDocuments({});

    // Pending recommendations
    const pendingRecommendations = await Advice.countDocuments({ status: 'pending' });

    // Recent activity (last 3 advices)
    const recentActivity = await Advice.find({})
      .sort({ updatedAt: -1 })
      .limit(3)
      .populate('patientId', 'patientId fullName');

    res.json({
      success: true,
      data: {
        totalPatients,
        todaysAppointments,
        pendingReports,
        pendingRecommendations,
        recentActivity
      }
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard stats', error: errMsg });
  }
}; 