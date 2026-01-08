# Step-by-Step Setup Instructions

## BACKEND SETUP

### Step 1: Install Backend Dependencies
```powershell
cd backend
npm install
```

### Step 2: Configure Environment Variables
Create/edit `backend/.env` file with your MongoDB connection:

**If using MongoDB Atlas (cloud):**
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/talentbridge
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

**If using Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/talentbridge
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Step 3: Start Backend Server
```powershell
npm start
```

You should see:
- ✅ MongoDB Connected
- 🚀 Server running on http://0.0.0.0:5000

---

## FRONTEND SETUP

### Step 1: Install Frontend Dependencies
```powershell
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables
Create `frontend/.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Frontend
```powershell
npm run dev
```

You should see the Vite dev server start at http://localhost:5173

---

## TESTING THE CONNECTION

### Step 1: Open Browser
Navigate to: **http://localhost:5173**

### Step 2: Register an Account
1. Click "Register"
2. Fill in the form
3. Choose "Student" or "Company"
4. Submit

### Step 3: If Registration Works
✅ **Success!** Backend and frontend are connected!

### Step 4: If Registration Fails
Check:
- Backend terminal shows incoming requests
- Frontend `.env` has correct API URL
- Backend is running on port 5000
- MongoDB connection is successful

---

## RUNNING ON DIFFERENT DEVICES

### Find Your IP Address
```powershell
ipconfig
```
Look for IPv4 Address (e.g., 10.10.178.135)

### Update Frontend .env
```
VITE_API_URL=http://YOUR_IP:5000/api
```

### Access from Other Device
Open: **http://YOUR_IP:5173**

---

## TROUBLESHOOTING

**"Cannot connect to server"**
- Check backend is running (terminal should show "Server running")
- Verify frontend `.env` has correct API URL
- Check firewall isn't blocking port 5000

**"MongoDB connection failed"**
- Verify MONGODB_URI in backend `.env`
- For Atlas: check username/password/IP whitelist
- For Local: ensure MongoDB service is running

**"Registration failed - Email already exists"**
- Use a different email
- Or check MongoDB to delete test users

---

## QUICK COMMANDS REFERENCE

### Terminal 1 (Backend)
```powershell
cd backend
npm install      # First time only
npm start        # Every time
```

### Terminal 2 (Frontend)
```powershell
cd frontend
npm install      # First time only
npm run dev      # Every time
```

### Stop Servers
Press `Ctrl + C` in each terminal
