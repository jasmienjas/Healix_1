import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for drag-and-drop functionality
import './CalendarComponent.css';  // Import custom CSS for styling

const CalendarComponent = () => {
  // Initial state for events and filtered events
  const [events, setEvents] = useState([
    { title: "Patient: John Doe", start: "2025-02-20T10:00:00", color: "#007bff" },
    { title: "Patient: Jane Smith", start: "2025-02-20T14:00:00", color: "#ff5722" }
  ]);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle adding new appointments by date click
  const handleDateClick = (selectInfo) => {
    const patientName = prompt("Enter patient name:");
    if (patientName) {
      const newEvent = { title: `Patient: ${patientName}`, start: selectInfo.dateStr, color: "#007bff" };
      setEvents([...events, newEvent]);
      setFilteredEvents([...filteredEvents, newEvent]);
    }
  };

  // Handle search functionality for filtering appointments
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  // Handle event click for appointment approval
  const handleEventClick = (clickInfo) => {
    const isConfirmed = window.confirm(`Do you confirm the appointment with ${clickInfo.event.title}?`);
    clickInfo.event.setProp("color", isConfirmed ? "#4caf50" : "#f44336");
    clickInfo.event.setProp(
      "title",
      isConfirmed ? `${clickInfo.event.title} (Confirmed)` : `${clickInfo.event.title} (Rejected)`
    );
  };

  // Handle event drop (drag-and-drop rescheduling)
  const handleEventDrop = (info) => {
    alert(`Appointment moved to: ${info.event.start}`);
    // Here, you can implement additional logic to save the new event times
  };

  // Handle voice commands for scheduling
  const handleVoiceCommand = () => {
    const recognition = new window.SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      alert(`You said: ${command}`);

      if (command.toLowerCase().includes("book an appointment")) {
        const patientName = prompt("Enter patient name:");
        if (patientName) {
          const newEvent = { title: `Patient: ${patientName}`, start: new Date(), color: "#007bff" };
          setEvents([...events, newEvent]);
          setFilteredEvents([...filteredEvents, newEvent]);
        }
      }
    };
  };

  return (
    <div className="calendar-container">
      {/* Search bar for filtering appointments */}
      <input
        type="text"
        placeholder="Search Appointments..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      
      {/* Voice command button */}
      <button onClick={handleVoiceCommand} className="voice-command-btn">
        🎙️ Voice Command
      </button>

      {/* FullCalendar component with all the necessary features */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        events={filteredEvents}
        select={handleDateClick} // Handle adding new appointments
        eventClick={handleEventClick} // Handle appointment approval
        eventDrop={handleEventDrop} // Handle rescheduling via drag-and-drop
      />
    </div>
  );
};

export default CalendarComponent;
