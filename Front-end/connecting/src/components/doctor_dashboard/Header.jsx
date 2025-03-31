import React from "react";
import { FaUserMd } from "react-icons/fa";

const Header = () => {
  return (
    <header className="header">
      <FaUserMd className="doctor-icon" />
      <h1 className="title">Doctor's Appointment Scheduler</h1>
    </header>
  );
};

export default Header;
