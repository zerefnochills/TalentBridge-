# Quick Reference: Cross-Device Setup

## Your Network IP Address
**10.10.178.135**

## Quick Setup Steps

### 1. Create frontend/.env file
```env
VITE_API_URL=http://10.10.178.135:5000/api
```

### 2. Start Backend
```bash
cd backend
npm start
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

### 4. Access Application

**From this device:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

**From other devices (same network):**
- Frontend: http://10.10.178.135:5173
- Backend API: http://10.10.178.135:5000/api

## For MongoDB Atlas (Recommended)

Sign up at: https://www.mongodb.com/cloud/atlas

Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talentbridge
```

## Troubleshooting

If registration fails:
1. ✅ Check both backend and frontend are running
2. ✅ Verify `frontend/.env` has correct IP (10.10.178.135)
3. ✅ Ensure devices are on same WiFi network
4. ✅ Check Windows Firewall allows port 5000

See SETUP.md for detailed instructions.
