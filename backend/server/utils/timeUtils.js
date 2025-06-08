/**
 * Validates if a time slot is in the correct format (HH:MM)
 * @param {string} timeSlot - The time slot to validate (e.g., "09:00")
 * @returns {boolean} - True if the time slot is valid
 */
export const validateTimeSlot = (timeSlot) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeSlot);
};

/**
 * Checks if a time slot is within business hours (9:00 AM - 5:00 PM)
 * @param {string} timeSlot - The time slot to check (e.g., "09:00")
 * @returns {boolean} - True if the time slot is within business hours
 */
export const isWithinBusinessHours = (timeSlot) => {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const timeInMinutes = hours * 60 + minutes;
  
  // Business hours: 9:00 AM (540 minutes) to 5:00 PM (1020 minutes)
  return timeInMinutes >= 540 && timeInMinutes <= 1020;
}; 