require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Using Key:', apiKey.substring(0, 5) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    console.log('Sending test prompt to gemini-pro...');
    const result = await model.generateContent('Say "success" and nothing else.');
    const response = await result.response;
    console.log('✅ Success! Response:', response.text());
  } catch (err) {
    console.error('❌ Test failed!');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    if (err.stack) console.error('Stack:', err.stack);
  }
}

testGemini();
