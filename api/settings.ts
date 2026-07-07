import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means zero rows
      return res.status(500).json({ error: error.message });
    }

    // Default settings if table is empty
    if (!data) {
      return res.status(200).json({
        id: 1,
        target_entities: ["Budiman Sudjatmiko"],
        crawl_frequency: "Every 15 Minutes (Balanced)"
      });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { target_entities, crawl_frequency } = req.body;
    
    const { data, error } = await supabase
      .from('settings')
      .upsert({ 
        id: 1, 
        target_entities: target_entities || [], 
        crawl_frequency: crawl_frequency || "Every 15 Minutes (Balanced)" 
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
