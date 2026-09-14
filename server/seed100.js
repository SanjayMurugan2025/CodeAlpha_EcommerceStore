import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'ecommerce.db');

const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// 5 Multi-Angle Photos Sets for each Category (Front, Back, Side, Detail, Lifestyle)
const multiAngleGalleries = {
  mobiles: [
    [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80', // Front Screen
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80', // Back Camera Chassis
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80', // Side Profile
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80', // Camera Close-up
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80'  // Hand Lifestyle
    ],
    [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'
    ]
  ],
  laptops: [
    [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', // Open Display
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', // Top Metal Shell
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80', // Side Slim Edge
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80', // Keyboard Close-up
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80'  // Desk Setup
    ],
    [
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80'
    ]
  ],
  electronics: [
    [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', // Studio Main
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80', // Side Profile
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', // Controls Detail
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80', // Folded Layout
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'  // Wear Lifestyle
    ]
  ],
  fashion: [
    [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', // Front Model
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80', // Back Angle
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', // Fabric Detail
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80', // Flat Lay
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80'  // Outdoor Lifestyle
    ]
  ],
  footwear: [
    [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', // Side Profile
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', // Top Aerial
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80', // Heel Back
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', // Sole Tread
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80'  // Street On-feet
    ]
  ],
  home: [
    [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80', // Front Appliance
      'https://images.unsplash.com/photo-1517668808822-9a04227918a2?w=800&auto=format&fit=crop&q=80', // 3/4 Side Angle
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80', // Control Panel Detail
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80', // Interior View
      'https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?w=800&auto=format&fit=crop&q=80'  // Countertop Lifestyle
    ]
  ],
  gaming: [
    [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80', // Console Main Front
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&auto=format&fit=crop&q=80', // Controller Grip
      'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&auto=format&fit=crop&q=80', // Side Ports & Vents
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80', // Button D-Pad Detail
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'  // Gaming Desk RGB
    ]
  ]
};

const brands = {
  mobiles: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola', 'Realme'],
  laptops: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Razer'],
  electronics: ['Sony', 'Bose', 'Sennheiser', 'JBL', 'Anker', 'Garmin', 'Fossil', 'Canon', 'LG'],
  fashion: ['Nike', 'Adidas', "Levi's", 'Tommy Hilfiger', 'Puma', 'Zara', 'Ray-Ban', 'Calvin Klein'],
  footwear: ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Converse', 'Vans', 'Asics'],
  home: ['Dyson', 'DeLonghi', 'Philips', 'Instant Pot', 'Ninja', 'KitchenAid', 'iRobot', 'Shark'],
  gaming: ['Sony', 'Microsoft', 'Nintendo', 'Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX']
};

const badgesList = ['Bestseller', 'Top Rated', 'Hot Deal', 'Amazon Choice', 'Trending', 'Limited Stock', null, null];

async function seed100ProductsWith5Angles() {
  console.log('Re-seeding database with 105 products and 5 category-accurate multi-angle photos for every product...');
  await run('DELETE FROM products;');
  await run('DELETE FROM sqlite_sequence WHERE name="products";');

  const categoriesConfig = [
    { name: 'Mobiles & Tablets', key: 'mobiles', count: 20 },
    { name: 'Laptops & Computers', key: 'laptops', count: 20 },
    { name: 'Electronics', key: 'electronics', count: 20 },
    { name: 'Fashion & Clothing', key: 'fashion', count: 15 },
    { name: 'Footwear & Shoes', key: 'footwear', count: 10 },
    { name: 'Home & Kitchen', key: 'home', count: 10 },
    { name: 'Gaming & Consoles', key: 'gaming', count: 10 }
  ];

  let idCounter = 1;

  for (const cfg of categoriesConfig) {
    const brandArr = brands[cfg.key];
    const galleryOptions = multiAngleGalleries[cfg.key];

    for (let i = 1; i <= cfg.count; i++) {
      const brand = brandArr[i % brandArr.length];
      const selectedGallery = galleryOptions[(i - 1) % galleryOptions.length];
      const badge = badgesList[i % badgesList.length];
      
      let title = '';
      let basePrice = 100;
      let specsObj = {};

      if (cfg.key === 'mobiles') {
        basePrice = Math.floor(299 + Math.random() * 900);
        title = `${brand} Galaxy Ultra / Pro Phone Series ${i} (${128 * (1 + (i % 3))}GB, 5G)`;
        specsObj = {
          'Display': `${(6.1 + (i % 8) * 0.1).toFixed(1)}-inch AMOLED 120Hz`,
          'Processor': `${brand} Flagship Octa-core Chipset`,
          'Camera': `${48 + (i % 4) * 50}MP Triple Camera System`,
          'Battery': `${4000 + i * 100} mAh Fast Charge`,
          'RAM/Storage': `${8 + (i % 2) * 4}GB RAM / ${128 * (1 + (i % 3))}GB`
        };
      } else if (cfg.key === 'laptops') {
        basePrice = Math.floor(699 + Math.random() * 1200);
        title = `${brand} Pro Performance Edition ${i} Laptop (16GB RAM, SSD)`;
        specsObj = {
          'Display': `${(13.3 + (i % 4) * 1.0).toFixed(1)}-inch QHD Retina/IPS Display`,
          'Processor': `${brand} Gen ${10 + i} Multi-Core CPU`,
          'RAM': `${8 + (i % 3) * 8}GB DDR5`,
          'Storage': `${256 * (1 + (i % 4))}GB PCIe NVMe SSD`,
          'Graphics': `${brand} Dedicated High Performance GPU`
        };
      } else if (cfg.key === 'electronics') {
        basePrice = Math.floor(79 + Math.random() * 400);
        title = `${brand} Premium Wireless ANC Headphones / Smart Device ${i}`;
        specsObj = {
          'Connectivity': 'Bluetooth 5.3 & Low Latency Audio',
          'Battery Life': `${20 + i * 2} Hours Continuous Playback`,
          'Noise Cancellation': 'Active Noise Canceling (ANC) with AI',
          'Warranty': '1 Year Official Manufacturer Warranty'
        };
      } else if (cfg.key === 'fashion') {
        basePrice = Math.floor(29 + Math.random() * 120);
        title = `${brand} Premium Classic Fit Apparel Series ${i}`;
        specsObj = {
          'Material': '100% Premium Organic Cotton',
          'Fit': 'Regular / Modern Slim Fit',
          'Care': 'Machine Wash Warm',
          'Style': 'Casual & Everyday Wear'
        };
      } else if (cfg.key === 'footwear') {
        basePrice = Math.floor(69 + Math.random() * 150);
        title = `${brand} Air Cushion Performance Sneakers ${i}`;
        specsObj = {
          'Sole': 'Durable Non-slip Rubber Outsole',
          'Cushioning': 'Responsive Foam Cushioning',
          'Closure': 'Lace-up System',
          'Upper': 'Breathable Mesh & Leather'
        };
      } else if (cfg.key === 'home') {
        basePrice = Math.floor(99 + Math.random() * 500);
        title = `${brand} Smart Home Appliance Pro Model ${i}`;
        specsObj = {
          'Power': `${1000 + i * 100}W High Efficiency`,
          'Capacity': `${2.5 + (i % 5) * 1.0} Liters`,
          'Features': 'Touchscreen Control & Smart Timer',
          'Warranty': '2 Years Replacement Warranty'
        };
      } else {
        basePrice = Math.floor(199 + Math.random() * 600);
        title = `${brand} Next-Gen Gaming Hardware Console / Accessory ${i}`;
        specsObj = {
          'Platform': 'Cross-platform & High FPS Support',
          'Response Time': '1ms Ultra Fast Latency',
          'Lighting': 'Custom RGB Lighting Sync',
          'Connectivity': 'USB-C & Wireless Low-Latency'
        };
      }

      const discountPercent = Math.floor(5 + Math.random() * 25);
      const originalPrice = Math.round(basePrice * (1 + discountPercent / 100) * 100) / 100;
      const price = basePrice;
      const rating = Math.round((3.8 + Math.random() * 1.1) * 10) / 10;
      const reviewsCount = Math.floor(80 + Math.random() * 3000);
      const stock = Math.floor(15 + Math.random() * 85);

      await run(
        `INSERT INTO products 
         (title, brand, price, original_price, discount_percent, description, category, image, images, rating, reviews_count, stock, badge, specs)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          brand,
          price,
          originalPrice,
          discountPercent,
          `High performance ${title} engineered by ${brand}. Inspected from 5 distinct angles (Front, Back, Side, Close-up Detail, Lifestyle).`,
          cfg.name,
          selectedGallery[0], // Main cover photo
          JSON.stringify(selectedGallery), // 5 Multi-Angle Photos array
          rating,
          reviewsCount,
          stock,
          badge,
          JSON.stringify(specsObj)
        ]
      );
      idCounter++;
    }
  }

  const countRow = await get('SELECT COUNT(*) as count FROM products');
  console.log(`Successfully seeded ${countRow.count} products with 5 multi-angle photos per product into SQLite!`);
  db.close();
}

seed100ProductsWith5Angles().catch((err) => {
  console.error('Error seeding products:', err);
  db.close();
});
