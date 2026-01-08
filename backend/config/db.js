const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);

        if (retries > 0) {
            console.log(`🔄 Retrying connection... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        } else {
            console.error('❌ MongoDB connection failed after multiple retries.');
            console.error('💡 Troubleshooting tips:');
            console.error('   1. Check if MongoDB is running: mongod --version');
            console.error('   2. Verify MONGODB_URI in .env file');
            console.error('   3. For cross-device access, consider using MongoDB Atlas');
            process.exit(1);
        }
    }
};

module.exports = connectDB;
