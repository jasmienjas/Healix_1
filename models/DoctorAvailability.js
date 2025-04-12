const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlots: [
    {
      start: { type: String, required: true }, // e.g., "09:00"
      end: { type: String, required: true }    // e.g., "12:00"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('DoctorAvailability', availabilitySchema);
