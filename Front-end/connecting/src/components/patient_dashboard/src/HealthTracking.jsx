import React, { useState } from 'react';

function HealthTracking() {
  const [heartRate, setHeartRate] = useState('');
  const [feeling, setFeeling] = useState('');
  const [message, setMessage] = useState('');
  const [reminder, setReminder] = useState('');
  const [remindersList, setRemindersList] = useState([]);

  // Handle sending health update to the doctor
  const handleSendUpdate = () => {
    alert('Your health update has been sent to your doctor!');
    setHeartRate('');
    setFeeling('');
    setMessage('');
  };

  // Handle adding reminder for the doctor
  const handleAddReminder = () => {
    if (reminder.trim() !== '') {
      setRemindersList([...remindersList, reminder]);
      setReminder('');
    } else {
      alert('Please enter a reminder.');
    }
  };

  return (
    <div className="health-tracking-container text-center mt-10">
      <h1 className="text-4xl font-bold mb-4">Health Tracking</h1>
      <img
        src="https://postimg.cc/zyX6vx42"
        alt="Health Tracking Banner"
        className="w-full h-64 object-cover rounded-lg mb-6"
      />

      {/* Health Update Form */}
      <div className="health-update-form mb-8">
        <h2 className="text-xl font-semibold mb-4">Update Your Health</h2>
        <div className="form-group">
          <input
            type="number"
            placeholder="Enter your heart rate"
            className="p-2 w-1/2 border rounded mb-4"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="How are you feeling today?"
            className="p-2 w-1/2 border rounded mb-4"
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Write a short message"
            className="p-2 w-1/2 border rounded mb-4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button
          className="btn bg-blue-600 text-white py-2 px-6 rounded mt-4"
          onClick={handleSendUpdate}
        >
          Send Health Update
        </button>
      </div>

      {/* Reminders Section */}
      <div className="reminder-section mt-8">
        <h2 className="text-xl font-semibold mb-4">Add a Reminder for Your Doctor</h2>
        <div className="form-group mb-4">
          <textarea
            placeholder="Write a note or reminder for your doctor..."
            className="p-2 w-1/2 border rounded"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />
        </div>
        <button
          className="btn bg-green-600 text-white py-2 px-6 rounded mt-4"
          onClick={handleAddReminder}
        >
          Add Reminder
        </button>

        {/* Display the added reminders */}
        {remindersList.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Your Reminders</h3>
            <ul className="list-disc list-inside">
              {remindersList.map((reminder, index) => (
                <li key={index} className="text-gray-700 mb-2">{reminder}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default HealthTracking;