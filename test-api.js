const axios = require('axios');
(async () => {
  try {
    const res = await axios.post('https://bcr-innovations-server-1.onrender.com/api/products', {
      name: "Test",
      description: "Test Desc",
      category: "some-cat"
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.log("Error status:", err.response ? err.response.status : err.message);
    console.log("Error data:", err.response ? err.response.data : '');
  }
})();
