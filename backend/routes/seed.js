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

module.exports = router; 