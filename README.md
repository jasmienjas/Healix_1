# Healix

**Healix** is a modern, full-stack medical appointment booking platform designed to streamline the process of finding doctors, scheduling appointments, and managing patient-doctor interactions. Built with a focus on user experience, security, and scalability, Healix empowers both patients and healthcare providers with a seamless digital healthcare solution.

---

## 🚀 Features

- **Doctor Search & Discovery:**  
  Patients can search for doctors by name, specialty, or location, view detailed profiles, and check real-time availability.

- **Appointment Booking:**  
  Intuitive booking dialog with support for selecting date, time, and uploading medical documents.

- **User Authentication & Verification:**  
  Secure login, signup, email verification, and password reset flows for both patients and doctors.

- **Responsive UI:**  
  Clean, modern, and mobile-friendly interface built with React and Tailwind CSS.

- **Document Uploads:**  
  Patients can upload medical documents (PDF, DOC, images) during booking for better diagnosis.

- **Admin & Doctor Dashboards:**  
  Role-based dashboards for managing appointments, profiles, and availability.

- **Notifications:**  
  Real-time feedback and notifications for booking confirmations, errors, and reminders.

- **Secure Backend:**  
  Built with Django and Django REST Framework, featuring JWT authentication and robust data validation.

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js (React)
- Tailwind CSS
- TypeScript
- React Phone Input
- Lucide React Icons
- Sonner (toast notifications)

**Backend:**
- Django
- Django REST Framework
- SimpleJWT 
- PostgreSQL 
- Django CORS Headers

**Other:**
- Prisma (for type-safe database access)
- Docker 
- Render 

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.10+)
- PostgreSQL (or SQLite for local dev)
- [Yarn](https://yarnpkg.com/) or npm

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/healix.git
cd healix_1
```

### 2. Environment Setup

#### Backend

1. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your `.env` file (see `.env.example` for reference).

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the backend server:
   ```bash
   python manage.py runserver
   ```

#### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   # or
   yarn
   ```

2. Set up your `.env.local` file (see `.env.example` for reference).

3. Start the frontend dev server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

---

## 🧩 Project Structure

```
Healix_1/
  frontend/         # Next.js frontend app
    app/            # App directory (pages, components, hooks, services)
    components/     # Reusable UI components
    lib/            # API utilities
    prisma/         # Prisma client setup
    ...
  medical_booking/  # Django backend app
    accounts/       # User accounts, authentication, management
    media/          # Uploaded files (certificates, profile pictures, docs)
    ...
  public/           # Static assets
  requirements.txt  # Python dependencies
  package.json      # Node dependencies
  ...
```

---

## 🧑‍💻 Key Code Highlights

- **Booking Dialog:**  
  `frontend/app/components/BookingDialog.tsx`  
  Handles the entire patient booking flow, including form validation, file uploads, and API integration.

- **API Integration:**  
  All API calls are abstracted in `frontend/app/lib/api.ts` and `frontend/app/services/doctor.ts` for maintainability.

- **Authentication:**  
  Secure JWT-based authentication for both frontend and backend.

---

## 🛡️ Security & Best Practices

- All sensitive data is managed via environment variables.
- Input validation and sanitization on both frontend and backend.
- Role-based access control for admin, doctor, and patient users.
- Secure file upload handling.

---

**Healix** — Empowering digital healthcare, one appointment at a time.