"use client"

import { useState, useEffect } from "react"
import AlphabetChallenge from "@/components/home/alphabet"
import DidYouKnow from "@/components/home/didyouknow"
import DynamicCounter from "@/components/home/dynamiccounter"
import EmergencyButton from "@/components/home/emergency"
import HomeHeader from "@/components/home/header"
import Footer from "@/components/home/footer"
import "./home.css"

// Sample data for the alphabet challenge
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
]

// Sample diseases data
const diseasesList = [
  "Alzheimer's",
  "Arthritis",
  "Asthma",
  "Bronchitis",
  "Cancer",
  "Cataracts",
  "Chickenpox",
  "Cholera",
  "COVID-19",
  "Dementia",
  "Diabetes",
  "Eczema",
  "Epilepsy",
  "Fibromyalgia",
  "Flu",
  "Glaucoma",
  "Gout",
  "Hay Fever",
  "Hepatitis",
  "Herpes",
  "HIV/AIDS",
  "Hypertension",
  "Influenza",
  "Jaundice",
  "Kidney Disease",
  "Leukemia",
  "Lyme Disease",
  "Malaria",
  "Measles",
  "Melanoma",
  "Meningitis",
  "Migraine",
  "Multiple Sclerosis",
  "Mumps",
  "Obesity",
  "Osteoporosis",
  "Parkinson's",
  "Pneumonia",
  "Polio",
  "Psoriasis",
  "Rabies",
  "Rheumatoid Arthritis",
  "Ringworm",
  "Rubella",
  "Salmonellosis",
  "SARS",
  "Schizophrenia",
  "Scoliosis",
  "Sepsis",
  "Shingles",
  "Sinusitis",
  "Stroke",
  "Tetanus",
  "Tuberculosis",
  "Typhoid Fever",
  "Ulcerative Colitis",
  "Urticaria",
  "Varicella",
  "Vasculitis",
  "Vitiligo",
  "Whooping Cough",
  "Yellow Fever",
  "Zika Virus",
]

// Sample facts for the Did You Know component
const medicalFacts = [
  { id: 1, fact: "The human heart beats over 100,000 times per day." },
  { id: 2, fact: "The average human body has over 600 muscles." },
  { id: 3, fact: "Your body has about 5.6 liters (6 quarts) of blood." },
  { id: 4, fact: "The human brain can process information as fast as 268 mph." },
  { id: 5, fact: "Your nose can remember 50,000 different scents." },
]

export default function HomePage() {
  const [filteredDiseases, setFilteredDiseases] = useState<string[]>([])
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null)
  const [isInView, setIsInView] = useState(false)

  // Function to handle letter click in the alphabet challenge
  const handleLetterClick = (letter: string) => {
    const filtered = diseasesList.filter((disease) => disease.charAt(0).toUpperCase() === letter)
    setFilteredDiseases(filtered)

    if (filtered.length > 0) {
      const randomDisease = filtered[Math.floor(Math.random() * filtered.length)]
      setSelectedDisease(randomDisease)
      setTimeout(() => {
        setSelectedDisease(null)
      }, 3000)
    } else {
      setSelectedDisease(null)
    }
  }

  // Set counter to be in view after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInView(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />

      <div className="bg-[#f0f8ff] py-4 flex-grow">
        <div className="max-w-[900px] mx-auto px-4">
          {/* Did You Know Section - Exactly as shown in the image */}
          <div className="mb-8">
            <DidYouKnow facts={medicalFacts} />
          </div>

          {/* Alphabet Challenge Section */}
          <div className="mb-8">
            <AlphabetChallenge alphabet={alphabet} handleLetterClick={handleLetterClick} />

            {selectedDisease && <div className="notification-box">Selected disease: {selectedDisease}</div>}

            {/* Removed the disease list display */}
          </div>

          {/* Rest of the content */}
          <div className="main-content">
            {/* Dynamic Counter Section */}
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4 text-center">Our Impact</h2>
              <DynamicCounter inView={isInView} />
            </section>

            {/* Testimonials Section */}
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4 text-center">What Our Patients Say</h2>
              <div className="testimonials">
                <div className="testimonial-box">
                  <p>
                    "The doctors at Healix are amazing. They really took the time to understand my condition and provide
                    the best care possible."
                  </p>
                  <span>- Sarah Johnson</span>
                </div>
                <div className="testimonial-box">
                  <p>
                    "I've never had such a smooth experience scheduling appointments and getting the care I need. Highly
                    recommended!"
                  </p>
                  <span>- Michael Chen</span>
                </div>
                <div className="testimonial-box">
                  <p>
                    "The online consultation feature saved me so much time. I got the medical advice I needed without
                    leaving my home."
                  </p>
                  <span>- Aisha Rahman</span>
                </div>
              </div>
            </section>

           

            {/* Emergency Button */}
            <EmergencyButton />

            {/* Success Modal (hidden by default) */}
            <div id="successModal" className="modal" style={{ display: "none" }}>
              <div className="modal-content">
                <div className="smiley">😊</div>
                <h3>Appointment Scheduled!</h3>
                <p>Your appointment has been successfully scheduled. We'll send you a confirmation email shortly.</p>
                <button
                  className="btn-close"
                  onClick={() => {
                    const modal = document.getElementById("successModal")
                    if (modal) modal.style.display = "none"
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Added Footer */}
      <Footer />
    </div>
  )
}

