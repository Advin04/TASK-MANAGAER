import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.js';
import Project from './models/project.js';
import Column from './models/column.js';
import Task from './models/task.js';
import { categorizeTask } from './utils/aiService.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Find User 'Aniket'
        const user = await User.findOne({ email: 'parevartan.aniket@gmail.com' });
        if (!user) {
            console.error('User Aniket not found!');
            process.exit(1);
        }
        console.log(`Found user: ${user.name} (${user._id})`);

        // 2. Create a Dummy Project
        const project = await Project.create({
            name: 'AI Smart App Development',
            description: 'A project to showcase AI Task Categorization and Management.',
            createdBy: user._id,
            projectManager: user._id,
            teamMembers: [user._id],
        });
        console.log(`Created Project: ${project.name}`);

        // 3. Create Default Columns for the Project
        const columnNames = ['To Do', 'In Progress', 'Completed'];
        const columns = [];
        for (let i = 0; i < columnNames.length; i++) {
            const col = await Column.create({
                name: columnNames[i],
                projectId: project._id,
                order: i,
                color: i === 0 ? '#3b82f6' : i === 1 ? '#f59e0b' : '#10b981'
            });
            columns.push(col);
        }
        console.log('Created Columns');

        // 4. Update project with columns (if necessary, check schema)
        project.columns = columns.map(c => c._id);
        await project.save();

        // 5. Define Dummy Tasks for AI Testing
        const dummyTasks = [
            { name: "Fix button padding on mobile", description: "The login button is getting cut off on small screens.", priority: "High" },
            { name: "Setup MongoDB Indexing", description: "Need to optimize queries for the task list.", priority: "Medium" },
            { name: "Create React components for Navbar", description: "Implement the top navigation bar with user profile dropdown.", priority: "Medium" },
            { name: "Fix production crash on logout", description: "The app throws a 500 error when clicking logout.", priority: "High" },
            { name: "Write API documentation in README", description: "Add a section explaining the backend endpoints.", priority: "Low" },
            { name: "Deploy to Docker Container", description: "Setup Dockerfile and docker-compose for the whole app.", priority: "High" },
            { name: "Add new feature: User Preferences", description: "Allow users to save their dark mode settings.", priority: "Medium" }
        ];

        console.log('--- Creating AI Categorized Tasks ---');
        for (let i = 0; i < dummyTasks.length; i++) {
            const t = dummyTasks[i];
            const category = categorizeTask(t.name, t.description);

            await Task.create({
                name: t.name,
                description: t.description,
                priority: t.priority,
                columnId: columns[0]._id, // Put all in 'To Do'
                projectId: project._id,
                createdBy: user._id,
                assignees: [user._id],
                category: category,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                order: i
            });
            console.log(`Task: "${t.name}" -> Category: [${category}]`);
        }

        console.log('\n✅ Seeding Complete! Refresh your browser to see the data.');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
