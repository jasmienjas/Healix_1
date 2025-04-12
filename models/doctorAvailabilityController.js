const DoctorAvailability = require('../models/DoctorAvailability');

// Get availability for a specific doctor
exports.getAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const availabilities = await DoctorAvailability.find({ doctorId });

    if (!availabilities || availabilities.length === 0) {
      return res.status(404).json({ message: 'No availability found.' });
    }

    res.status(200).json(availabilities);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
