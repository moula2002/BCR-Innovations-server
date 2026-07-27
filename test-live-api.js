require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const axios = require('axios');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("Connected to MongoDB Atlas.");
  
  // 1. Create or update test admin
  const username = "testadmin2026";
  const password = "password123";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  await Admin.findOneAndUpdate(
    { username },
    { username, password: hashedPassword },
    { upsert: true, new: true }
  );
  console.log(`Updated/created test admin: ${username}`);
  
  // 2. Try logging in to the live server
  try {
    const loginRes = await axios.post('https://bcr-innovations-server-1.onrender.com/api/auth/login', {
      username,
      password
    });
    const token = loginRes.data.token;
    console.log("Successfully logged in to live server. Token acquired.");

    // 3. Try creating a product exactly like the frontend payload
    const productPayload = {
      name: "Skyler",
      description: "Experience the pinnacle of display excellence...",
      category: "Display Cabinets",
      subcategory: "Confectionery / Patisserie",
      brands: "Continuous Display Mastery",
      sku: "",
      material: "",
      warranty: "1 Year Manufacturer Warranty",
      applications: "Pharmaceutical Industry, Biotechnology Labs, Hospital",
      features: "display area, making it suitable for desserts, pastries, chocolates, sandwiches, and other chilled food products.",
      specifications: "This premium refrigerated display counter...",
      image: "", // empty
      tabs: [
        {
          name: "New Section",
          title: "Lighting",
          description: "Electronic digital controller of William make is used for precise control and display of the temperature of the food items.",
          image: "",
          features: []
        }
      ]
    };

    console.log("Attempting to post product to live server...");
    const productRes = await axios.post('https://bcr-innovations-server-1.onrender.com/api/products', productPayload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Success! Response:", productRes.data);

  } catch (err) {
    console.log("Failed to post to live server.");
    console.log("Status:", err.response ? err.response.status : err.message);
    console.log("Data:", err.response ? JSON.stringify(err.response.data, null, 2) : '');
  } finally {
    // Cleanup the testadmin
    await Admin.deleteOne({ username });
    console.log("Cleaned up test admin user.");
    process.exit(0);
  }
});
