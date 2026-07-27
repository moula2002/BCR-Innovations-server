const axios = require('axios');
(async () => {
  try {
    // 1. Login
    const loginRes = await axios.post('https://bcr-innovations-server-1.onrender.com/api/auth/login', {
      username: "admin",
      password: "admin123"
    });
    const token = loginRes.data.token;
    console.log("Logged in. Token:", token ? "Found" : "Missing");

    // 2. Try posting product
    const productRes = await axios.post('https://bcr-innovations-server-1.onrender.com/api/products', {
      name: "Test",
      description: "Test Desc",
      category: "display-cabinets",
      subcategory: "confectionery-patisserie",
      image: null
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Success creating product:", productRes.data);
  } catch (err) {
    console.log("Error status:", err.response ? err.response.status : err.message);
    console.log("Error data:", err.response ? err.response.data : '');
  }
})();
