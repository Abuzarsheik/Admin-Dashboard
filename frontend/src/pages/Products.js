import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productsAPI, apiHelpers } from '../utils/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [currentPage, searchQuery, selectedCategory]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getProducts({
        page: currentPage,
        limit: 12,
        search: searchQuery,
        category: selectedCategory
      });
      const data = apiHelpers.formatResponse(response);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      apiHelpers.handleError(error, 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      const data = apiHelpers.formatResponse(response);
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(productId);
        apiHelpers.showSuccess('Product deleted successfully');
        loadProducts();
      } catch (error) {
        apiHelpers.handleError(error, 'Failed to delete product');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Products Management
          </h1>
          <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
            Manage your product catalog
          </p>
        </div>
        <button className="btn-primary mt-4 sm:mt-0">
          Add New Product
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-auto"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select className="input w-auto">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <div className="aspect-square bg-secondary-100 dark:bg-secondary-800 rounded-lg mb-4 flex items-center justify-center">
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-4xl">📦</span>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                  ${product.price}
                </span>
                <span className="badge badge-secondary">
                  {product.category}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600 dark:text-secondary-400">
                  Stock: {product.stock}
                </span>
                <span className={`badge ${
                  product.status === 'active' ? 'badge-success' : 'badge-danger'
                }`}>
                  {product.status}
                </span>
              </div>

              {/* Product Actions */}
              <div className="flex gap-2 pt-2">
                <button className="btn-sm btn-secondary flex-1">
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(product._id)}
                  className="btn-sm btn-danger"
                >
                  🗑️
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Showing {products.length} products
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn-sm btn-secondary"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-secondary-700 dark:text-secondary-300">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn-sm btn-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products; 