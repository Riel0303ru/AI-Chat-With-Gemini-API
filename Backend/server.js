const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const detect = require('detect-port-alt');

const app = express();
const DEFAULT_PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const API_KEY = 'AIzaSyD8HbESkh6KatyE7_FzabS_Ln7M8EGpVnY';
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro-002' 
});

app.post('/chat', async (req, res) => {
  const { message, image, mimeType } = req.body;

  console.log('📩 Incoming Request:', {
    message,
    hasImage: !!image,
    mimeType
  });

  try {
    const parts = [];

    // Text message
    if (message) {
      parts.push({
        text: message
      });
    }

    // Image file base64
    if (image) {
      if (!mimeType) {
        return res.status(400).json({ error: 'Mime type is required when sending an image!' });
      }

      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: image
        }
      });
    }

    // HARUS ada role "user"
    const contents = [
      {
        role: 'user',
        parts: parts
      }
    ];

    console.log('🚀 Request to Gemini API:', JSON.stringify({ contents }, null, 2));

    // Send to Gemini
    const result = await model.generateContent({
      contents: contents
    });

    const reply = result.response.text();

    console.log('✅ AI Reply:', reply);

    res.json({ reply });
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    res.status(500).json({
      error: 'Something went wrong!',
      details: error.message
    });
  }
});

detect(DEFAULT_PORT)
  .then(_port => {
    app.listen(_port, () => {
      console.log(`🚀 Backend run in http://localhost:${_port}`);
    });
  })
  .catch(err => {
    console.error('❌ search a port:', err);
  });
