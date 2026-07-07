const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const Parser = require('rss-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const parser = new Parser();

app.use(cors());
app.use(express.json());

// In-memory array to store mock crawled data before we connect Supabase
let intelligenceData = [];

// The Core Scraper Function
async function scrapeNews() {
  console.log(`[${new Date().toISOString()}] Initiating Google News Web Crawl...`);
  try {
    // Target: Budiman Sudjatmiko (Indonesian News)
    const feed = await parser.parseURL('https://news.google.com/rss/search?q=Budiman+Sudjatmiko&hl=id&gl=ID&ceid=ID:id');
    
    const newItems = feed.items.slice(0, 10).map(item => ({
      id: item.guid,
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      source: item.source || 'Google News',
      // Placeholder fields for AI analysis
      sentiment: 'PENDING', 
      entities: []
    }));

    // Deduplicate and store
    const existingIds = new Set(intelligenceData.map(d => d.id));
    const uniqueItems = newItems.filter(item => !existingIds.has(item.id));
    
    intelligenceData = [...uniqueItems, ...intelligenceData].slice(0, 1000); // Keep last 1000
    
    console.log(`[${new Date().toISOString()}] Crawl complete. Extracted ${uniqueItems.length} new records.`);
  } catch (error) {
    console.error('Error during scrape:', error);
  }
}

// REST Endpoints for the Dashboard
app.get('/api/mentions', (req, res) => {
  res.json({
    status: 'success',
    count: intelligenceData.length,
    data: intelligenceData
  });
});

app.post('/api/trigger-scrape', async (req, res) => {
  await scrapeNews();
  res.json({ status: 'success', message: 'Manual scrape completed.' });
});

// Start Server
app.listen(port, () => {
  console.log(`Teknovra Engine running on http://localhost:${port}`);
  
  // Schedule the crawler to run every 15 minutes
  cron.schedule('*/15 * * * *', () => {
    scrapeNews();
  });
  
  // Do an initial scrape on startup
  scrapeNews();
});
