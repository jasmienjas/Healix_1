import React, { useState } from 'react';

function NearbyPharmacies() {
  const [locationPermission, setLocationPermission] = useState(false);

  const handleLocationPermission = () => {
    setLocationPermission(true);
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold">Nearby Pharmacies</h1>
      <button className="btn mt-6" onClick={handleLocationPermission}>Allow Location Access</button>

      {locationPermission && (
        <div className="mt-6 space-y-4">
          <div className="pharmacy-card">
            <img src="https://postimg.cc/xkFyT8Y4" alt="Hilal Pharmacy" className="w-40 h-40 rounded-full mx-auto" />
            <p>Hilal Pharmacy</p>
          </div>
          <div className="pharmacy-card">
            <img src="https://postimg.cc/Mvb7fdqR" alt="Alam Pharmacy" className="w-40 h-40 rounded-full mx-auto" />
            <p>Alam Pharmacy</p>
          </div>
          <div className="pharmacy-card">
            <img src="https://postimg.cc/NKCrRnVy" alt="Balsam Pharmacy" className="w-40 h-40 rounded-full mx-auto" />
            <p>Balsam Pharmacy</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NearbyPharmacies;
