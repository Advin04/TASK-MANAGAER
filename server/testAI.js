import { categorizeTask } from './utils/aiService.js';

const testTasks = [
    { title: "Fix login button overlap on mobile", desc: "The button is hiding behind the footer." },
    { title: "Setup MongoDB Indexing", desc: "Optimize queries." },
    { title: "Update README documentation", desc: "Add setup steps." },
    { title: "Dockerize the application", desc: "Create Dockerfile." },
    { title: "Fix crash on logout", desc: "App closes unexpectedly." },
    { title: "Add new user profile page", desc: "React component for profiles." }
];

console.log('--- AI Categorization Test ---');
testTasks.forEach(task => {
    const category = categorizeTask(task.title, task.desc);
    console.log(`Title: "${task.title}"\nCategory: [${category}]\n`);
});
