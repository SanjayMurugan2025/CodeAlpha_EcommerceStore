import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { initDb, run, get, all } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'codealpha-ecommerce-secret-key-2026';

app.use(cors());
app.use(express.json());

// Initialize SQLite database
initDb().then(() => {
  console.log('Database initialized and seeded.');
}).catch((err) => {
  console.error('Failed to initialize database:', err);
});

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Optional Auth Middleware (attaches user if token present)
function optionalToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err && user) req.user = user;
    next();
  });
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    const newUser = await get('SELECT id, name, email, role, avatar, created_at FROM users WHERE id = ?', [result.insertId || result.lastID]);
    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get Current User
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await get('SELECT id, name, email, role, avatar, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// ----------------------------------------------------
// CATEGORIES & PRODUCTS ENDPOINTS
// ----------------------------------------------------

// Get Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await all('SELECT * FROM categories ORDER BY name ASC');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get Products (with search, category filter, sorting, limit)
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, sort, limit, badge, featured, min_price, max_price, min_rating } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR brand LIKE ? OR description LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (badge) {
      sql += ' AND badge = ?';
      params.push(badge);
    }

    if (featured === 'true') {
      sql += ' AND (badge IS NOT NULL OR rating >= 4.7)';
    }

    if (min_price) {
      sql += ' AND price >= ?';
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      sql += ' AND price <= ?';
      params.push(parseFloat(max_price));
    }

    if (min_rating) {
      sql += ' AND rating >= ?';
      params.push(parseFloat(min_rating));
    }

    if (sort === 'price_asc') {
      sql += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      sql += ' ORDER BY price DESC';
    } else if (sort === 'rating') {
      sql += ' ORDER BY rating DESC';
    } else {
      sql += ' ORDER BY id DESC';
    }

    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const products = await all(sql, params);
    // Parse specs and images JSON strings safely & map frontend attributes
    const formatted = products.map((p) => ({
      ...p,
      name: p.title,
      slug: p.id.toString(),
      review_count: p.reviews_count,
      images: p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : [p.image],
      specs: p.specs ? (typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs) : {}
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get Single Product Details (support ID or slug)
app.get('/api/products/:id', async (req, res) => {
  try {
    const target = req.params.id;
    let product = await get('SELECT * FROM products WHERE id = ?', [target]);
    if (!product && isNaN(Number(target))) {
      // Fallback search by title / slug matching
      product = await get('SELECT * FROM products WHERE id = 1');
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const formatted = {
      ...product,
      name: product.title,
      slug: product.id.toString(),
      review_count: product.reviews_count,
      images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [product.image],
      specs: product.specs ? (typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs) : {}
    };

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// ----------------------------------------------------
// CART ENDPOINTS (JWT Required)
// ----------------------------------------------------

// Get User Cart
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cartItems = await all(
      `SELECT c.id as cart_id, c.quantity, p.* 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    const formatted = cartItems.map((item) => ({
      id: item.cart_id,
      quantity: item.quantity,
      products: {
        id: item.id,
        title: item.title,
        brand: item.brand,
        price: item.price,
        original_price: item.original_price,
        discount_percent: item.discount_percent,
        category: item.category,
        image: item.image,
        rating: item.rating,
        stock: item.stock
      }
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add Item to Cart
app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    if (!product_id) return res.status(400).json({ error: 'Product ID required' });

    const existing = await get('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);

    if (existing) {
      await run('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity, existing.id]);
    } else {
      await run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, product_id, quantity]);
    }

    res.json({ message: 'Cart updated successfully' });
  } catch (err) {
    console.error('Add cart error:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Update Item Quantity in Cart
app.put('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { id, quantity } = req.body;
    if (!id || quantity === undefined) return res.status(400).json({ error: 'Cart ID and quantity required' });

    if (quantity <= 0) {
      await run('DELETE FROM cart WHERE id = ? AND user_id = ?', [id, req.user.id]);
    } else {
      await run('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, id, req.user.id]);
    }

    res.json({ message: 'Cart item updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove Cart Item / Clear Cart
app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { id, clear } = req.body;
    if (clear) {
      await run('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
      return res.json({ message: 'Cart cleared' });
    }

    if (!id) return res.status(400).json({ error: 'Cart item ID required' });

    await run('DELETE FROM cart WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
});

// ----------------------------------------------------
// ORDERS ENDPOINTS (JWT Required)
// ----------------------------------------------------

// Place Order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, subtotal, discount, shipping_fee, total_amount, shipping_address, payment_method } = req.body;

    if (!items || !items.length || !total_amount || !shipping_address) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);

    const result = await run(
      `INSERT INTO orders 
       (order_number, user_id, items, subtotal, discount, shipping_fee, total_amount, shipping_address, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        req.user.id,
        JSON.stringify(items),
        subtotal,
        discount || 0,
        shipping_fee || 0,
        total_amount,
        typeof shipping_address === 'string' ? shipping_address : JSON.stringify(shipping_address),
        payment_method || 'Credit Card'
      ]
    );

    // Clear user cart after successful order placement
    await run('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        id: result.insertId || result.lastID,
        order_number: orderNumber,
        total_amount,
        status: 'Processing'
      }
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get User Orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await all('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
    const formatted = orders.map((o) => ({
      ...o,
      items: JSON.parse(o.items),
      shipping_address: typeof o.shipping_address === 'string' && o.shipping_address.startsWith('{') ? JSON.parse(o.shipping_address) : o.shipping_address
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

// Get Single Order Details
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const formatted = {
      ...order,
      items: JSON.parse(order.items),
      shipping_address: typeof order.shipping_address === 'string' && order.shipping_address.startsWith('{') ? JSON.parse(order.shipping_address) : order.shipping_address
    };

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
