const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const Parser = require('rss-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const parser = new Parser();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.use(cors());
app.use(express.json());

// In-memory arrays for V1
let intelligenceData = [];
let engineStatus = {
  isScraping: false,
  lastRun: null,
  recordsProcessed: 0
};

// AI Processing Function
async function analyzeTextWithGemini(title, contentSnippet) {
  try {
    const prompt = `Analyze the following news snippet about Budiman Sudjatmiko.
    Title: ${title}
    Snippet: ${contentSnippet}
    
    Return a strictly formatted JSON object with no markdown formatting:
    {
      "sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
      "entities": ["Location1", "Person1", "Organization1"]
    }`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (err) {
    console.error("AI Analysis failed:", err);
    return { sentiment: "NEUTRAL", entities: [] };
  }
}

// The Core Scraper Function
async function scrapeNews() {
  if (engineStatus.isScraping) return;
  engineStatus.isScraping = true;
  engineStatus.lastRun = new Date().toISOString();

  console.log(`[${engineStatus.lastRun}] Initiating Google News Web Crawl...`);
  try {
    const feed = await parser.parseURL('https://news.google.com/rss/search?q=Budiman+Sudjatmiko&hl=id&gl=ID&ceid=ID:id');
    
    // Process only top 5 to save API rate limits during dev
    const newItems = feed.items.slice(0, 5);
    
    const processedItems = [];

    for (const item of newItems) {
      // Check for deduplication first
      if (intelligenceData.some(d => d.id === item.guid)) continue;
      
      console.log(`Processing: ${item.title}`);
      const aiAnalysis = await analyzeTextWithGemini(item.title, item.contentSnippet || item.title);
      
      processedItems.push({
        id: item.guid,
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        source: item.source || 'Google News',
        sentiment: aiAnalysis.sentiment,
        entities: aiAnalysis.entities
      });
      
      // Delay to avoid hitting Gemini rate limits too fast
      await new Promise(r => setTimeout(r, 1000));
    }

    intelligenceData = [...processedItems, ...intelligenceData].slice(0, 1000); 
    engineStatus.recordsProcessed += processedItems.length;
    
    console.log(`[${new Date().toISOString()}] Crawl complete. Processed ${processedItems.length} new records.`);
  } catch (error) {
    console.error('Error during scrape:', error);
  } finally {
    engineStatus.isScraping = false;
  }
}

// REST Endpoints
app.get('/api/status', (req, res) => {
  res.json(engineStatus);
});

app.get('/api/mentions', (req, res) => {
  res.json({
    status: 'success',
    count: intelligenceData.length,
    data: intelligenceData
  });
});

app.post('/api/trigger-scrape', async (req, res) => {
  // Fire and forget
  scrapeNews();
  res.json({ status: 'success', message: 'Manual scrape initiated.' });
});

// Start Server
app.listen(port, () => {
  console.log(`Teknovra Engine running on http://localhost:${port}`);
  cron.schedule('*/15 * * * *', () => { scrapeNews(); });
  scrapeNews();
});
