import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { user_id } = req.query;
      if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
      const { data, error } = await supabase.from('cart_items').select('id, quantity, product_id, products(*)').eq('user_id', user_id).order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { user_id, product_id, quantity } = req.body;
      if (!user_id || !product_id) return res.status(400).json({ error: 'Missing user_id or product_id' });
      const qty = Math.max(1, Number(quantity) || 1);
      const { data: existing } = await supabase.from('cart_items').select('id, quantity').eq('user_id', user_id).eq('product_id', product_id).maybeSingle();
      if (existing) {
        const { data, error } = await supabase.from('cart_items').update({ quantity: existing.quantity + qty }).eq('id', existing.id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      const { data, error } = await supabase.from('cart_items').insert({ user_id, product_id, quantity: qty }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, quantity } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const qty = Number(quantity);
      if (!qty || qty <= 0) {
        const { error } = await supabase.from('cart_items').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ ok: true, removed: true });
      }
      const { data, error } = await supabase.from('cart_items').update({ quantity: qty }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id, user_id, clear } = req.body || {};
      if (clear && user_id) {
        const { error } = await supabase.from('cart_items').delete().eq('user_id', user_id);
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { error } = await supabase.from('cart_items').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
