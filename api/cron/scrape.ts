import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const parser = new Parser();

export default async function handler(req: any, res: any) {
  // Prevent abuse: in production, you can check for Vercel's authorization header here
  // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return res.status(401).end('Unauthorized');
  // }

  try {
    // 1. Fetch Target Entities from Settings
    const { data: settingsData } = await supabase
      .from('settings')
      .select('target_entities')
      .eq('id', 1)
      .single();

    const targetEntities = settingsData?.target_entities || ["Budiman Sudjatmiko"];
    let totalProcessed = 0;

    for (const target of targetEntities) {
      // Encode the target for the Google News URL
      const encodedQuery = encodeURIComponent(target);
      const feed = await parser.parseURL(`https://news.google.com/rss/search?q=${encodedQuery}&hl=id&gl=ID&ceid=ID:id`);
      
      // Process up to 30 items per entity
      const newItems = feed.items.slice(0, 30); 

      // Filter out items already in the database
      const itemsToProcess = [];
      for (const item of newItems) {
        const { data: existing } = await supabase
          .from('mentions')
          .select('guid')
          .eq('guid', item.guid)
          .single();
        if (!existing) itemsToProcess.push(item);
      }

      if (itemsToProcess.length === 0) continue;

      const processedItems = [];

      try {
        // Batch analyze up to 30 items in ONE prompt to avoid Vercel timeouts and Gemini rate limits
        const prompt = `Analyze the following news snippets about ${target}.
        Return a strictly formatted JSON array where each object corresponds to the snippet's index, containing:
        "sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
        "entities": ["Location1", "Person1"]

        Snippets:
        ${itemsToProcess.map((item, idx) => `[${idx}] Title: ${item.title}\nSnippet: ${item.contentSnippet || item.title}`).join('\n\n')}
        
        ONLY output valid JSON.`;
        
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiDataArray = JSON.parse(cleanText);
        
        itemsToProcess.forEach((item, idx) => {
          const aiData = aiDataArray[idx] || {};
          processedItems.push({
            guid: item.guid,
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate || Date.now()).toISOString(),
            source: item.source || 'Google News',
            sentiment: aiData.sentiment || "NEUTRAL",
            entities: aiData.entities || []
          });
        });
      } catch (err) {
        console.error(`AI Batch Analysis failed for ${target}`, err);
        // Fallback: save them as neutral if AI fails
        itemsToProcess.forEach((item) => {
          processedItems.push({
            guid: item.guid,
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate || Date.now()).toISOString(),
            source: item.source || 'Google News',
            sentiment: "NEUTRAL",
            entities: []
          });
        });
      }

      if (processedItems.length > 0) {
        const { error } = await supabase.from('mentions').insert(processedItems);
        if (error) console.error("Insert error:", error);
        totalProcessed += processedItems.length;
      }
    }

    res.status(200).json({ status: 'success', processed: totalProcessed });
  } catch (error: any) {
    console.error('Scrape error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
}
