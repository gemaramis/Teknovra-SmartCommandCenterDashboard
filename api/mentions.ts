import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// A mention belongs to an entity if it was tagged by the scraper;
// legacy rows (no target_entity) fall back to a title match
const matchesEntity = (m: any, entity: string) =>
  m.target_entity
    ? m.target_entity === entity
    : (m.title || '').toLowerCase().includes(entity.toLowerCase());

export default async function handler(req: any, res: any) {
  // Allow filtering by target entity if provided in query params
  const { entity } = req.query;

  const { data, error } = await supabase
    .from('mentions')
    .select('*')
    .order('pubDate', { ascending: false })
    .limit(500);

  if (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }

  let mentions = data || [];

  if (entity && entity !== 'All Projects') {
    mentions = mentions.filter(m => matchesEntity(m, entity));
  } else {
    // "All Projects" only shows data for the currently configured targets,
    // so stale data from removed entities never mixes in
    const { data: settingsData } = await supabase
      .from('settings')
      .select('target_entities')
      .eq('id', 1)
      .single();

    const targets: string[] = settingsData?.target_entities || [];
    if (targets.length > 0) {
      mentions = mentions.filter(m => targets.some(t => matchesEntity(m, t)));
    }
  }

  res.status(200).json({
    status: 'success',
    count: mentions.length,
    data: mentions
  });
}
