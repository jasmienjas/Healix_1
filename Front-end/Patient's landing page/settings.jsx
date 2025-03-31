import React, { useState } from 'react';

function Settings() {
  const [userInfo, setUserInfo] = useState({
    username: 'john_doe', // Replace with actual user data
    email: 'johndoe@example.com', // Replace with actual user data
  });

  const handleLogout = () => {
    // Logic for logging out the user, e.g., clearing local storage or cookies
    alert('Logging out...');
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold mb-6">Settings</h1>
      
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Your Login Information</h2>
        <div className="mt-4">
          <p className="font-medium">Username: {userInfo.username}</p>
          <p className="font-medium">Email: {userInfo.email}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <button
          className="btn bg-red-600 text-xl font-bold py-4 px-8 rounded-full"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Settings;
