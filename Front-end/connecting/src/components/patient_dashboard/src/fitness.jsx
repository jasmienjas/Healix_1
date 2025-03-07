import React, { useState } from 'react';

function Fitness() {
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [calories, setCalories] = useState(null);

  // Calculate BMR (Basal Metabolic Rate) and daily calories
  const calculateCalories = () => {
    if (weight && age && height) {
      const bmr = 10 * parseInt(weight) + 6.25 * parseInt(height) - 5 * parseInt(age) + 5;
      const dailyCalories = bmr * 1.2; // Assuming sedentary activity level
      setCalories(dailyCalories.toFixed(0));
    } else {
      alert("Please enter all fields");
    }
  };

  return (
    <div className="fitness-container">
      <h1 className="text-4xl font-bold text-center mb-8">If It Doesn't Challenge You, It Doesn't Change You. <br/> Never Miss a Monday</h1>

      <h2 className="text-3xl font-semibold text-center mb-6">Fitness</h2>
      
      <div className="fitness-images mt-8 space-y-4">
        <img src="https://postimg.cc/SJwBjQQj" alt="Fitness 1" className="w-64 h-64 mx-auto rounded-lg" />
        <img src="https://postimg.cc/RNrdHWfr" alt="Fitness 2" className="w-64 h-64 mx-auto rounded-lg" />
      </div>

      {/* Calories Calculator */}
      <div className="calculator mt-10">
        <h3 className="text-xl font-bold mb-4">Calculate Your Daily Calories</h3>
        <div className="form-group">
          <input
            type="number"
            placeholder="Enter Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Enter Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Enter Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="input-field"
          />
          <button onClick={calculateCalories} className="btn mt-4">Calculate Calories</button>
        </div>
        {calories && <p className="mt-4 text-xl">Your daily calorie requirement is: {calories} kcal</p>}
      </div>

      {/* Personal Trainers Section */}
      <div className="personal-trainers mt-10">
        <h3 className="text-xl font-bold mb-4">Book a Personal Trainer</h3>
        <div className="trainers-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="trainer-card">
            <img src="https://postimg.cc/5QNmxRRf" alt="Ali, Personal Trainer" className="trainer-img" />
            <p>Ali - 5 Years of Experience</p>
            <button className="btn">Book Trainer</button>
          </div>
          <div className="trainer-card">
            <img src="https://postimg.cc/xcZP2gyS" alt="Daniel Haddad, PT" className="trainer-img" />
            <p>Daniel Haddad - PT</p>
            <button className="btn">Book Trainer</button>
          </div>
          <div className="trainer-card">
            <img src="https://postimg.cc/hhjxtTG4" alt="Hassan, PT" className="trainer-img" />
            <p>Hassan - PT</p>
            <button className="btn">Book Trainer</button>
          </div>
          <div className="trainer-card">
            <img src="https://postimg.cc/5jRzYyHB" alt="Lama, PT" className="trainer-img" />
            <p>Lama - PT</p>
            <button className="btn">Book Trainer</button>
          </div>
        </div>
      </div>

      {/* Meal Plan Booking Section */}
      <div className="meal-plan mt-10">
        <h3 className="text-xl font-bold mb-4">Book a Personalized Meal Plan</h3>
        <button className="btn">Book Meal Plan</button>
      </div>
    </div>
  );
}

export default Fitness;