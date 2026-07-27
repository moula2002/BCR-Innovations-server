const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 'test' }, 'fallback_secret_key');
const form = new FormData();
form.append('image', fs.createReadStream('./test.jpg'));

axios.post('http://localhost:5000/api/upload', form, {
  headers: {
    ...form.getHeaders(),
    Authorization: `Bearer ${token}`
  }
}).then(res => console.log(res.data)).catch(err => {
    if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
    } else {
        console.log(err.message);
    }
});


