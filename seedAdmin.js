require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    const adminExists = await Admin.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt); // Default password: admin123

    await Admin.create({
      username: 'admin',
      password: hashedPassword
    });

    console.log('Admin user created successfully! Username: admin, Password: admin123');
    process.exit();
  })
  .catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
