const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load environment variables

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

async function generateAIContent(topic) {
  try {
    let prompt = `Generate a catchy social media post about ${topic}. The post should include:
	•	A compelling and engaging heading
	•	A short, engaging description that excites the audience
	•	Relevant emojis to make it visually appealing
	•	Trending hashtags to maximize reach
	•	The tone should be friendly, engaging, and attention-grabbing.It has to be in tailwind css tags.
   in <main> block. No need of explanation only html data.It has to be 200 words or more.`;

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
