# Cross-Device Setup Guide for TalentBridge

This guide explains how to run TalentBridge across multiple devices (e.g., running backend on your laptop and accessing it from your phone/another computer).

## Quick Start (Same Device)

If you're just running on the same device:

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Default URLs:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173` or `http://localhost:3000`

---

## Cross-Device Setup

### Prerequisites
- Both devices must be on the **same network** (same WiFi)
- Your computer's firewall allows incoming connections on port 5000

### Step 1: Find Your Computer's IP Address

#### Windows
```bash
ipconfig
```
Look for `IPv4 Address` under your network adapter (e.g., `192.168.1.100`)

#### Mac/Linux
```bash
ifconfig
# or
ip addr
```
Look for `inet` address (e.g., `192.168.1.100`)

### Step 2: Choose Database Option

#### Option A: Local MongoDB (Same Device Only)
**Note:** This only works when frontend and backend are on the same device.

1. Install MongoDB locally
2. Backend `.env` stays as:
   ```
   MONGODB_URI=mongodb://localhost:27017/talentbridge
   ```

#### Option B: MongoDB Atlas (Recommended for Cross-Device)
**This works across any devices with internet connection.**

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update backend `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talentbridge
   ```

### Step 3: Configure Backend

1. Navigate to `backend/.env`
2. Make sure it has:
   ```env
   MONGODB_URI=<your MongoDB connection>
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000,http://localhost:5173
   ```

3. Start the backend:
   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Note the output:** You'll see your IP address in the console

### Step 4: Configure Frontend

1. Create `frontend/.env` file (copy from `.env.example`):
   ```env
   VITE_API_URL=http://<YOUR_IP>:5000/api
   ```
   
   **Replace `<YOUR_IP>`** with your computer's IP address from Step 1
   
   Example:
   ```env
   VITE_API_URL=http://192.168.1.100:5000/api
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Step 5: Access from Other Device

#### Accessing the Frontend

**Option A:** Access via network IP
- Open browser on other device
- Go to `http://<YOUR_IP>:5173` (replace with your IP)
- Example: `http://192.168.1.100:5173`

**Option B:** Build and deploy (for mobile testing)
```bash
cd frontend
npm run build
npm run preview
```
Then access at `http://<YOUR_IP>:4173`

## Troubleshooting

### Registration Fails / Cannot Connect to Server

**Error:** "Cannot connect to server. Please ensure the backend is running and accessible."

**Solutions:**
1. ✅ Check backend is running (`npm start` in backend folder)
2. ✅ Verify `frontend/.env` has correct IP address
3. ✅ Confirm both devices are on same WiFi network
4. ✅ Check Windows Firewall:
   ```powershell
   # Windows PowerShell (Run as Administrator)
   New-NetFirewallRule -DisplayName "TalentBridge Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
   ```

### MongoDB Connection Failed

**Error:** "❌ Error connecting to MongoDB"

**Solutions:**

**For Local MongoDB:**
1. Check MongoDB is running:
   ```bash
   mongod --version
   ```
2. Start MongoDB service if needed

**For MongoDB Atlas:**
1. Check connection string is correct
2. Whitelist your IP in Atlas dashboard (Network Access)
3. Ensure credentials are correct

### CORS Error

**Error:** "Access to fetch at '...' has been blocked by CORS policy"

**Solutions:**
1. Ensure `NODE_ENV=development` in backend `.env`
2. Restart backend server after changing `.env`

### Timeout Error

**Error:** "Request timeout. Server might be slow or unreachable."

**Solutions:**
1. Check network connection
2. Verify backend is responding: `http://<YOUR_IP>:5000/api/health`
3. Restart backend server

## Environment Variables Reference

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api     # For same device
# VITE_API_URL=http://192.168.1.100:5000/api  # For cross-device
```

### Backend (.env)
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/talentbridge

# OR MongoDB Atlas (recommended for cross-device)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talentbridge

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## Complete Example

**Scenario:** Laptop (192.168.1.100) running backend, accessing from phone

1. **Backend .env:**
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/talentbridge
   JWT_SECRET=mysecretkey123
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000,http://localhost:5173
   ```

2. **Frontend .env:**
   ```env
   VITE_API_URL=http://192.168.1.100:5000/api
   ```

3. **Commands:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

4. **Access:**
   - On laptop: `http://localhost:5173`
   - On phone: `http://192.168.1.100:5173`

## Production Deployment

For production deployment (not localhost):

1. Update `NODE_ENV=production` in backend `.env`
2. Set specific `CORS_ORIGIN` to your frontend URL
3. Use strong `JWT_SECRET`
4. Use MongoDB Atlas, not local MongoDB
5. Consider HTTPS for security

## Need Help?

Check these files for configuration:
- Frontend API config: `frontend/src/utils/api.js`
- Backend CORS config: `backend/server.js`
- Database config: `backend/config/db.js`
