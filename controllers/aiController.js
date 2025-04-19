// Import AI model
const aiModel = require('../models/aiModel');
const aiJson = require('../models/aiJson');

// Render AI app page with form to take prompt
exports.getAIApp = (req, res) => {
  const user = req.session.user;
  res.render('aiapp', { user, content: '' });
};

// Handle AI content generation
exports.generateAIContent = async (req, res) => {
  let { prompt } = req.body;
  const user = req.session.user;
  console.log('prompt', prompt);
  // Generate content using AI model
  const generatedContent = await aiModel.generateAIContent(prompt);

  // Show error if content generation fails
  if (!generatedContent) {
    return res.render('aiApp', {
      error: 'Failed to generate code',
      content: '',
    });
  }

  // Render AI app page with generated content
  res.render('aiapp', { content: generatedContent, user });
};

exports.analyze = async (req, res) => {
  try {
    const { query, analysisType } = req.body; // Get data from form submission

    if (!query) {
      return res.status(400).send('Query is required.');
    }

    let prompt = '';

    if (analysisType === 'Trends') {
      prompt = `Generate a JSON object containing trending topics, search keywords, and hashtags related to the keyword "${query}," along with their respective popularity indices. Include 12 items for each category. The JSON structure should use "trending_topics," "search_keywords," and "hashtags" as primary keys. Within each category, use "topic" and "popularity_index" for trending topics, "keyword" and "popularity_index" for search keywords, and "hashtag" and "popularity_index" for hashtags as secondary keys. Do not include any explanatory text.`;
    } else if (analysisType === 'Sentiment') {
      prompt = `
      Generate a structured JSON object analyzing the sentiment for the topic "${query}".  
      Ensure the response contains:
      - A top-level key "topic" with the name of the topic.  
      - A "sentiments" key with three categories: "positive", "negative", and "neutral".  
      - Each category should contain **exactly 5 items**.  
      - Each item must have:
        - A "title" (concise and descriptive).  
        - A "description" (detailed, at least 2-3 sentences).  
        - A "sentiment_score" (positive: 0.6 to 1.0, negative: -0.6 to -1.0, neutral: -0.2 to 0.2).  
      
      Ensure the descriptions are **diverse**, **non-repetitive**, and **well-structured**.  
      The output must be **valid JSON**.
      `;
    } else if (analysisType === 'Strategies') {
      prompt = `I'm looking to create engaging social media content about ${query}. Please provide a JSON object containing suggestions for posts that are likely to generate high engagement as well as strategies for creating potentially viral content. The JSON should have keys like "engagement" and "viral_content." Each key should contain a list of 5 to 10 detailed points, where each point includes a title, a long description, and an example.`;
    } else {
      prompt = `Perform ${analysisType} analysis on the following topic: ${query}`;
    }

    let rawResponse = await aiJson.generateAIContent(prompt);
    console.log('Raw AI Response:', rawResponse);

    // Ensure only JSON is extracted
    let jsonResponse = rawResponse.trim();

    // Remove unnecessary "json" prefix if it exists
    if (jsonResponse.startsWith('json')) {
      jsonResponse = jsonResponse.slice(4).trim(); // Remove "json" and trim again
    }

    // Remove Markdown-style JSON wrapping if needed
    if (jsonResponse.startsWith('```json')) {
      jsonResponse = jsonResponse.slice(7, -3).trim();
    }
    console.log('Json Response:', jsonResponse);
    try {
      // Parse the AI response as JSON
      const jsonData = JSON.parse(jsonResponse);

      // Determine which template to render based on analysisType
      let template = 'resultPage'; // Default template

      if (analysisType === 'Trends') {
        template = 'trends';
      } else if (analysisType === 'Sentiment') {
        template = 'sentiments';
      } else if (analysisType === 'Strategies') {
        template = 'strategies';
      }

      // Render the respective template with parsed data
      res.render(template, { content: jsonData, query, analysisType });
    } catch (error) {
      console.error('Error parsing AI response:', error);
      res.render('errorPage', {
        message: 'Failed to process AI response',
        query,
        analysisType,
      });
    }
  } catch (error) {
    console.error('Error analyzing content:', error);
    res.status(500).send('Internal Server Error');
  }
};
