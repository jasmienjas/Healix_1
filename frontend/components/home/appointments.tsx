"use client"

import type { FormEvent } from "react"
import type { FC } from "react"

const Appointments: FC = () => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    // Get form elements safely with type checking
    const emailInput = document.getElementById("email") as HTMLInputElement | null
    const emailError = document.getElementById("emailError") as HTMLParagraphElement | null
    const dateInput = document.getElementById("date") as HTMLInputElement | null
    const timeInput = document.getElementById("time") as HTMLInputElement | null

    if (!emailInput || !emailError || !dateInput || !timeInput) {
      console.error("Form elements not found")
      return
    }

    const email = emailInput.value
    const date = dateInput.value
    const time = timeInput.value

    const existingAppointments = [{ date: "2025-07-02", time: "10:00" }]

    const booked = existingAppointments.some((app) => app.date === date && app.time === time)

    if (!email.includes("@")) {
      emailError.style.display = "block"
      return
    } else {
      emailError.style.display = "none"
    }

    if (booked) {
      alert("Sorry, this time slot is already taken. Please choose another time.")
      return
    }

    // Show Success Modal
    const successModal = document.getElementById("successModal") as HTMLDivElement | null
    if (successModal) {
      successModal.style.display = "flex"
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Video container with form elements - height reduced to better fit content */}
      <div className="container" style={{ position: "relative", height: "400px", marginBottom: "40px" }}>
        <div className="description">
          <h2>Make An Appointment</h2>
          <p>
            Schedule an appointment with our expert doctors across multiple departments. Choose your preferred date and
            time.
          </p>
        </div>

        <div className="form-container">
          <form id="appointmentForm" onSubmit={handleSubmit}>
            <div className="form-grid">
              <select id="department">
                <option value="">Choose Department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
              <select id="doctor">
                <option value="">Select Doctor</option>
                <option value="Dr. Smith">Dr. Smith</option>
                <option value="Dr. Johnson">Dr. Johnson</option>
              </select>
              <input type="text" id="name" placeholder="Your Name" />
              <input type="email" id="email" placeholder="Your Email" />
              <input type="date" id="date" />
              <input type="time" id="time" />
              <p className="error" id="emailError" style={{ display: "none", color: "red" }}>
                Please enter a valid email address
              </p>
            </div>
          </form>
        </div>

        {/* Video background - cropped to fit content better */}
        <div
          className="video-background"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            zIndex: -1,
            height: "100%",
            overflow: "hidden", // Ensure video stays within bounds
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube-nocookie.com/embed/Bv-J4XSRLx4?autoplay=1&mute=1&loop=1&playlist=Bv-J4XSRLx4&controls=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Button positioned further down to avoid overlap */}
      <button
        type="submit"
        className="btn"
        style={{ marginTop: "20px" }}
        onClick={(e) =>
          document
            .getElementById("appointmentForm")
            ?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
        }
      >
        Make An Appointment
      </button>
    </div>
  )
}

export default Appointments

