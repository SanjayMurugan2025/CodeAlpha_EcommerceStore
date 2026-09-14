import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
  user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (process.env.MYSQL_PASSWORD || ''),
  database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'codealpha_ecommerce',
  port: Number(process.env.DB_PORT || process.env.MYSQL_PORT) || 3306
};

export const verifiedCategories = [
  {
    name: 'Mobiles & Tablets',
    slug: 'mobiles-tablets',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    description: 'Latest smartphones, flagship devices & tablets'
  },
  {
    name: 'Laptops & Computers',
    slug: 'laptops-computers',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    description: 'High-performance laptops, ultrabooks & workstation setups'
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: 'Noise-canceling headphones, smartwatches & professional cameras'
  },
  {
    name: 'Fashion & Clothing',
    slug: 'fashion-clothing',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    description: 'Trending apparel, original jeans, hoodies & fashion accessories'
  },
  {
    name: 'Footwear & Shoes',
    slug: 'footwear-shoes',
    icon: 'Footprints',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    description: 'Iconic sneakers, high-performance running shoes & athletic footwear'
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    description: 'Smart appliances, Italian espresso makers & essential kitchen gear'
  },
  {
    name: 'Gaming & Consoles',
    slug: 'gaming-consoles',
    icon: 'Gamepad2',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    description: 'Next-gen gaming consoles, wireless controllers & gaming gear'
  }
];

export const verifiedProducts = [
  // MOBILES & TABLETS
  {
    title: 'Apple iPhone 15 Pro Max (256GB - Natural Titanium)',
    brand: 'Apple',
    category: 'Mobiles & Tablets',
    price: 1199.00,
    original_price: 1299.00,
    discount_percent: 8,
    rating: 4.9,
    reviews_count: 2450,
    stock: 25,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    description: 'iPhone 15 Pro Max forged in natural titanium with A17 Pro chip and 5x Telephoto camera.',
    specs: { 'Display': '6.7" Super Retina XDR OLED 120Hz', 'Processor': 'A17 Pro Chip', 'Camera': '48MP Main + 12MP 5x Telephoto' }
  },
  {
    title: 'Samsung Galaxy S24 Ultra 5G (512GB - Titanium Gray)',
    brand: 'Samsung',
    category: 'Mobiles & Tablets',
    price: 1299.00,
    original_price: 1419.00,
    discount_percent: 8,
    rating: 4.8,
    reviews_count: 1890,
    stock: 30,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    description: 'Galaxy S24 Ultra with Galaxy AI, 200MP camera, Titanium frame, flat display, and built-in S Pen.',
    specs: { 'Display': '6.8" Dynamic AMOLED 2X 120Hz', 'Processor': 'Snapdragon 8 Gen 3 for Galaxy', 'S Pen': 'Built-in' }
  },
  {
    title: 'Google Pixel 8 Pro (128GB - Bay Blue)',
    brand: 'Google',
    category: 'Mobiles & Tablets',
    price: 899.00,
    original_price: 999.00,
    discount_percent: 10,
    rating: 4.7,
    reviews_count: 1120,
    stock: 18,
    badge: 'Amazon Choice',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    description: 'Google Pixel 8 Pro powered by Tensor G3 with Best Take and Audio Magic Eraser.',
    specs: { 'Display': '6.7" Super Actua Display 120Hz', 'Processor': 'Google Tensor G3' }
  },
  {
    title: 'OnePlus 12 5G (256GB - Silky Black)',
    brand: 'OnePlus',
    category: 'Mobiles & Tablets',
    price: 799.00,
    original_price: 899.00,
    discount_percent: 11,
    rating: 4.7,
    reviews_count: 840,
    stock: 40,
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
    description: 'OnePlus 12 with 4th Gen Hasselblad Camera System and 80W SUPERVOOC charging.',
    specs: { 'Display': '6.82" 2K 120Hz ProXDR', 'Battery': '5400mAh with 80W SUPERVOOC' }
  },
  {
    title: 'Apple iPad Air 11-inch (M2 Chip, 128GB Wi-Fi)',
    brand: 'Apple',
    category: 'Mobiles & Tablets',
    price: 599.00,
    original_price: 649.00,
    discount_percent: 7,
    rating: 4.9,
    reviews_count: 3100,
    stock: 22,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    description: 'Redesigned iPad Air powered by superfast M2 chip and Liquid Retina display.',
    specs: { 'Display': '11" Liquid Retina Display', 'Processor': 'Apple M2 Chip' }
  },
  {
    title: 'Samsung Galaxy Tab S9 Ultra (14.6-inch Dynamic AMOLED)',
    brand: 'Samsung',
    category: 'Mobiles & Tablets',
    price: 1199.00,
    original_price: 1319.00,
    discount_percent: 9,
    rating: 4.8,
    reviews_count: 670,
    stock: 14,
    badge: null,
    image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&auto=format&fit=crop&q=80',
    description: 'Massive 14.6" Dynamic AMOLED 2X screen with bundled S Pen and IP68 water resistance.',
    specs: { 'Display': '14.6" 120Hz Dynamic AMOLED 2X', 'Protection': 'IP68 Water Resistant' }
  },
  {
    title: 'Apple iPhone 14 (128GB - Blue)',
    brand: 'Apple',
    category: 'Mobiles & Tablets',
    price: 699.00,
    original_price: 799.00,
    discount_percent: 12,
    rating: 4.7,
    reviews_count: 5100,
    stock: 35,
    badge: null,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    description: 'iPhone 14 with A15 Bionic chip, dual-camera system, and Crash Detection.',
    specs: { 'Display': '6.1" Super Retina XDR', 'Processor': 'A15 Bionic Chip' }
  },
  {
    title: 'Xiaomi 13 Pro 5G (256GB - Ceramic Black)',
    brand: 'Xiaomi',
    category: 'Mobiles & Tablets',
    price: 749.00,
    original_price: 849.00,
    discount_percent: 11,
    rating: 4.6,
    reviews_count: 420,
    stock: 20,
    badge: null,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80',
    description: 'Xiaomi 13 Pro featuring 1-inch Leica Professional Optic Camera lens.',
    specs: { 'Camera': '50MP 1-inch Leica Camera', 'Processor': 'Snapdragon 8 Gen 2' }
  },

  // LAPTOPS & COMPUTERS
  {
    title: 'Apple MacBook Pro 16-inch (M3 Max, 36GB RAM, 1TB SSD)',
    brand: 'Apple',
    category: 'Laptops & Computers',
    price: 3499.00,
    original_price: 3799.00,
    discount_percent: 8,
    rating: 4.9,
    reviews_count: 1420,
    stock: 12,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    description: '16-inch Liquid Retina XDR display laptop featuring M3 Max chip in Space Black finish.',
    specs: { 'Display': '16.2" Liquid Retina XDR 120Hz', 'Processor': 'Apple M3 Max Chip' }
  },
  {
    title: 'Apple MacBook Air 13.6-inch (M2 Chip, 8GB RAM, 256GB SSD)',
    brand: 'Apple',
    category: 'Laptops & Computers',
    price: 999.00,
    original_price: 1099.00,
    discount_percent: 9,
    rating: 4.8,
    reviews_count: 4200,
    stock: 50,
    badge: 'Amazon Choice',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
    description: 'Thin Starlight aluminum laptop powered by M2 chip and 13.6-inch Liquid Retina screen.',
    specs: { 'Display': '13.6" Liquid Retina', 'Processor': 'Apple M2 Chip' }
  },
  {
    title: 'Dell XPS 15 9530 Laptop (Core i9, 32GB RAM, 1TB SSD, RTX 4060)',
    brand: 'Dell',
    category: 'Laptops & Computers',
    price: 2199.00,
    original_price: 2499.00,
    discount_percent: 12,
    rating: 4.7,
    reviews_count: 980,
    stock: 16,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    description: 'CNC aluminum laptop with 3.5K OLED Touch display and NVIDIA RTX 4060 graphics.',
    specs: { 'Display': '15.6" 3.5K OLED Touch', 'Graphics': 'NVIDIA RTX 4060 8GB' }
  },
  {
    title: 'ASUS ROG Strix G16 Gaming Laptop (RTX 4070, i7-13650HX, 165Hz)',
    brand: 'ASUS',
    category: 'Laptops & Computers',
    price: 1499.00,
    original_price: 1699.00,
    discount_percent: 11,
    rating: 4.8,
    reviews_count: 1150,
    stock: 20,
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
    description: 'High performance gaming laptop with ROG Intelligent Cooling and 16" 165Hz panel.',
    specs: { 'Display': '16" ROG Nebula FHD+ 165Hz', 'Graphics': 'NVIDIA RTX 4070 8GB' }
  },
  {
    title: 'Lenovo ThinkPad X1 Carbon Gen 11 (Core i7, 16GB, 512GB SSD)',
    brand: 'Lenovo',
    category: 'Laptops & Computers',
    price: 1649.00,
    original_price: 1849.00,
    discount_percent: 10,
    rating: 4.8,
    reviews_count: 730,
    stock: 18,
    badge: null,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    description: 'Ultralight carbon-fiber flagship laptop built to MIL-STD 810H standards.',
    specs: { 'Display': '14" WUXGA IPS Anti-glare', 'Keyboard': 'ThinkPad Backlit' }
  },
  {
    title: 'HP Spectre x360 2-in-1 Convertible Laptop (Core i7, 16GB, OLED)',
    brand: 'HP',
    category: 'Laptops & Computers',
    price: 1399.00,
    original_price: 1549.00,
    discount_percent: 9,
    rating: 4.7,
    reviews_count: 620,
    stock: 15,
    badge: null,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
    description: '360-degree flip OLED touch screen laptop with HP Rechargeable Tilt Pen.',
    specs: { 'Display': '13.5" 3K2K OLED Touch', 'Design': '2-in-1 Convertible' }
  },

  // ELECTRONICS & AUDIO
  {
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    brand: 'Sony',
    category: 'Electronics',
    price: 398.00,
    original_price: 449.00,
    discount_percent: 11,
    rating: 4.9,
    reviews_count: 5120,
    stock: 60,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: 'Industry leading noise cancellation with 8 microphones and 30-hour battery.',
    specs: { 'Battery': '30 Hours', 'Noise Canceling': 'Dual Processor Auto NC' }
  },
  {
    title: 'Apple AirPods Pro 2nd Generation (USB-C MagSafe Case)',
    brand: 'Apple',
    category: 'Electronics',
    price: 249.00,
    original_price: 279.00,
    discount_percent: 10,
    rating: 4.9,
    reviews_count: 8900,
    stock: 100,
    badge: 'Amazon Choice',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    description: 'H2 chip powers 2x more Active Noise Cancellation with Adaptive Audio.',
    specs: { 'Chip': 'Apple H2', 'Audio': 'Personalized Spatial Audio' }
  },
  {
    title: 'Bose QuietComfort Ultra Noise Cancelling Headphones',
    brand: 'Bose',
    category: 'Electronics',
    price: 429.00,
    original_price: 479.00,
    discount_percent: 10,
    rating: 4.8,
    reviews_count: 1430,
    stock: 35,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    description: 'Breakthrough spatialized audio headphones with world-class noise cancellation.',
    specs: { 'Battery': '24 Hours', 'Modes': 'Quiet, Aware, Immersion' }
  },
  {
    title: 'Apple Watch Series 9 GPS (45mm Midnight Aluminum)',
    brand: 'Apple',
    category: 'Electronics',
    price: 429.00,
    original_price: 459.00,
    discount_percent: 6,
    rating: 4.8,
    reviews_count: 3200,
    stock: 45,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    description: 'S9 SiP smartwatch enabling double-tap gesture and bright 2000 nits display.',
    specs: { 'Display': 'Always-On Retina 2000 nits', 'Sensors': 'ECG & Blood Oxygen' }
  },
  {
    title: 'Canon EOS R6 Mark II Full-Frame Mirrorless Camera',
    brand: 'Canon',
    category: 'Electronics',
    price: 2499.00,
    original_price: 2699.00,
    discount_percent: 7,
    rating: 4.9,
    reviews_count: 540,
    stock: 10,
    badge: null,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    description: '24.2 MP full-frame CMOS camera with Dual Pixel AF II and 4K 60p video.',
    specs: { 'Sensor': '24.2MP Full-Frame', 'Video': '4K 60p 10-bit' }
  },

  // FASHION & APPAREL
  {
    title: "Levi's Men's 501 Original Fit Straight Jeans",
    brand: "Levi's",
    category: 'Fashion & Clothing',
    price: 69.00,
    original_price: 89.00,
    discount_percent: 22,
    rating: 4.6,
    reviews_count: 12400,
    stock: 80,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    description: 'Classic 100% heavy cotton denim jeans with signature button fly.',
    specs: { 'Material': '100% Cotton', 'Fit': 'Original Straight Leg' }
  },
  {
    title: 'Nike Sportswear Club Fleece Pullover Hoodie',
    brand: 'Nike',
    category: 'Fashion & Clothing',
    price: 55.00,
    original_price: 70.00,
    discount_percent: 21,
    rating: 4.7,
    reviews_count: 6700,
    stock: 90,
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    description: 'Classic embroidered Swoosh fleece hoodie with kangaroo front pocket.',
    specs: { 'Fabric': '80% Cotton / 20% Polyester', 'Pockets': 'Kangaroo Pocket' }
  },
  {
    title: 'Ray-Ban Classic Aviator Sunglasses (Gold/Brown)',
    brand: 'Ray-Ban',
    category: 'Fashion & Clothing',
    price: 171.00,
    original_price: 195.00,
    discount_percent: 12,
    rating: 4.8,
    reviews_count: 4500,
    stock: 35,
    badge: 'Amazon Choice',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    description: 'Iconic gold steel frame aviator sunglasses with 100% UV glass lenses.',
    specs: { 'Frame': 'Polished Gold Steel', 'Lenses': 'G-15 Glass' }
  },

  // FOOTWEAR & SHOES
  {
    title: "Nike Air Force 1 '07 Low Triple White Sneakers",
    brand: 'Nike',
    category: 'Footwear & Shoes',
    price: 115.00,
    original_price: 130.00,
    discount_percent: 11,
    rating: 4.9,
    reviews_count: 15400,
    stock: 120,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    description: 'Stitched leather overlays with encapsulated Nike Air cushioning.',
    specs: { 'Upper': 'Real Leather', 'Sole': 'Pivot Circle Outsole' }
  },
  {
    title: 'Nike Air Max 270 Running Shoes (Black/Red)',
    brand: 'Nike',
    category: 'Footwear & Shoes',
    price: 160.00,
    original_price: 180.00,
    discount_percent: 11,
    rating: 4.8,
    reviews_count: 7800,
    stock: 65,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    description: '270-degree Max Air heel unit delivering super soft responsive bounce.',
    specs: { 'Air Unit': '270 Max Air Unit', 'Upper': 'Engineered Mesh' }
  },
  {
    title: 'Adidas Ultraboost Light Running Shoes',
    brand: 'Adidas',
    category: 'Footwear & Shoes',
    price: 190.00,
    original_price: 210.00,
    discount_percent: 9,
    rating: 4.8,
    reviews_count: 3400,
    stock: 45,
    badge: null,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    description: '30% lighter Light BOOST material with Continental Rubber outsole.',
    specs: { 'Cushioning': 'Light BOOST', 'Upper': 'Primeknit+' }
  },

  // HOME & KITCHEN
  {
    title: 'Dyson V15 Detect Cordless Vacuum Cleaner',
    brand: 'Dyson',
    category: 'Home & Kitchen',
    price: 749.00,
    original_price: 799.00,
    discount_percent: 6,
    rating: 4.9,
    reviews_count: 2890,
    stock: 15,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    description: 'Laser detects microscopic dust with auto-adapting suction power.',
    specs: { 'Run Time': '60 minutes', 'Motor': '230 AW Hyperdymium' }
  },
  {
    title: 'DeLonghi Dedica Deluxe Pump Espresso Machine',
    brand: 'DeLonghi',
    category: 'Home & Kitchen',
    price: 299.00,
    original_price: 349.00,
    discount_percent: 14,
    rating: 4.7,
    reviews_count: 3670,
    stock: 25,
    badge: 'Amazon Choice',
    image: 'https://images.unsplash.com/photo-1517668808822-9a04227918a2?w=800&auto=format&fit=crop&q=80',
    description: '15-bar professional pressure espresso maker with adjustable froth wand.',
    specs: { 'Pressure': '15-Bar Italian Pump', 'Width': 'Slim 6 inches' }
  },
  {
    title: 'KitchenAid Artisan Series 5-Quart Stand Mixer',
    brand: 'KitchenAid',
    category: 'Home & Kitchen',
    price: 449.00,
    original_price: 499.00,
    discount_percent: 10,
    rating: 4.9,
    reviews_count: 9400,
    stock: 20,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?w=800&auto=format&fit=crop&q=80',
    description: 'Durable die-cast metal tilt-head mixer with 10 speeds and 5-quart bowl.',
    specs: { 'Capacity': '5-Quart Stainless Steel', 'Speeds': '10 Speeds' }
  },

  // GAMING & CONSOLES
  {
    title: 'Sony PlayStation 5 Slim Console (1TB SSD)',
    brand: 'Sony',
    category: 'Gaming & Consoles',
    price: 499.00,
    original_price: 549.00,
    discount_percent: 9,
    rating: 4.9,
    reviews_count: 7890,
    stock: 35,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    description: 'Ultra-high speed 1TB SSD console with haptic feedback and 4K 120Hz output.',
    specs: { 'Storage': '1TB NVMe SSD', 'Resolution': '4K 120Hz' }
  },
  {
    title: 'Sony DualSense Wireless Controller (White)',
    brand: 'Sony',
    category: 'Gaming & Consoles',
    price: 69.00,
    original_price: 74.00,
    discount_percent: 6,
    rating: 4.8,
    reviews_count: 11200,
    stock: 85,
    badge: 'Amazon Choice',
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&auto=format&fit=crop&q=80',
    description: 'Immersive haptic feedback with dynamic adaptive triggers and USB-C.',
    specs: { 'Feedback': 'Haptic Feedback', 'Triggers': 'Adaptive Triggers' }
  },
  {
    title: 'Xbox Series X 1TB Gaming Console (Black)',
    brand: 'Microsoft',
    category: 'Gaming & Consoles',
    price: 499.00,
    original_price: 549.00,
    discount_percent: 9,
    rating: 4.8,
    reviews_count: 6540,
    stock: 28,
    badge: null,
    image: 'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&auto=format&fit=crop&q=80',
    description: '12 Teraflops GPU velocity architecture gaming console with 1TB SSD.',
    specs: { 'GPU': '12 Teraflops RDNA 2', 'Storage': '1TB NVMe SSD' }
  },
  {
    title: 'Nintendo Switch OLED Model (Neon Red/Blue)',
    brand: 'Nintendo',
    category: 'Gaming & Consoles',
    price: 349.00,
    original_price: 379.00,
    discount_percent: 8,
    rating: 4.9,
    reviews_count: 9800,
    stock: 40,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&auto=format&fit=crop&q=80',
    description: '7-inch OLED screen with wide adjustable stand and LAN port dock.',
    specs: { 'Display': '7" OLED Screen', 'Storage': '64GB Internal' }
  }
];

export async function seedMySQL() {
  try {
    console.log(`Connecting to MySQL database "${dbConfig.database}" at ${dbConfig.host}:${dbConfig.port}...`);
    const tempConn = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await tempConn.end();

    const conn = await mysql.createConnection(dbConfig);
    console.log('Re-creating categories & products tables in MySQL...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 0;');
    await conn.query('DROP TABLE IF EXISTS cart;');
    await conn.query('DROP TABLE IF EXISTS categories;');
    await conn.query('DROP TABLE IF EXISTS products;');

    await conn.query(`
      CREATE TABLE categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        icon VARCHAR(100),
        image VARCHAR(500),
        description TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    
    await conn.query(`
      CREATE TABLE products (
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

    await conn.query(`
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

    // Seed Categories
    for (const cat of verifiedCategories) {
      await conn.query(
        `INSERT INTO categories (name, slug, icon, image, description) VALUES (?, ?, ?, ?, ?)`,
        [cat.name, cat.slug, cat.icon, cat.image, cat.description]
      );
    }

    // Seed Products
    for (const item of verifiedProducts) {
      await conn.query(
        `INSERT INTO products 
         (title, brand, price, original_price, discount_percent, description, category, image, images, rating, reviews_count, stock, badge, specs)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.title,
          item.brand,
          item.price,
          item.original_price,
          item.discount_percent,
          item.description,
          item.category,
          item.image,
          JSON.stringify([item.image]),
          item.rating,
          item.reviews_count,
          item.stock,
          item.badge,
          JSON.stringify(item.specs)
        ]
      );
    }

    await conn.query('SET FOREIGN_KEY_CHECKS = 1;');

    const [catRows] = await conn.query('SELECT COUNT(*) as count FROM categories');
    const [prodRows] = await conn.query('SELECT COUNT(*) as count FROM products');
    console.log(`SUCCESSFULLY_SEEDED_${catRows[0].count}_CATEGORIES_AND_${prodRows[0].count}_PRODUCTS_INTO_MYSQL`);
    await conn.end();
  } catch (err) {
    console.error('MySQL Connection Error:', err.message);
  }
}

if (process.argv[1]?.endsWith('seedMySQL.js')) {
  seedMySQL();
}
