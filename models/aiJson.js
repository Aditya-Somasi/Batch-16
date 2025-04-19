const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load environment variables

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

async function generateAIContent(prompt) {
  try {
    const result = await model.generateContent([prompt]); // Pass prompt as an array

    if (!result || !result.response) {
      console.error('Invalid response from Gemini API:', result);
      return null;
    }
    let res = result.response.text().replace(/```html|```/g, '');

    return res; // Extract response text
  } catch (error) {
    console.error('Error generating content:', error);
    return null;
  }
}

module.exports = { generateAIContent };
