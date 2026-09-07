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

### Environment variables

From the project root, copy the example file and set a private JWT secret:

```bash
copy backend\.env.example backend\.env
```

For PowerShell, use `Copy-Item backend/.env.example backend/.env`. Update `JWT_SECRET` in `backend/.env` with a long random value. Keep MongoDB running locally, or replace `MONGO_URI` with your MongoDB connection string. Never commit `backend/.env` or share its credentials.

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
   *(Note: The server connects to local MongoDB at `mongodb://127.0.0.1:27017/form_app` by default and must be able to reach MongoDB before it starts listening.)*
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
   Open the URL printed by Vite, usually `http://localhost:5173`. The frontend is configured to call the backend at `http://localhost:5000/api`.

## API Endpoints
Base URL: `http://localhost:5000/api`

For protected endpoints, send the access token in this header:

```text
Authorization: Bearer <accessToken>
```

### Authentication

| Method | Endpoint | Access | Request body |
|---|---|---|---|
| POST | `/auth/register` | Public | `{ "email": "customer@example.com", "password": "pass1234", "confirmPassword": "pass1234" }` |
| POST | `/auth/login/customer` | Public | `{ "email": "customer@example.com", "password": "pass1234" }` |
| POST | `/auth/login/admin` | Public | `{ "email": "admin@test.com", "password": "admin123" }` |
| POST | `/auth/refresh` | Public | `{ "refreshToken": "<refreshToken>" }` |
| POST | `/auth/create-admin` | Seeded/super admin | `{ "email": "new-admin@example.com" }` |

Successful customer and admin login responses contain `accessToken` and `refreshToken`. Admin creation returns the generated temporary password in the response.

### Submissions

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/submissions` | Customer | Create a submission |
| GET | `/submissions` | Admin | List submissions; optional query parameters: `search` and `gender` |
| PUT | `/submissions/:id` | Admin | Update a submission by MongoDB ID |
| DELETE | `/submissions/:id` | Admin | Delete a submission by MongoDB ID |

Create or update a submission with this JSON body:

```json
{
   "firstName": "John",
   "lastName": "Doe",
   "email": "john@example.com",
   "gender": "MALE",
   "mobileNumber": "1234567890",
   "address": "123 Main Street",
   "feedback": "Optional feedback"
}
```

Valid gender values are `MALE`, `FEMALE`, and `OTHER`. The submission email must be unique, and the mobile number must contain 10 digits.

Example filtered request:

```text
GET /api/submissions?search=john&gender=MALE
```

Successful create and update requests return the submission object. Successful delete requests return:

```json
{ "message": "Submission deleted" }
```

### Postman collection

The complete Postman collection is included at `postman/FormApp.postman_collection.json`.

To use it:

1. Open Postman and select **Import**.
2. Choose `postman/FormApp.postman_collection.json`.
3. Start the backend with `npm run dev` from the `backend` directory, or use `npm start` for a non-watch process.
4. Run **Register customer**, then **Customer login**.
5. Copy the returned `accessToken` into the collection variable `accessToken`.
6. For admin requests, run **Admin login** with `admin@test.com` and `admin123`, then replace `accessToken` with the admin token.
7. Run **Create submission** or **Get submissions with filters**.
8. Copy a submission `_id` into the collection variable `submissionId` before running update or delete.
