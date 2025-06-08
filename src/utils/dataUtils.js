import data from '../data/data.json';

export const getPatientById = (id) => {
  try {
    const data = require('../data/data.json');
    return data.patients.find(patient => patient.id === id) || null;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return null;
  }
};

export const getPhysicianById = (id) => {
  return data.physicians.find(physician => physician.id === id);
};

export const getAllPatients = () => {
  try {
    const data = require('../data/data.json');
    return data.patients || [];
  } catch (error) {
    console.error('Error fetching all patients:', error);
    return [];
  }
};

export const getAllPhysicians = () => {
  return data.physicians;
};

export const getAppointmentsByPatientId = (patientId) => {
  return data.appointments.filter(apt => apt.patientId === patientId);
};

export const getAppointmentsByPhysicianId = (physicianId) => {
  try {
    const data = require('../data/data.json');
    return data.appointments.filter(apt => apt.physicianId === physicianId) || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}; 