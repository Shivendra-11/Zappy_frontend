# 🚀 Quick Start Guide - Zappy Vendor Event Day Tracker

## ✅ Current Status

- ✅ Backend server running on `http://localhost:5000`
- ✅ Frontend server running on `http://localhost:3000`
- ✅ MongoDB connected successfully
- ✅ All dependencies installed

## 🎯 Access the Application

**Frontend URL:** http://localhost:3000

## 📋 Testing Flow

### 1. Register a Vendor Account
1. Go to http://localhost:3000/register
2. Fill in the registration form:
   - Name: Your Name
   - Email: your@email.com
   - Phone: 1234567890
   - Password: password123
3. Click "Register"
4. You'll be automatically logged in and redirected to the Dashboard

### 2. Create Your First Event
1. On the Dashboard, click "+ Create New Event"
2. Fill in the Event Information:
   - Event Name: e.g., "Wedding Reception"
   - Event Date: Select a date
   - Location: e.g., "Grand Hotel, Mumbai"
3. Fill in Customer Information:
   - Customer Name: e.g., "John Doe"
   - Customer Email: john@example.com
   - Customer Phone: 9876543210
4. Click "Create Event"
5. You'll be redirected to the Event Details page

### 3. Complete the Event Workflow

#### Stage 1: Vendor Check-In ✅
1. Click on "Check-In" tab
2. Upload a photo (any image from your computer)
3. Click "Check In with Location"
4. Allow browser to access your location when prompted
5. ✅ Check-in completed!

#### Stage 2: Start Event OTP 🔢
1. Click on "Start OTP" tab
2. Click "Send Start OTP to Customer"
3. **Note the OTP displayed** (e.g., "123456")
4. Enter the OTP in the input field
5. Click "Verify OTP"
6. ✅ Event started!

#### Stage 3: Event Setup Photos 📸
1. Click on "Event Setup" tab
2. **Upload Pre-Event Photos:**
   - Click "Choose Photos" under Pre-Event section
   - Select one or more images
   - (Optional) Add notes
   - Click "Upload Pre-Event Photos"
3. **Upload Post-Event Photos:**
   - Click "Choose Photos" under Post-Event section
   - Select one or more images
   - (Optional) Add notes
   - Click "Upload Post-Event Photos"
4. ✅ Photos uploaded!

#### Stage 4: Close Event 🎉
1. Click on "Close Event" tab
2. Click "Send Closing OTP to Customer"
3. **Note the closing OTP displayed**
4. Enter the OTP in the input field
5. Click "Verify & Close Event"
6. 🎉 **Event Completed Successfully!**

### 4. View Events on Dashboard
1. Click "Dashboard" in the navigation bar
2. See all your events with:
   - Status badges (color-coded)
   - Progress indicators (✅ for completed steps)
   - Event details
3. Click any event card to view its details

## 🔑 Important Notes

### OTP System (Development Mode)
- OTPs are **displayed in the UI** for testing
- In production, these would be sent via SMS/Email
- OTPs are also logged in the backend console

### Cloudinary Setup
⚠️ **The current Cloudinary credentials are placeholders!**

To enable image uploads:
1. Go to [cloudinary.com](https://cloudinary.com/)
2. Sign up or log in
3. Go to Dashboard
4. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret
5. Update `backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   CLOUDINARY_API_KEY=your_actual_api_key
   CLOUDINARY_API_SECRET=your_actual_api_secret
   ```
6. Restart the backend server

### Geolocation
- **Browser will prompt for location permission**
- Click "Allow" to enable check-in functionality
- Works best on HTTPS (in production)

## 🖼️ Sample Test Data

### Test Vendor Account
```
Name: Test Vendor
Email: vendor@test.com
Phone: 1234567890
Password: test123
```

### Test Event Data
```
Event Name: Annual Conference 2024
Event Date: 2024-12-31
Location: Convention Center, New York
Customer Name: Alice Johnson
Customer Email: alice@example.com
Customer Phone: 5551234567
```

## 📱 Features to Test

### ✅ Authentication
- [x] Vendor registration
- [x] Vendor login
- [x] Auto-redirect when logged in
- [x] Logout functionality

### ✅ Event Management
- [x] Create new event
- [x] View all events
- [x] View event details
- [x] Status tracking

### ✅ Event Workflow
- [x] Check-in with photo upload
- [x] Geo-location capture
- [x] Start OTP generation
- [x] Start OTP verification
- [x] Pre-event photos (multiple)
- [x] Post-event photos (multiple)
- [x] Closing OTP generation
- [x] Closing OTP verification
- [x] Event completion

### ✅ UI/UX
- [x] Responsive design
- [x] Toast notifications
- [x] Loading states
- [x] Error handling
- [x] Progress indicators
- [x] Color-coded status badges

## 🐛 Troubleshooting

### Backend not starting?
```powershell
# Kill Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Restart backend
cd "c:\Users\HP\OneDrive\Desktop\Zappy\backend"
node server.js
```

### Frontend not starting?
```powershell
# Restart frontend
cd "c:\Users\HP\OneDrive\Desktop\Zappy\frontend"
npm run dev
```

### Can't upload images?
- Check Cloudinary credentials in `backend/.env`
- Ensure backend is running
- Check browser console for errors

### Location not working?
- Allow location permission in browser
- Use HTTPS in production
- Check if browser supports geolocation

### Database connection error?
- MongoDB URI is already configured
- Check internet connection
- Verify MongoDB Atlas cluster is running

## 📊 API Endpoints Test

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","phone":"1234567890","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Registration redirects to Dashboard
2. ✅ Dashboard shows your events
3. ✅ Check-in captures photo and location
4. ✅ OTPs are displayed and can be verified
5. ✅ Photos upload successfully
6. ✅ Event status changes through workflow
7. ✅ Event completes with celebration message
8. ✅ Toast notifications appear for actions

## 📸 Screenshots Checklist

Take screenshots of:
- [ ] Registration page
- [ ] Login page
- [ ] Empty dashboard
- [ ] Create event form
- [ ] Dashboard with events
- [ ] Event details - Check-in section
- [ ] Event details - OTP sections
- [ ] Event details - Setup photos
- [ ] Completed event

## 🔄 Reset & Start Fresh

To test from scratch:

1. **Clear browser data:**
   - Open DevTools (F12)
   - Go to Application → Storage
   - Click "Clear site data"

2. **Stop servers:**
   ```powershell
   Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

3. **Restart servers:**
   ```powershell
   # Backend
   cd "c:\Users\HP\OneDrive\Desktop\Zappy\backend"
   node server.js

   # Frontend (in new terminal)
   cd "c:\Users\HP\OneDrive\Desktop\Zappy\frontend"
   npm run dev
   ```

## 📞 Need Help?

- Check backend console for logs
- Check frontend browser console for errors
- Review README.md files for detailed documentation
- Check MongoDB Atlas dashboard for database status

---

## 🎓 Assessment Completion

This project demonstrates:
- ✅ Full-stack development (React + Node.js + MongoDB)
- ✅ REST API design
- ✅ Authentication (JWT)
- ✅ File uploads (Cloudinary)
- ✅ Geo-location integration
- ✅ OTP workflow
- ✅ Responsive UI design
- ✅ State management
- ✅ Error handling
- ✅ Modern React patterns

**Built for Zappy FullStack Internship Assessment** 🚀

---

**Happy Testing! 🎉**
