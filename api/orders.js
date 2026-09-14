import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { id, user_id, email } = req.query;
      if (id) {
        const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (!user_id && !email) return res.status(400).json({ error: 'Missing user_id or email' });
      const key = user_id || email;
      const mail = email || user_id;
      const { data, error } = await supabase.from('orders').select('*').or(`user_id.eq.${key},email.eq.${mail}`).order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { user_id, email, status, subtotal, shipping, discount, total, shipping_info, items } = req.body;
      if (!email || !items || total === undefined) return res.status(400).json({ error: 'Missing order fields' });
      const { data, error } = await supabase.from('orders').insert({ user_id: user_id || email, email, status: status || 'Pending', subtotal: subtotal || 0, shipping: shipping || 0, discount: discount || 0, total, shipping_info: shipping_info || {}, items }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, status } = req.body;
      if (!id || !status) return res.status(400).json({ error: 'Missing id or status' });
      const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
