import React from "react";
import { FaCalendarAlt, FaUserCheck, FaFileExport } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";

const exportPDF = () => {
  const doc = new jsPDF();
  doc.text("Doctor's Schedule", 20, 10);
  doc.autoTable({ head: [["Time", "Patient", "Status"]], body: [["10:00 AM", "John Doe", "Confirmed"]] });
  doc.save("schedule.pdf");
};

const exportExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Schedule");
  sheet.addRow(["Time", "Patient", "Status"]);
  sheet.addRow(["10:00 AM", "John Doe", "Confirmed"]);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "schedule.xlsx";
  link.click();
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Doctor's Dashboard</h2>
      <ul>
        <li><FaCalendarAlt /> View Schedule</li>
        <li><FaUserCheck /> Confirm Appointments</li>
        <li onClick={exportPDF}><FaFileExport /> Export to PDF</li>
        <li onClick={exportExcel}><FaFileExport /> Export to Excel</li>
      </ul>
    </div>
  );
};

export default Sidebar;
