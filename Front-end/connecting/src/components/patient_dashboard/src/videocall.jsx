import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function VideoCall() {
  const location = useLocation();
  const { appointment } = location.state || {}; // Get appointment info from previous page
  const [isVideoCalling, setIsVideoCalling] = useState(false);

  useEffect(() => {
    if (!appointment) {
      alert("You don't have an appointment to video call.");
    }
  }, [appointment]);

  const startVideoCall = () => {
    setIsVideoCalling(true);
  };

  const endVideoCall = () => {
    setIsVideoCalling(false);
  };

  return (
    <div className="text-center mt-10">
      {appointment ? (
        <div>
          <h1 className="text-4xl font-bold mb-6">Video Call with {appointment.doctorName}</h1>

          <div className="doctor-info mb-6">
            <img
              src={appointment.doctorImage}
              alt={appointment.doctorName}
              className="w-40 h-40 rounded-full mx-auto"
            />
            <p className="text-xl">{appointment.doctorName}</p>
            <p className="text-lg text-gray-600">{appointment.specialty}</p>
          </div>

          <div className="video-call-interface">
            {isVideoCalling ? (
              <div>
                <h2 className="text-2xl font-bold">You are in a video call!</h2>
                <div className="video-call-screen mt-4">
                  {/* Placeholder for actual video call interface */}
                  <div className="border p-4">
                    <p className="text-lg">Doctor's Video Feed</p>
                  </div>
                  <div className="my-4">
                    <button
                      className="bg-red-600 text-white px-6 py-2 rounded-full"
                      onClick={endVideoCall}
                    >
                      End Video Call
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-full"
                  onClick={startVideoCall}
                >
                  Start Video Call
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>You don't have an appointment to video call.</p>
      )}
    </div>
  );
}

export default VideoCall;