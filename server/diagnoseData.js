import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/project.js';
import Task from './models/task.js';
import Column from './models/column.js';

dotenv.config();

const diagnose = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const project = await Project.findOne({ name: 'AI Smart App Development' });
        if (!project) {
            console.log('Project not found');
            process.exit();
        }
        console.log('Project found:', project._id);

        const columns = await Column.find({ projectId: project._id });
        console.log('Columns found:', columns.length);
        columns.forEach(c => console.log(`- ${c.name} (${c._id})`));

        const tasks = await Task.find({ projectId: project._id });
        console.log('Tasks found:', tasks.length);
        tasks.forEach(t => console.log(`- ${t.name} (Col: ${t.columnId}, Priority: ${t.priority})`));

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

diagnose();
