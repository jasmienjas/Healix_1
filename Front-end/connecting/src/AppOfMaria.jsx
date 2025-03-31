import React, { useState } from "react";
import styles from './AppOfMaria.module.css'; // Import CSS module
import AlphabetChallenge from "./alphabet.jsx";  // Fixed the typo in the import
import DidYouKnow from "./didyouknow.jsx";  // Fixed the typo in the import
import Appointments from "./appoitments.jsx";  // Fixed the typo in the import
import DynamicCounter from "./dynamiccounter.jsx";  // Fixed the typo in the import
import EmergencyButton from "./emergency.jsx"; // Adjust the path based on where your emergency.jsx is located
import { useNavigate } from "react-router-dom";


const AppOfMaria = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""); // Alphabet array
  const navigate = useNavigate();

  // Array of diseases
  const diseases = [
    "Alkaptonuria", "Amyloidosis", "Buerger's Disease", "Brugada Syndrome", "Creutzfeldt-Jakob Disease",
    "Cushing's Syndrome", "Dermatomyositis", "Dercum's Disease", "Ehlers-Danlos Syndrome", "Erythromelalgia",
    "Fabry Disease", "Fahr's Syndrome", "Gorham-Stout Disease", "Goodpasture Syndrome", "Hirayama Disease",
    "Hypophosphatasia", "Idiopathic Pulmonary Fibrosis", "Ichthyosis Vulgaris", "Job's Syndrome",
    "Kearns-Sayre Syndrome", "Kleine-Levin Syndrome", "Lesch-Nyhan Syndrome", "Lipoid Proteinosis",
    "Moyamoya Disease", "Multiple System Atrophy", "Neurofibromatosis", "Noonan Syndrome", "Ollier Disease",
    "Pfeiffer Syndrome", "POEMS Syndrome", "Q Fever", "Ramsay Hunt Syndrome", "Retroperitoneal Fibrosis",
    "Stiff-Person Syndrome", "Su sac's Syndrome", "Takayasu Arteritis", "Tarlov Cysts", "Ullrich Congenital Muscular Dystrophy",
    "Urticaria Pigmentosa", "Von Hippel-Lindau Syndrome", "Wegener's Granulomatosis", "Wilson's Disease",
    "X-linked Hypophosphatemia", "Xeroderma Pigmentosum", "Yellow Nail Syndrome", "Zellweger Syndrome", "Zygomycosis"
  ];

  // Array of "Did You Know" facts
  const facts = [
    { id: 1, fact: "The human heart beats over 100,000 times per day." },
    { id: 2, fact: "Your body has more bacteria cells than human cells." },
    { id: 3, fact: "An octopus has three hearts in total." },
    { id: 4, fact: "Honey never spoils and can last for centuries." },
    { id: 5, fact: "Humans are the only animals that get sunburned." },
    { id: 6, fact: "A giraffe's tongue can be 18 inches long." },
    { id: 7, fact: "A sneeze travels at over 100 miles per hour." },
    { id: 8, fact: "The human nose can detect over 1 trillion smells" },
    { id: 9, fact: "A group of flamingos is called a flamboyance." },
    { id: 10, fact: "A day on Venus is longer than its year." },
    { id: 11, fact: "You can’t sneeze with your eyes open." },
    { id: 12, fact: "The shortest commercial flight lasts 57 seconds." },
    { id: 13, fact: "You can’t hum while holding your nose closed." },
    { id: 14, fact: "The longest hiccuping spree lasted over 68 years." },
    { id: 15, fact: "Clouds can weigh more than a million pounds." },
  ];

  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [filteredDiseases, setFilteredDiseases] = useState(diseases);
  const [inView, setInView] = useState(false);


  const showNextFact = () => {
    setCurrentFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
  };

  const showPreviousFact = () => {
    setCurrentFactIndex((prevIndex) =>
      prevIndex === 0 ? facts.length - 1 : prevIndex - 1
    );
  };

  const handleDiseaseClick = (disease) => {
    setSelectedDisease(disease);
    setTimeout(() => {
      setSelectedDisease(null);
    }, 3000);
  };

  const handleLetterClick = (letter) => {
    const filtered = diseases.filter((disease) => disease[0].toUpperCase() === letter);
    setFilteredDiseases(filtered);
    const randomDisease = filtered[Math.floor(Math.random() * filtered.length)];
    setSelectedDisease(randomDisease);
    setTimeout(() => {
      setSelectedDisease(null);
    }, 3000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const emailError = document.getElementById("emailError");
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const existingAppointments = [{ date: "2025-07-02", time: "10:00" }];

    const booked = existingAppointments.some(app => app.date === date && app.time === time);

    if (!email.includes("@")) {
      emailError.style.display = "block";
      return;
    } else {
      emailError.style.display = "none";
    }

    if (booked) {
      alert("Sorry, this time slot is already taken. Please choose another time.");
      return;
    }

    document.getElementById("successModal").style.display = "flex";
  };

  const closeModal = () => {
    document.getElementById("successModal").style.display = "none";
  };

  return (
    <div className={styles.app}>
      {/* Header Container */}
      <div className={styles['header-container']}>
        <header>
          <div className={styles['header-content']}>
            <img
              src="https://i.postimg.cc/N0bcLbBp/5aec84df-b722-4e37-9570-758698da942d-removebg-preview.png"
              alt="Header Image"
              className={styles['header-image']}
            />
            <nav className={styles.navbar}>
              <button className={styles['nav-button']}>Home</button>
              <button className={styles['nav-button']} onClick={() => document.getElementById("contact-footer")?.scrollIntoView({ behavior: "smooth" })}>
                Service
              </button>
              <button className={styles['nav-button']} onClick={() => navigate("/login")}>Login</button>
              <button className={styles['nav-button']} onClick={() => navigate("/home")}>Signup</button>
              <button className={styles['nav-button']} onClick={() => document.getElementById("contact-footer")?.scrollIntoView({ behavior: "smooth" })}>
                Contact
              </button>
              <button className={styles['nav-button']} onClick={() => document.getElementById("appointments-section").scrollIntoView({ behavior: "smooth" })}>
                Book an Appointment
              </button>
            </nav>
          </div>
        </header>
      </div>

      {/* Did You Know Container */}
      <div>
        <DidYouKnow facts={facts} />
      </div>

      {/* Alphabet Container */}
      <div>
        <AlphabetChallenge alphabet={alphabet} handleLetterClick={handleLetterClick} />
      </div>

      <div className={styles.testimonials}>
        <div className={styles['testimonial-box']}>
          <p>"The neural rejuvenation therapy changed my life! I feel 20 years younger!"</p>
          <span>- Dr. John Doe, Age Reversed</span>
        </div>
        <div className={styles['testimonial-box']}>
          <p>"Cybernetic implants gave me superhuman reflexes. Highly recommend!"</p>
          <span>- Sarah Connor, Cybernetics Enthusiast</span>
        </div>
        <div className={styles['testimonial-box']}>
          <p>"Thanks to AI-guided meditation, I have achieved enlightenment in just 2 weeks!"</p>
          <span>- ZenMaster 3000, AI Guru</span>
        </div>
      </div>

      <div className={styles['appointments-container']}>
        <DynamicCounter inView={inView} id="counter" />
      </div>

      {/* Book an Appointment Section */}
      <div id="appointments-section" className={styles['appointments-container']}>
        <Appointments />
      </div>

      {/* Success Modal */}
      <div id="successModal" className={styles.modal}>
        <div className={styles['modal-content']}>
          <span className={styles.close} onClick={closeModal}>&times;</span>
          <h2>Appointment Booked!</h2>
          <p>Your appointment has been successfully booked.</p>
        </div>
      </div>

      {/* Notification Box */}
      {selectedDisease && (
        <div className={styles['notification-box']}>
          <p>{selectedDisease}</p>
        </div>
      )}

      {/* Emergency Button */}
      <div className={styles.App}>
        <EmergencyButton />
      </div>

      {/* Footer Container */}
      <div className={styles['footer-container']}>
        <footer id="contact-footer">
          <div className={styles['footer-section']}>
            <h3>Contact Us</h3>
            <p>Lebanon, Beirut</p>
            <p>+961(81890345)</p>
            <p>healix@it.com</p>
          </div>
          <div className={styles['footer-section']}>
            <h3>Services</h3>
            <ul>
              <li>Cardiology</li>
              <li>Pulmonary</li>
              <li>Neurology</li>
              <li>Orthopedics</li>
              <li>Hepatology</li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AppOfMaria;
