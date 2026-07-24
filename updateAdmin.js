require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    // Hashing the password that the user wanted to use
    const hashedPassword = await bcrypt.hash('bcrinnovation', salt); 

    // Update the existing user or create a new one
    await Admin.findOneAndUpdate(
      { username: 'bcrinnovation@gmail.com' },
      { 
        username: 'bcrinnovation@gmail.com',
        password: hashedPassword
      },
      { upsert: true, new: true }
    );

    console.log('Admin user updated successfully with hashed password!');
    console.log('Username: bcrinnovation@gmail.com');
    console.log('Password: bcrinnovation');
    process.exit();
  })
  .catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
