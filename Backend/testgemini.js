const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    const genAI = new GoogleGenerativeAI('API_KEY');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-002' }); 

    const prompt = 'Hello AI! How are you?';

    try {
        const result = await model.generateContent(prompt);
        console.log('Success! AI Response:', result.response.text());
    } catch (error) {
        console.error('Gemini API Error:', error);
    }
}

testGemini();
