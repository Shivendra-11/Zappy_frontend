# Zappy - Vendor Event Day Tracker

A full-stack web application for tracking vendor activities during events, built for the Zappy FullStack Internship Assessment.

## 🎯 Features

### Core Workflow
1. **Vendor Check-In**
   - Photo upload with timestamp
   - Geo-location capture
   - Automatic status update

2. **Start Event OTP Verification**
   - Customer OTP trigger
   - OTP verification system
   - Event start confirmation

3. **Event Setup Progress Tracking**
   - Pre-event setup photos
   - Post-event setup photos
   - Notes and annotations
   - Progress monitoring

4. **Closing Confirmation**
   - Closing OTP trigger
   - Final verification
   - Event completion

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File upload middleware
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **CSS3** - Styling with gradients

## 📁 Project Structure

```
Zappy/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── cloudinary.js         # Cloudinary setup
│   ├── models/
│   │   ├── Vendor.js             # Vendor schema
│   │   └── Event.js              # Event schema
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── upload.js             # Multer file upload
│   │   └── errorHandler.js       # Error handling
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   └── eventController.js    # Event workflow logic
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── eventRoutes.js        # Event endpoints
│   ├── utils/
│   │   └── otpService.js         # OTP generation
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation bar
    │   │   └── PrivateRoute.jsx  # Route protection
    │   ├── context/
    │   │   └── AuthContext.jsx   # Auth state management
    │   ├── pages/
    │   │   ├── Login.jsx         # Login page
    │   │   ├── Register.jsx      # Registration page
    │   │   ├── Dashboard.jsx     # Events dashboard
    │   │   ├── CreateEvent.jsx   # Create new event
    │   │   └── EventDetails.jsx  # Event workflow page
    │   ├── api/
    │   │   └── api.js            # API client
    │   ├── App.jsx               # Root component
    │   └── main.jsx              # Entry point
    ├── .env
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   cd "c:\Users\HP\OneDrive\Desktop\Zappy"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment**
   
   Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://shivendrakeshari11_db_user:i4MH79sjLVnaz0VU@cluster0.wkob5in.mongodb.net/
   JWT_SECRET=zappy_secret_key_2024_vendor_tracker
   PORT=5000

   # Get these from your Cloudinary dashboard
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure Frontend Environment**
   
   The `frontend/.env` is already configured:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Getting Cloudinary Credentials

1. Go to [cloudinary.com](https://cloudinary.com/)
2. Sign up or log in
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Update `backend/.env` with these values

## 🎮 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register vendor
- `POST /api/auth/login` - Login vendor
- `GET /api/auth/me` - Get current vendor

### Events
- `POST /api/events` - Create new event
- `GET /api/events` - Get all vendor's events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events/:id/checkin` - Vendor check-in with photo & location
- `POST /api/events/:id/start-otp` - Trigger start OTP
- `POST /api/events/:id/verify-start-otp` - Verify start OTP
- `POST /api/events/:id/setup-photos` - Upload setup photos (pre/post)
- `POST /api/events/:id/closing-otp` - Trigger closing OTP
- `POST /api/events/:id/verify-closing-otp` - Verify closing OTP

## 🔒 Authentication

All event endpoints require JWT authentication:
```javascript
Headers: {
  Authorization: 'Bearer <your_jwt_token>'
}
```

## 📸 Image Upload

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

## 🤝 Contributing

This is an internship assessment project for Zappy.

## 📄 License

This project is created as part of the Zappy FullStack Internship Assessment.

## 👨‍💻 Developer

Created by a candidate for Zappy FullStack Internship position.

## 📞 Support

For questions about the assessment, please contact Zappy's recruitment team.

---

**Note:** Make sure to get valid Cloudinary credentials before running the application to enable image uploads!
