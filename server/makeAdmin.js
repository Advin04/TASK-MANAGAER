import mongoose from 'mongoose';

async function makeAdmin() {
    await mongoose.connect('mongodb://localhost:27017/project-management-system');
    const result = await mongoose.connection.db.collection('users').updateMany(
        {},
        { $set: { role: 'admin' } }
    );
    console.log('Updated users to admin:', result.modifiedCount);

    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    users.forEach(u => console.log(`  ${u.name} (${u.email}) -> role: ${u.role}`));

    await mongoose.disconnect();
    process.exit(0);
}

makeAdmin();
