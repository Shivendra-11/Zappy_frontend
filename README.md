# Zappy Frontend (Vendor Event Day Tracker)

React + Vite frontend for the Zappy Vendor Event Day Tracker.

## Features

- Vendor auth (register/login)
- Events dashboard + create event
- Event workflow: check-in → start OTP → setup photos → closing OTP
- Analytics summary

## Requirements

- Node.js 18+ (Vite 5)
- Backend API running (see `../Zappy_backend`)

## Setup

```bash
cd Zappy_frontend
npm install
```

### Environment variables

Create `Zappy_frontend/.env` (or set via your hosting provider):

```env
# IMPORTANT: must include the /api prefix
VITE_API_URL=http://localhost:5000/api
```

Notes:

- If you set `VITE_API_URL=/api`, the dev proxy in `vite.config.js` forwards to the backend at `http://localhost:5000`.
- If you deploy frontend+backend separately, set `VITE_API_URL` to your backend origin + `/api` (example: `https://your-domain.com/api`).

## Run

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`.

## Routes

- `/login`
- `/register`
- `/` (dashboard, protected)
- `/create-event` (protected)
- `/analytics` (protected)
- `/event/:eventId` (protected)

## Project Structure (high level)

```
Zappy_fullstack/
├── Zappy_backend/
└── Zappy_frontend/
    └── src/
        ├── api/api.js
        ├── components/
        ├── context/
        └── pages/
```

Images are stored on Cloudinary in organized folders:
- `vendor-checkins/` - Check-in photos
- `event-setup/pre/` - Pre-event photos
- `event-setup/post/` - Post-event photos

## 🎨 Event Status Flow

```
pending → checked-in → started → in-progress → completed
```

## 🧪 Testing the Application

1. **Register a vendor account**
2. **Login with credentials**
3. **Create a new event** with customer details
4. **Follow the workflow:**
   - Check-in with photo and location
   - Trigger and verify start OTP
   - Upload pre-event setup photos
   - Upload post-event setup photos
   - Trigger and verify closing OTP
5. **View completed event** on dashboard

## 📝 OTP System

Currently uses a mock OTP system for development:
- OTPs are generated with 6 digits
- OTPs are displayed in the UI for testing
- Console logs show OTP values

**Production Note:** Replace with actual SMS/Email service (Twilio, SendGrid, etc.)

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes and API endpoints
- Input validation
- Error handling middleware

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

#completed