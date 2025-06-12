const express = require('express');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);
router.use(adminAuth);

// @route   GET /api/products
// @desc    Get all products with pagination, search, and filtering
// @access  Private (Admin)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      brand = '',
      minPrice = '',
      maxPrice = '',
      isActive = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Search by name, description, brand, or tags
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by brand
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Filter by active status
    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with population
    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      message: 'Server error fetching products'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Private (Admin)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }

    res.status(500).json({
      message: 'Server error fetching product'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Admin)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      sku,
      stock,
      images = [],
      tags = [],
      discount = {}
    } = req.body;

    // Validation
    if (!name || !description || !price || !category || !sku) {
      return res.status(400).json({
        message: 'Please provide name, description, price, category, and SKU'
      });
    }

    if (price < 0) {
      return res.status(400).json({
        message: 'Price cannot be negative'
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        message: 'Stock cannot be negative'
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingProduct) {
      return res.status(400).json({
        message: 'Product with this SKU already exists'
      });
    }

    // Create new product
    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      sku: sku.toUpperCase(),
      stock: stock || 0,
      images,
      tags,
      discount,
      createdBy: req.user._id
    });

    await product.save();

    // Populate the created product
    await product.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Product with this SKU already exists'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Server error creating product'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Add updatedBy field
    updateData.updatedBy = req.user._id;

    // If SKU is being updated, check for duplicates
    if (updateData.sku) {
      updateData.sku = updateData.sku.toUpperCase();
      const existingProduct = await Product.findOne({ 
        sku: updateData.sku, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingProduct) {
        return res.status(400).json({
          message: 'Product with this SKU already exists'
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Product with this SKU already exists'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Server error updating product'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        isActive: false,
        updatedBy: req.user._id
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json({
      message: 'Product deactivated successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }

    res.status(500).json({
      message: 'Server error deleting product'
    });
  }
});

// @route   PUT /api/products/:id/activate
// @desc    Activate product
// @access  Private (Admin)
router.put('/:id/activate', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        isActive: true,
        updatedBy: req.user._id
      },
      { new: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json({
      message: 'Product activated successfully',
      product
    });
  } catch (error) {
    console.error('Activate product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }

    res.status(500).json({
      message: 'Server error activating product'
    });
  }
});

// @route   GET /api/products/categories/list
// @desc    Get all product categories
// @access  Private (Admin)
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      message: 'Server error fetching categories'
    });
  }
});

// @route   GET /api/products/brands/list
// @desc    Get all product brands
// @access  Private (Admin)
router.get('/brands/list', async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json({ brands: brands.filter(brand => brand) });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      message: 'Server error fetching brands'
    });
  }
});

// @route   GET /api/products/low-stock
// @desc    Get products with low stock
// @access  Private (Admin)
router.get('/low-stock', async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    
    const products = await Product.find({
      stock: { $lte: parseInt(threshold) },
      isActive: true
    })
    .populate('createdBy', 'name email')
    .sort({ stock: 1 });

    res.json({ products });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({
      message: 'Server error fetching low stock products'
    });
  }
});

// @route   GET /api/products/popular
// @desc    Get popular products by sales
// @access  Private (Admin)
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const products = await Product.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ 'sales.totalSold': -1, 'ratings.average': -1 })
      .limit(parseInt(limit));

    res.json({ products });
  } catch (error) {
    console.error('Get popular products error:', error);
    res.status(500).json({
      message: 'Server error fetching popular products'
    });
  }
});

// @route   GET /api/products/stats/overview
// @desc    Get product statistics
// @access  Private (Admin)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({ 
      stock: { $lte: 10 }, 
      isActive: true 
    });
    const outOfStockProducts = await Product.countDocuments({ 
      stock: 0, 
      isActive: true 
    });

    // Get category distribution
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get total revenue and top products
    const revenueStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$sales.revenue' },
          totalSold: { $sum: '$sales.totalSold' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    // Get recent products (last 30 days)
    const recentProducts = await Product.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      totalProducts,
      activeProducts,
      inactiveProducts: totalProducts - activeProducts,
      lowStockProducts,
      outOfStockProducts,
      recentProducts,
      categoryStats,
      revenue: revenueStats[0] || { 
        totalRevenue: 0, 
        totalSold: 0, 
        avgPrice: 0 
      }
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({
      message: 'Server error fetching product statistics'
    });
  }
});

module.exports = router; 