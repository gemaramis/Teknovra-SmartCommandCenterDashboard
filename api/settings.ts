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

    // Snapshot the previous targets so data for removed entities can be purged
    const { data: oldSettings } = await supabase
      .from('settings')
      .select('target_entities')
      .eq('id', 1)
      .single();

    const oldEntities: string[] = oldSettings?.target_entities || [];
    const newEntities: string[] = target_entities || [];
    const removedEntities = oldEntities.filter(e => !newEntities.includes(e));

    const { data, error } = await supabase
      .from('settings')
      .upsert({
        id: 1,
        target_entities: newEntities,
        crawl_frequency: crawl_frequency || "Every 15 Minutes (Balanced)"
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Purge mentions that belong to entities no longer being tracked,
    // so stale data stops mixing into the dashboards
    for (const removed of removedEntities) {
      const { error: tagError } = await supabase
        .from('mentions')
        .delete()
        .eq('target_entity', removed);

      // Legacy rows scraped before target_entity existed: match by title
      if (!tagError) {
        await supabase
          .from('mentions')
          .delete()
          .is('target_entity', null)
          .ilike('title', `%${removed}%`);
      } else {
        await supabase
          .from('mentions')
          .delete()
          .ilike('title', `%${removed}%`);
      }
    }

    return res.status(200).json({ ...data, purged_entities: removedEntities });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
