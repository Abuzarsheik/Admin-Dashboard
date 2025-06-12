const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
  },
  {
    name: 'Mike Wilson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isActive: false,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 1 week ago
  },
  {
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
  }
];

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest Apple smartphone with A17 Pro chip, titanium design, and advanced camera system.',
    price: 999.99,
    category: 'Electronics',
    brand: 'Apple',
    sku: 'IP15PRO001',
    stock: 25,
    images: [
      'https://via.placeholder.com/500x500/3B82F6/FFFFFF?text=iPhone+15+Pro',
      'https://via.placeholder.com/500x500/1E40AF/FFFFFF?text=Apple'
    ],
    tags: ['smartphone', 'apple', 'premium', 'camera'],
    discount: { percentage: 5, startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    ratings: { average: 4.8, count: 156 },
    sales: { totalSold: 89, revenue: 88990.11 }
  },
  {
    name: 'MacBook Air M3',
    description: 'Ultra-thin laptop with M3 chip, all-day battery life, and stunning Retina display.',
    price: 1299.99,
    category: 'Electronics',
    brand: 'Apple',
    sku: 'MBA15M3001',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop'
    ],
    tags: ['laptop', 'apple', 'portable', 'm3'],
    ratings: { average: 4.9, count: 203 },
    sales: { totalSold: 45, revenue: 58499.55 }
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max technology and modern design.',
    price: 150.00,
    category: 'Clothing',
    brand: 'Nike',
    sku: 'NAM270001',
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&h=500&fit=crop'
    ],
    tags: ['shoes', 'running', 'nike', 'comfortable'],
    ratings: { average: 4.6, count: 89 },
    sales: { totalSold: 127, revenue: 19050.00 }
  },
  {
    name: 'Samsung 55" 4K Smart TV',
    description: '55-inch 4K UHD Smart TV with HDR, built-in streaming apps, and voice control.',
    price: 799.99,
    category: 'Electronics',
    brand: 'Samsung',
    sku: 'SAM55TV001',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500&h=500&fit=crop'
    ],
    tags: ['tv', 'smart', '4k', 'samsung'],
    ratings: { average: 4.4, count: 67 },
    sales: { totalSold: 34, revenue: 27199.66 }
  },
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    price: 249.99,
    category: 'Electronics',
    brand: 'Sony',
    sku: 'SONYWH001',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop'
    ],
    tags: ['headphones', 'wireless', 'noise-cancelling', 'sony'],
    ratings: { average: 4.7, count: 145 },
    sales: { totalSold: 78, revenue: 19499.22 }
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'High-performance running shoes with responsive Boost midsole.',
    price: 180.00,
    category: 'Clothing',
    brand: 'Adidas',
    sku: 'ADIUB22001',
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop'
    ],
    tags: ['shoes', 'running', 'adidas', 'boost'],
    ratings: { average: 4.5, count: 92 },
    sales: { totalSold: 63, revenue: 11340.00 }
  },
  {
    name: 'Coffee Maker Deluxe',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe.',
    price: 129.99,
    category: 'Home & Garden',
    brand: 'Cuisinart',
    sku: 'CUICM001',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=500&fit=crop'
    ],
    tags: ['coffee', 'kitchen', 'appliance', 'programmable'],
    ratings: { average: 4.3, count: 76 },
    sales: { totalSold: 41, revenue: 5329.59 }
  },
  {
    name: 'Gaming Chair Pro',
    description: 'Ergonomic gaming chair with lumbar support, adjustable armrests, and RGB lighting.',
    price: 299.99,
    category: 'Home & Garden',
    brand: 'DXRacer',
    sku: 'DXRGCP001',
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&h=500&fit=crop'
    ],
    tags: ['gaming', 'chair', 'ergonomic', 'rgb'],
    ratings: { average: 4.6, count: 58 },
    sales: { totalSold: 28, revenue: 8399.72 }
  },
  {
    name: 'Fitness Tracker Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life.',
    price: 199.99,
    category: 'Electronics',
    brand: 'Fitbit',
    sku: 'FITW001',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'
    ],
    tags: ['fitness', 'tracker', 'health', 'gps'],
    ratings: { average: 4.4, count: 134 },
    sales: { totalSold: 95, revenue: 18999.05 }
  },
  {
    name: 'Professional Kitchen Knife Set',
    description: 'High-quality stainless steel knife set with wooden block and honing steel.',
    price: 89.99,
    category: 'Home & Garden',
    brand: 'Wusthof',
    sku: 'WUSKN001',
    stock: 0,
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=500&h=500&fit=crop'
    ],
    tags: ['kitchen', 'knives', 'cooking', 'professional'],
    ratings: { average: 4.8, count: 67 },
    sales: { totalSold: 52, revenue: 4679.48 }
  }
];

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-dashboard');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Hash passwords
const hashPasswords = async (users) => {
  const hashedUsers = [];
  for (const user of users) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    hashedUsers.push({
      ...user,
      password: hashedPassword
    });
  }
  return hashedUsers;
};

// Seed function
const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const hashedUsers = await hashPasswords(sampleUsers);
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Get admin user for product creation
    const adminUser = createdUsers.find(user => user.role === 'admin');

    // Create products with admin as creator
    console.log('📦 Creating products...');
    const productsWithCreator = sampleProducts.map(product => ({
      ...product,
      createdBy: adminUser._id,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)  // Random date within last 30 days
    }));

    const createdProducts = await Product.insertMany(productsWithCreator);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create some older users for growth trends
    console.log('📈 Creating historical user data...');
    const historicalUsers = [];
    const baseDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const monthsAgo = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
      const usersCount = Math.floor(Math.random() * 20) + 5; // 5-25 users per month
      
      for (let j = 0; j < usersCount; j++) {
        const randomDay = Math.floor(Math.random() * 28) + 1;
        const userDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, randomDay);
        
        historicalUsers.push({
          name: `User ${i}-${j}`,
          email: `user${i}${j}@example.com`,
          password: await bcrypt.hash('password123', 12),
          role: 'user',
          isActive: Math.random() > 0.1, // 90% active
          createdAt: userDate,
          updatedAt: userDate,
          lastLogin: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null
        });
      }
    }

    await User.insertMany(historicalUsers);
    console.log(`✅ Created ${historicalUsers.length} historical users`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  john@example.com / password123');
    console.log('\n📊 Sample Data Created:');
    console.log(`   👥 Users: ${createdUsers.length + historicalUsers.length}`);
    console.log(`   📦 Products: ${createdProducts.length}`);
    console.log(`   💰 Total Revenue: $${sampleProducts.reduce((sum, p) => sum + p.sales.revenue, 0).toLocaleString()}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedData();
};

if (require.main === module) {
  runSeed();
}

module.exports = { seedData, connectDB }; 