
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";
import Task from "./models/task.js";
import Project from "./models/project.js";
import Column from "./models/column.js";
import ActivityLog from "./models/activityLog.js";
import Notification from "./models/notifications.js";
import Chat from "./models/chat.js";
import dbConnection from "./utils/dbconfig.js";

dotenv.config();

const resetDatabase = async () => {
    try {
        await dbConnection();
        console.log("Connected to MongoDB.");

        console.log("Clearing Users...");
        await User.deleteMany({});

        console.log("Clearing Tasks...");
        await Task.deleteMany({});

        console.log("Clearing Projects...");
        await Project.deleteMany({});

        console.log("Clearing Columns...");
        await Column.deleteMany({});

        console.log("Clearing Activity Logs...");
        await ActivityLog.deleteMany({});

        console.log("Clearing Notifications...");
        await Notification.deleteMany({});

        console.log("Clearing Chats...");
        await Chat.deleteMany({});

        console.log("Database reset successfully! All collections are now empty.");
        process.exit(0);
    } catch (error) {
        console.error("Error resetting database:", error);
        process.exit(1);
    }
};

resetDatabase();
