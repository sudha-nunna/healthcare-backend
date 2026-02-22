Care Compare Pro - Backend

This is a minimal Express + MongoDB backend scaffold created to support the Care Compare frontend.

Quick start

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

   npm install

3. Start dev server:

   npm run dev

API endpoints (initial):

- POST /api/auth/signup - register
- POST /api/auth/login - login (returns JWT)
- GET  /api/slots?doctorId=&date=YYYY-MM-DD - get or auto-generate 30-min slots for a doctor on a date
- POST /api/appointments - create appointment (body: userId, doctorId, date, time)
- POST /api/upload - upload medical file (protected)

Notes

- This scaffold uses environment variables for configuration and stores uploaded files under `backend/uploads` by default.
- Extend models and routes as needed.
