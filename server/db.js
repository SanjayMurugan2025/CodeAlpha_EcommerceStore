import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
  user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (process.env.MYSQL_PASSWORD || ''),
  database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'codealpha_ecommerce',
  port: Number(process.env.DB_PORT || process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;

export async function getPool() {
  if (!pool) {
    try {
      // Connect to MySQL server to ensure database exists
      const tempConn = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        port: dbConfig.port
      });

      await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
      await tempConn.end();

      pool = mysql.createPool(dbConfig);
      console.log(`Connected to MySQL database "${dbConfig.database}" at ${dbConfig.host}:${dbConfig.port}`);
    } catch (err) {
      console.error('MySQL Database Connection Error:', err.message);
      throw err;
    }
  }
  return pool;
}

// Helper for executing queries
export async function query(sql, params = []) {
  const p = await getPool();
  const [rows] = await p.execute(sql, params);
  return rows;
}

export async function run(sql, params = []) {
  const p = await getPool();
  const [result] = await p.execute(sql, params);
  return result;
}

export async function get(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

export async function all(sql, params = []) {
  return await query(sql, params);
}

export async function initDb() {
  const p = await getPool();

  // Users table
  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      avatar VARCHAR(500),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Categories table
  await p.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      icon VARCHAR(100),
      image VARCHAR(500)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Products table
  await p.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      brand VARCHAR(100),
      price DECIMAL(10,2) NOT NULL,
      original_price DECIMAL(10,2),
      discount_percent INT DEFAULT 0,
      description TEXT,
      category VARCHAR(100) NOT NULL,
      image VARCHAR(500) NOT NULL,
      images JSON,
      rating DECIMAL(3,1) DEFAULT 4.5,
      reviews_count INT DEFAULT 0,
      stock INT DEFAULT 50,
      badge VARCHAR(100),
      specs JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Cart table
  await p.query(`
    CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY user_prod_unique (user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Orders table
  await p.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_number VARCHAR(100) UNIQUE NOT NULL,
      user_id INT NOT NULL,
      items JSON NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      discount DECIMAL(10,2) DEFAULT 0,
      shipping_fee DECIMAL(10,2) DEFAULT 0,
      total_amount DECIMAL(10,2) NOT NULL,
      shipping_address TEXT NOT NULL,
      payment_method VARCHAR(100) NOT NULL,
      payment_status VARCHAR(50) DEFAULT 'Completed',
      order_status VARCHAR(50) DEFAULT 'Processing',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await seedDefaultUsers();
  await seedCategoriesAndProductsIfEmpty();
}

async function seedCategoriesAndProductsIfEmpty() {
  const catResult = await query('SELECT COUNT(*) as count FROM categories');
  const prodResult = await query('SELECT COUNT(*) as count FROM products');
  if (catResult[0].count === 0 || prodResult[0].count === 0) {
    console.log('Seeding initial categories and products into MySQL database...');
    const { seedMySQL } = await import('./seedMySQL.js');
    await seedMySQL();
  }
}

async function seedDefaultUsers() {
  const users = await query('SELECT COUNT(*) as count FROM users');
  if (users[0].count === 0) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Demo User', 'demo@codealpha.com', hashedPassword, 'user']
    );
    await run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@codealpha.com', hashedPassword, 'admin']
    );
  }
}

export default pool;
