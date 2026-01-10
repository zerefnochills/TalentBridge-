const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const User = require('./models/User');
        const user = await User.findOne({ email: 'example2@gmail.com' });
        if (user) {
            console.log('Clearing skills for:', user.email);
            console.log('Old skill count:', user.skills.length);
            user.skills = [];
            await user.save();
            console.log('Skills cleared.');
        } else {
            console.log('User not found');
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
