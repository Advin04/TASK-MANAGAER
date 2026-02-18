import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.js';

dotenv.config();

const showUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}, 'name email role');
        console.log('--- Registered Users ---');
        console.table(users.map(u => ({ name: u.name, email: u.email, role: u.role })));
        process.exit();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

showUsers();
