const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const router = express.Router();

// Temporary seeding route (remove after use)
router.get('/initialize-production', async (req, res) => {
  try {
    // Check if already seeded
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.json({ message: 'Database already contains data', userCount: existingUsers });
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });
    await adminUser.save();

    // Create sample users
    const users = [
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        isActive: false,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'moderator',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
      }
    ];

    await User.insertMany(users);

    // Create sample products
    const products = [
      {
        name: 'iPhone 15 Pro',
        description: 'Latest Apple smartphone with advanced features',
        price: 999,
        category: 'Electronics',
        brand: 'Apple',
        stock: 45,
        sku: 'APL-IP15P-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400']
      },
      {
        name: 'MacBook Air M2',
        description: 'Powerful laptop with M2 chip',
        price: 1299,
        category: 'Electronics',
        brand: 'Apple',
        stock: 23,
        sku: 'APL-MBA-M2-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400']
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Premium Android smartphone',
        price: 799,
        category: 'Electronics',
        brand: 'Samsung',
        stock: 67,
        sku: 'SAM-GS24-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400']
      },
      {
        name: 'Dell XPS 13',
        description: 'Ultra-portable Windows laptop',
        price: 1099,
        category: 'Electronics',
        brand: 'Dell',
        stock: 34,
        sku: 'DEL-XPS13-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400']
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-canceling headphones',
        price: 399,
        category: 'Electronics',
        brand: 'Sony',
        stock: 89,
        sku: 'SNY-WH1000XM5-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400']
      },
      {
        name: 'iPad Pro 12.9"',
        description: 'Professional tablet with M2 chip',
        price: 1099,
        category: 'Electronics',
        brand: 'Apple',
        stock: 56,
        sku: 'APL-IPADPRO-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400']
      },
      {
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes',
        price: 150,
        category: 'Fashion',
        brand: 'Nike',
        stock: 120,
        sku: 'NKE-AM270-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400']
      },
      {
        name: 'Levi\'s 501 Jeans',
        description: 'Classic straight-fit jeans',
        price: 89,
        category: 'Fashion',
        brand: 'Levi\'s',
        stock: 78,
        sku: 'LEV-501-001',
        isActive: false,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400']
      }
    ];

    await Product.insertMany(products);

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.json({
      message: 'Production database initialized successfully!',
      data: {
        users: totalUsers,
        products: totalProducts,
        adminCredentials: {
          email: 'admin@example.com',
          password: 'admin123'
        }
      }
    });

  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ 
      message: 'Error initializing database', 
      error: error.message 
    });
  }
});

router.post('/initialize-production', async (req, res) => {
  try {
    // Check if already seeded
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.json({ message: 'Database already contains data', userCount: existingUsers });
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });
    await adminUser.save();

    // Create sample users
    const users = [
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        isActive: false,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'moderator',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
      }
    ];

    await User.insertMany(users);

    // Create sample products
    const products = [
      {
        name: 'iPhone 15 Pro',
        description: 'Latest Apple smartphone with advanced features',
        price: 999,
        category: 'Electronics',
        brand: 'Apple',
        stock: 45,
        sku: 'APL-IP15P-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400']
      },
      {
        name: 'MacBook Air M2',
        description: 'Powerful laptop with M2 chip',
        price: 1299,
        category: 'Electronics',
        brand: 'Apple',
        stock: 23,
        sku: 'APL-MBA-M2-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400']
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Premium Android smartphone',
        price: 799,
        category: 'Electronics',
        brand: 'Samsung',
        stock: 67,
        sku: 'SAM-GS24-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400']
      },
      {
        name: 'Dell XPS 13',
        description: 'Ultra-portable Windows laptop',
        price: 1099,
        category: 'Electronics',
        brand: 'Dell',
        stock: 34,
        sku: 'DEL-XPS13-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400']
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-canceling headphones',
        price: 399,
        category: 'Electronics',
        brand: 'Sony',
        stock: 89,
        sku: 'SNY-WH1000XM5-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400']
      },
      {
        name: 'iPad Pro 12.9"',
        description: 'Professional tablet with M2 chip',
        price: 1099,
        category: 'Electronics',
        brand: 'Apple',
        stock: 56,
        sku: 'APL-IPADPRO-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400']
      },
      {
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes',
        price: 150,
        category: 'Fashion',
        brand: 'Nike',
        stock: 120,
        sku: 'NKE-AM270-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400']
      },
      {
        name: 'Levi\'s 501 Jeans',
        description: 'Classic straight-fit jeans',
        price: 89,
        category: 'Fashion',
        brand: 'Levi\'s',
        stock: 78,
        sku: 'LEV-501-001',
        isActive: false,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400']
      }
    ];

    await Product.insertMany(products);

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.json({
      message: 'Production database initialized successfully!',
      data: {
        users: totalUsers,
        products: totalProducts,
        adminCredentials: {
          email: 'admin@example.com',
          password: 'admin123'
        }
      }
    });

  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ 
      message: 'Error initializing database', 
      error: error.message 
    });
  }
});

// Debug route to check users
router.get('/check-users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email role isActive').lean();
    const userCount = await User.countDocuments();
    
    res.json({
      message: 'Users in database',
      count: userCount,
      users: users
    });
  } catch (error) {
    console.error('Check users error:', error);
    res.status(500).json({ 
      message: 'Error checking users', 
      error: error.message 
    });
  }
});

// Debug route to test admin login
router.get('/test-admin-login', async (req, res) => {
  try {
    const email = 'admin@example.com';
    const password = 'admin123';
    
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.json({ 
        success: false, 
        message: 'User not found',
        searchedEmail: email 
      });
    }
    
    // Test password
    const isMatch = await user.comparePassword(password);
    
    res.json({
      success: true,
      message: 'Admin user test',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      },
      passwordMatch: isMatch,
      testPassword: password
    });
  } catch (error) {
    console.error('Test admin login error:', error);
    res.status(500).json({ 
      message: 'Error testing admin login', 
      error: error.message 
    });
  }
});

// Fix admin password route
router.get('/fix-admin-password', async (req, res) => {
  try {
    // Delete the incorrectly hashed admin user
    await User.deleteOne({ email: 'admin@example.com' });
    
    // Create new admin user with correct password (let User model handle hashing)
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // Plain text - User model will hash it
      role: 'admin',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });
    await adminUser.save();
    
    // Test the new password
    const testUser = await User.findByEmail('admin@example.com');
    const passwordWorks = await testUser.comparePassword('admin123');
    
    res.json({
      message: 'Admin password fixed successfully!',
      passwordTest: passwordWorks,
      credentials: {
        email: 'admin@example.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Fix admin password error:', error);
    res.status(500).json({ 
      message: 'Error fixing admin password', 
      error: error.message 
    });
  }
});

// Add more sample data
router.get('/add-more-data', async (req, res) => {
  try {
    // Delete existing sample data (keep admin)
    await User.deleteMany({ email: { $ne: 'admin@example.com' } });
    await Product.deleteMany({});
    
    // Get admin user for createdBy field
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      return res.status(400).json({ message: 'Admin user not found. Run /fix-admin-password first.' });
    }
    
    // Create more users
    const users = [
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'user',
        isActive: false,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'user',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
      },
      {
        name: 'David Brown',
        email: 'david@example.com',
        password: 'password123',
        role: 'user',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }
    
    // Create more products with proper validation
    const products = [
      {
        name: 'iPhone 15 Pro',
        description: 'Latest Apple smartphone with advanced features',
        price: 999,
        category: 'Electronics',
        brand: 'Apple',
        stock: 45,
        sku: 'APL-IP15P-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&fmt=jpg'],
        tags: ['smartphone', 'apple', 'iphone'],
        ratings: { average: 4.8, count: 120 },
        sales: { totalSold: 85, revenue: 84915 },
        createdBy: adminUser._id
      },
      {
        name: 'MacBook Air M2',
        description: 'Powerful laptop with M2 chip',
        price: 1299,
        category: 'Electronics',
        brand: 'Apple',
        stock: 23,
        sku: 'APL-MBA-M2-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&fmt=jpg'],
        tags: ['laptop', 'apple', 'macbook'],
        ratings: { average: 4.9, count: 87 },
        sales: { totalSold: 43, revenue: 55857 },
        createdBy: adminUser._id
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Premium Android smartphone',
        price: 799,
        category: 'Electronics',
        brand: 'Samsung',
        stock: 67,
        sku: 'SAM-GS24-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&fmt=jpg'],
        tags: ['smartphone', 'samsung', 'android'],
        ratings: { average: 4.6, count: 95 },
        sales: { totalSold: 62, revenue: 49538 },
        createdBy: adminUser._id
      },
      {
        name: 'Dell XPS 13',
        description: 'Ultra-portable Windows laptop',
        price: 1099,
        category: 'Electronics',
        brand: 'Dell',
        stock: 34,
        sku: 'DEL-XPS13-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&fmt=jpg'],
        tags: ['laptop', 'dell', 'windows'],
        ratings: { average: 4.4, count: 67 },
        sales: { totalSold: 28, revenue: 30772 },
        createdBy: adminUser._id
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-canceling headphones',
        price: 399,
        category: 'Electronics',
        brand: 'Sony',
        stock: 89,
        sku: 'SNY-WH1000XM5-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&fmt=jpg'],
        tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
        ratings: { average: 4.7, count: 88 },
        sales: { totalSold: 67, revenue: 26733 },
        createdBy: adminUser._id
      },
      {
        name: 'iPad Pro 12.9"',
        description: 'Professional tablet with M2 chip',
        price: 1099,
        category: 'Electronics',
        brand: 'Apple',
        stock: 56,
        sku: 'APL-IPADPRO-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&fmt=jpg'],
        tags: ['tablet', 'apple', 'ipad'],
        ratings: { average: 4.6, count: 76 },
        sales: { totalSold: 54, revenue: 59346 },
        createdBy: adminUser._id
      },
      {
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes',
        price: 150,
        category: 'Clothing',
        brand: 'Nike',
        stock: 120,
        sku: 'NKE-AM270-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&fmt=jpg'],
        tags: ['shoes', 'nike', 'running'],
        ratings: { average: 4.4, count: 210 },
        sales: { totalSold: 156, revenue: 23400 },
        createdBy: adminUser._id
      },
      {
        name: 'Adidas Ultraboost 22',
        description: 'High-performance running shoes',
        price: 180,
        category: 'Clothing',
        brand: 'Adidas',
        stock: 95,
        sku: 'ADS-UB22-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&fmt=jpg'],
        tags: ['shoes', 'adidas', 'running', 'boost'],
        ratings: { average: 4.5, count: 180 },
        sales: { totalSold: 134, revenue: 24120 },
        createdBy: adminUser._id
      },
      {
        name: 'PlayStation 5',
        description: 'Next-gen gaming console',
        price: 499,
        category: 'Electronics',
        brand: 'Sony',
        stock: 15,
        sku: 'SNY-PS5-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&fmt=jpg'],
        tags: ['gaming', 'sony', 'console'],
        ratings: { average: 4.8, count: 245 },
        sales: { totalSold: 78, revenue: 38922 },
        createdBy: adminUser._id
      },
      {
        name: 'Nintendo Switch OLED',
        description: 'Portable gaming console with OLED screen',
        price: 349,
        category: 'Electronics',
        brand: 'Nintendo',
        stock: 42,
        sku: 'NIN-SWOLED-001',
        isActive: true,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&fmt=jpg'],
        tags: ['gaming', 'nintendo', 'portable'],
        ratings: { average: 4.6, count: 167 },
        sales: { totalSold: 89, revenue: 31061 },
        createdBy: adminUser._id
      }
    ];

    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
    }

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.json({
      message: 'More sample data added successfully!',
      data: {
        users: totalUsers,
        products: totalProducts
      }
    });
  } catch (error) {
    console.error('Add more data error:', error);
    res.status(500).json({ 
      message: 'Error adding more data', 
      error: error.message 
    });
  }
});

module.exports = router; 