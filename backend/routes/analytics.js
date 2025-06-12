const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);
router.use(adminAuth);

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard overview statistics
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    // Get current date and previous periods
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const newUsersPrevMonth = await User.countDocuments({
      createdAt: { $gte: startOfPrevMonth, $lte: endOfPrevMonth }
    });

    // Product statistics
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({
      stock: { $lte: 10 },
      isActive: true
    });

    // Revenue calculations (from product sales data)
    const revenueStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$sales.revenue' },
          totalSales: { $sum: '$sales.totalSold' }
        }
      }
    ]);

    const revenue = revenueStats[0] || { totalRevenue: 0, totalSales: 0 };

    // Calculate growth percentages
    const userGrowth = newUsersPrevMonth > 0 
      ? ((newUsersThisMonth - newUsersPrevMonth) / newUsersPrevMonth * 100).toFixed(1)
      : newUsersThisMonth > 0 ? 100 : 0;

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        newThisMonth: newUsersThisMonth,
        growth: parseFloat(userGrowth)
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: totalProducts - activeProducts,
        lowStock: lowStockProducts
      },
      sales: {
        totalRevenue: revenue.totalRevenue,
        totalSales: revenue.totalSales,
        averageOrderValue: revenue.totalSales > 0 
          ? (revenue.totalRevenue / revenue.totalSales).toFixed(2) 
          : 0
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      message: 'Server error fetching dashboard analytics'
    });
  }
});

// @route   GET /api/analytics/sales-trends
// @desc    Get sales trends for charts
// @access  Private (Admin)
router.get('/sales-trends', async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    
    let matchDate;
    let groupBy;
    
    switch (period) {
      case '7days':
        matchDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$updatedAt' },
          month: { $month: '$updatedAt' },
          day: { $dayOfMonth: '$updatedAt' }
        };
        break;
      case '30days':
        matchDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$updatedAt' },
          month: { $month: '$updatedAt' },
          day: { $dayOfMonth: '$updatedAt' }
        };
        break;
      case '12months':
        matchDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$updatedAt' },
          month: { $month: '$updatedAt' }
        };
        break;
      default: // 6months
        matchDate = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$updatedAt' },
          month: { $month: '$updatedAt' }
        };
    }

    const salesTrends = await Product.aggregate([
      {
        $match: {
          'sales.revenue': { $gt: 0 },
          updatedAt: { $gte: matchDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$sales.revenue' },
          totalSales: { $sum: '$sales.totalSold' },
          products: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Format the data for charts
    const formattedData = salesTrends.map(item => {
      let label;
      if (item._id.day) {
        label = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`;
      } else {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        label = `${monthNames[item._id.month - 1]} ${item._id.year}`;
      }
      
      return {
        period: label,
        revenue: item.revenue,
        sales: item.totalSales,
        products: item.products
      };
    });

    res.json({ trends: formattedData });
  } catch (error) {
    console.error('Sales trends error:', error);
    res.status(500).json({
      message: 'Server error fetching sales trends'
    });
  }
});

// @route   GET /api/analytics/user-growth
// @desc    Get user growth data for charts
// @access  Private (Admin)
router.get('/user-growth', async (req, res) => {
  try {
    const { period = '12months' } = req.query;
    
    let matchDate;
    if (period === '6months') {
      matchDate = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    } else {
      matchDate = new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000);
    }

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: matchDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          newUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format the data
    const formattedData = userGrowth.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const label = `${monthNames[item._id.month - 1]} ${item._id.year}`;
      
      return {
        period: label,
        newUsers: item.newUsers,
        activeUsers: item.activeUsers
      };
    });

    res.json({ growth: formattedData });
  } catch (error) {
    console.error('User growth error:', error);
    res.status(500).json({
      message: 'Server error fetching user growth data'
    });
  }
});

// @route   GET /api/analytics/category-distribution
// @desc    Get product category distribution
// @access  Private (Admin)
router.get('/category-distribution', async (req, res) => {
  try {
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$sales.revenue' },
          totalSales: { $sum: '$sales.totalSold' },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const total = categoryStats.reduce((sum, cat) => sum + cat.count, 0);
    
    const formattedData = categoryStats.map(cat => ({
      category: cat._id,
      count: cat.count,
      percentage: total > 0 ? ((cat.count / total) * 100).toFixed(1) : 0,
      revenue: cat.totalRevenue,
      sales: cat.totalSales,
      avgPrice: cat.avgPrice.toFixed(2)
    }));

    res.json({ distribution: formattedData });
  } catch (error) {
    console.error('Category distribution error:', error);
    res.status(500).json({
      message: 'Server error fetching category distribution'
    });
  }
});

// @route   GET /api/analytics/top-products
// @desc    Get top performing products
// @access  Private (Admin)
router.get('/top-products', async (req, res) => {
  try {
    const { limit = 10, sortBy = 'revenue' } = req.query;
    
    let sortField;
    switch (sortBy) {
      case 'sales':
        sortField = { 'sales.totalSold': -1 };
        break;
      case 'rating':
        sortField = { 'ratings.average': -1, 'ratings.count': -1 };
        break;
      default:
        sortField = { 'sales.revenue': -1 };
    }

    const topProducts = await Product.find({ 
      isActive: true,
      'sales.revenue': { $gt: 0 }
    })
    .populate('createdBy', 'name')
    .sort(sortField)
    .limit(parseInt(limit))
    .select('name category price sales ratings stock createdBy');

    res.json({ products: topProducts });
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({
      message: 'Server error fetching top products'
    });
  }
});

// @route   GET /api/analytics/recent-activities
// @desc    Get recent system activities
// @access  Private (Admin)
router.get('/recent-activities', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 2)
      .select('name email createdAt role');

    // Get recent products
    const recentProducts = await Product.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 2)
      .select('name category price createdAt createdBy');

    // Combine and format activities
    const activities = [];
    
    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        action: 'created',
        item: user.name,
        details: `New ${user.role} registered`,
        timestamp: user.createdAt,
        user: user.email
      });
    });

    recentProducts.forEach(product => {
      activities.push({
        type: 'product',
        action: 'created',
        item: product.name,
        details: `New product in ${product.category}`,
        timestamp: product.createdAt,
        user: product.createdBy?.name || 'System'
      });
    });

    // Sort by timestamp and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    res.json({ activities: sortedActivities });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({
      message: 'Server error fetching recent activities'
    });
  }
});

// @route   GET /api/analytics/performance-metrics
// @desc    Get system performance metrics
// @access  Private (Admin)
router.get('/performance-metrics', async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    // Calculate various metrics
    const metrics = {
      conversion: {
        totalProducts: await Product.countDocuments({ isActive: true }),
        productsWithSales: await Product.countDocuments({ 
          isActive: true, 
          'sales.totalSold': { $gt: 0 } 
        })
      },
      engagement: {
        activeUsers: await User.countDocuments({ 
          isActive: true,
          lastLogin: { $gte: lastMonth }
        }),
        totalUsers: await User.countDocuments({ isActive: true })
      },
      inventory: {
        totalStock: await Product.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: null, total: { $sum: '$stock' } } }
        ]),
        lowStockItems: await Product.countDocuments({
          isActive: true,
          stock: { $lte: 10, $gt: 0 }
        }),
        outOfStock: await Product.countDocuments({
          isActive: true,
          stock: 0
        })
      }
    };

    // Calculate conversion rate
    const conversionRate = metrics.conversion.totalProducts > 0 
      ? (metrics.conversion.productsWithSales / metrics.conversion.totalProducts * 100).toFixed(1)
      : 0;

    // Calculate user engagement rate
    const engagementRate = metrics.engagement.totalUsers > 0
      ? (metrics.engagement.activeUsers / metrics.engagement.totalUsers * 100).toFixed(1)
      : 0;

    // Calculate inventory health
    const totalStock = metrics.inventory.totalStock[0]?.total || 0;
    const inventoryHealth = {
      total: totalStock,
      lowStock: metrics.inventory.lowStockItems,
      outOfStock: metrics.inventory.outOfStock,
      healthScore: totalStock > 0 
        ? (((totalStock - metrics.inventory.outOfStock) / totalStock) * 100).toFixed(1)
        : 0
    };

    res.json({
      conversionRate: parseFloat(conversionRate),
      engagementRate: parseFloat(engagementRate),
      inventory: inventoryHealth
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({
      message: 'Server error fetching performance metrics'
    });
  }
});

module.exports = router; 