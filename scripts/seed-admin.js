const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/facebook-ecommerce';

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function seed() {
    await mongoose.connect(MONGODB_URI);

    const existing = await Admin.findOne({ username: 'admin' });
    if (existing) {
        console.log('Admin already exists');
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({
        username: 'admin',
        password: hashedPassword,
    });

    console.log('Admin created: admin / admin123');
    process.exit(0);
}

seed();
