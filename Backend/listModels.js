const axios = require('axios');

const API_KEY = 'APi_Key';
const URL = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;

async function listModels() {
    try {
        const response = await axios.get(URL);
        console.log('Available Models:', response.data.models);
    } catch (error) {
        console.error('Error fetching model list:', error.response ? error.response.data : error.message);
    }
}

listModels();
