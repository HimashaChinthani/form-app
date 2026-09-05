# FormApp

A full-stack web application featuring user authentication, role-based access control, and a CRUD form management system with filtering capabilities.

## Tech Stack
- **Frontend**: React.js (Vite), TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## Features
- **Authentication**: JWT-based auth for Customers and Admins.
- **Customer Features**: Register, Login, and submit applications.
- **Admin Features**: Login, view all submissions, search, filter, edit, and delete submissions.

## Setup Instructions

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on port 5000):
   ```bash
   npm start
   ```
   *(Note: Connects to local MongoDB at `mongodb://127.0.0.1:27017/form_app` by default).*
   An initial admin account is automatically seeded upon start:
   - Email: `admin@test.com`
   - Password: `admin123`

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/register` - Customer Registration
- `POST /api/auth/login/customer` - Customer Login
- `POST /api/auth/login/admin` - Admin Login
- `POST /api/auth/create-admin` - Create new Admin (Protected)
- `POST /api/submissions` - Submit application form (Customer Protected)
- `GET /api/submissions` - Get all submissions, supports `?search=` and `?gender=` (Admin Protected)
- `PUT /api/submissions/:id` - Update submission (Admin Protected)
- `DELETE /api/submissions/:id` - Delete submission (Admin Protected)
