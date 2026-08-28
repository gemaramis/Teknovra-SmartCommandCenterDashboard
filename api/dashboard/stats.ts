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
  const { entity } = req.query;

  const { data, error } = await supabase.from('mentions').select('*');
  if (error) return res.status(500).json({ error: error.message });

  let mentions = data || [];

  if (entity && entity !== 'All Projects') {
    mentions = mentions.filter(m => matchesEntity(m, entity));
  } else {
    // "All Projects" only aggregates data for the currently configured targets
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

  // 1. Calculate KPI (Total Mentions, Reach, Interactions)
  const totalMentions = mentions.length;
  const positive = mentions.filter(m => m.sentiment === 'POSITIVE').length;
  const negative = mentions.filter(m => m.sentiment === 'NEGATIVE').length;
  const neutral = mentions.filter(m => m.sentiment === 'NEUTRAL').length;

  // 2. Extract Top Entities/Issues
  const entityCounts: Record<string, number> = {};
  mentions.forEach(m => {
    if (m.entities && Array.isArray(m.entities)) {
      m.entities.forEach((e: string) => {
        entityCounts[e] = (entityCounts[e] || 0) + 1;
      });
    }
  });

  const topIssues = Object.entries(entityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // 3. Source Breakdown
  const sourceCounts: Record<string, number> = {};
  mentions.forEach(m => {
    const s = m.source || 'News';
    sourceCounts[s] = (sourceCounts[s] || 0) + 1;
  });

  const sources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      val: `${Math.round((count / totalMentions) * 100) || 0}%`
    }));

  res.status(200).json({
    kpis: {
      totalMentions,
      positive,
      negative,
      neutral
    },
    topIssues,
    sources
  });
}
