import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  // Query Supabase for the latest 100 mentions
  const { data, error } = await supabase
    .from('mentions')
    .select('*')
    .order('pubDate', { ascending: false })
    .limit(100);

  if (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }

  res.status(200).json({
    status: 'success',
    count: data.length,
    data: data
  });
}
