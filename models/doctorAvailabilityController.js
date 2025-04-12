const DoctorAvailability = require('../models/DoctorAvailability');

// Get availability with optional filters
exports.getAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date, startTime, endTime } = req.query;

    let filter = { doctorId };

    // Filter by date if provided
    if (date) {
      const parsedDate = new Date(date);
      parsedDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(parsedDate);
      nextDate.setDate(nextDate.getDate() + 1);
      filter.date = { $gte: parsedDate, $lt: nextDate };
    }

    const availabilities = await DoctorAvailability.find(filter);

    // If time range is provided, filter time slots manually
    let filtered = availabilities;

    if (startTime && endTime) {
      filtered = availabilities.map(entry => {
        const matchingSlots = entry.timeSlots.filter(slot => {
          return slot.start >= startTime && slot.end <= endTime;
        });
        return {
          ...entry.toObject(),
          timeSlots: matchingSlots
        };
      }).filter(entry => entry.timeSlots.length > 0);
    }

    if (filtered.length === 0) {
      return res.status(404).json({ message: 'No matching availability found.' });
    }

    res.status(200).json(filtered);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

