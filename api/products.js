import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { id, featured, category, search, min_price, max_price, min_rating, sort, limit } = req.query;
      if (id) {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      let q = supabase.from('products').select('*');
      if (featured === 'true') q = q.eq('featured', true);
      if (category && category !== 'All') q = q.eq('category', category);
      if (search) q = q.ilike('name', `%${search}%`);
      if (min_price !== undefined && min_price !== '') q = q.gte('price', Number(min_price));
      if (max_price !== undefined && max_price !== '') q = q.lte('price', Number(max_price));
      if (min_rating) q = q.gte('rating', Number(min_rating));
      if (sort === 'price_asc') q = q.order('price', { ascending: true });
      else if (sort === 'price_desc') q = q.order('price', { ascending: false });
      else if (sort === 'rating') q = q.order('rating', { ascending: false });
      else if (sort === 'newest') q = q.order('created_at', { ascending: false });
      else q = q.order('id', { ascending: true });
      if (limit) q = q.limit(Number(limit));
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { data, error } = await supabase.from('products').insert(req.body).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...fields } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { data, error } = await supabase.from('products').update(fields).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
