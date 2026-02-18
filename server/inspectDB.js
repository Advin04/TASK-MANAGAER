import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/project.js';
import Task from './models/task.js';
import Column from './models/column.js';

dotenv.config();

const inspectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- DB Inspection ---');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const project = await Project.findOne({ name: 'AI Smart App Development' });
        if (!project) {
            console.log('Project not found');
            process.exit();
        }

        console.log(`Project ID: ${project._id}`);

        const tasks = await Task.find({ projectId: project._id, isActive: true });
        console.log(`Tasks for project: ${tasks.length}`);

        if (tasks.length > 0) {
            const firstTask = tasks[0];
            console.log('First Task columnId type:', typeof firstTask.columnId, firstTask.columnId.constructor.name);

            const column = await Column.findById(firstTask.columnId);
            console.log('Column found for Task:', column ? column.name : 'NOT FOUND');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

inspectDB();
