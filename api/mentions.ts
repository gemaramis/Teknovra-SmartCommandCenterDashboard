import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  // Allow filtering by target entity if provided in query params
  const { entity } = req.query;

  let query = supabase
    .from('mentions')
    .select('*')
    .order('pubDate', { ascending: false })
    .limit(500);

  if (entity && entity !== 'All Projects') {
    // We search the title or entities array for the keyword
    query = query.ilike('title', `%${entity}%`);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }

  res.status(200).json({
    status: 'success',
    count: data.length,
    data: data
  });
}
