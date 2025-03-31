import React from 'react';

function Emergency() {
  const callAmbulance = () => {
    window.location.href = "tel:+961140"; // Lebanese Red Cross emergency number
  };

  const initiateVideoCall = () => {
    // Add logic here for video call (e.g., using a service like Zoom, WebRTC, etc.)
    alert('Initiating video call...');
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold mb-6">Emergency</h1>

      {/* Emergency Button */}
      <button
        className="btn bg-red-600 text-xl font-bold py-4 px-8 rounded-full mb-4"
        onClick={callAmbulance}
      >
        Call Ambulance
      </button>

      {/* Video Call Button */}
      <button
        className="btn bg-blue-600 text-xl font-bold py-4 px-8 rounded-full"
        onClick={initiateVideoCall}
      >
        Video Call
      </button>
    </div>
  );
}

export default Emergency;