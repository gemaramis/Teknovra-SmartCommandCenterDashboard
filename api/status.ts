import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  // Check the latest inserted record in Supabase to determine last run
  const { data, error } = await supabase
    .from('mentions')
    .select('pubDate')
    .order('pubDate', { ascending: false })
    .limit(1);

  const lastRun = data && data.length > 0 ? data[0].pubDate : null;

  res.status(200).json({
    isScraping: false,
    lastRun: lastRun,
    recordsProcessed: 0
  });
}
