import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { analyticsAPI, apiHelpers } from '../utils/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const Analytics = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [salesTrends, setSalesTrends] = useState(null);
  const [userGrowth, setUserGrowth] = useState(null);
  const [categoryDistribution, setCategoryDistribution] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12months');

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      const [metricsRes, salesRes, userRes, categoryRes] = await Promise.all([
        analyticsAPI.getPerformanceMetrics(),
        analyticsAPI.getSalesTrends(selectedPeriod),
        analyticsAPI.getUserGrowth(selectedPeriod),
        analyticsAPI.getCategoryDistribution()
      ]);

      setPerformanceMetrics(apiHelpers.formatResponse(metricsRes));
      setSalesTrends(apiHelpers.formatResponse(salesRes));
      setUserGrowth(apiHelpers.formatResponse(userRes));
      setCategoryDistribution(apiHelpers.formatResponse(categoryRes));
    } catch (error) {
      apiHelpers.handleError(error, 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#6B7280',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: '#6B7280' }
      },
      y: {
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: '#6B7280' }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
            Advanced analytics and business insights
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input w-auto"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                Conversion Rate
              </p>
              <p className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100">
                {performanceMetrics?.conversionRate || 0}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <span className="text-lg">👥</span>
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                User Engagement
              </p>
              <p className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100">
                {performanceMetrics?.engagementRate || 0}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-warning-100 dark:bg-warning-900/20 flex items-center justify-center">
                <span className="text-lg">📦</span>
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                Inventory Health
              </p>
              <p className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100">
                {performanceMetrics?.inventory?.healthScore || 0}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
            Sales Trends
          </h3>
          <div className="h-80">
            <Line 
              data={{
                labels: salesTrends?.trends?.map(t => t.period) || [],
                datasets: [{
                  label: 'Revenue',
                  data: salesTrends?.trends?.map(t => t.revenue) || [],
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                  tension: 0.4,
                }]
              }}
              options={chartOptions}
            />
          </div>
        </motion.div>

        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
            User Growth
          </h3>
          <div className="h-80">
            <Bar 
              data={{
                labels: userGrowth?.growth?.map(g => g.period) || [],
                datasets: [{
                  label: 'New Users',
                  data: userGrowth?.growth?.map(g => g.newUsers) || [],
                  backgroundColor: '#10B981',
                  borderColor: '#10B981',
                  borderWidth: 2,
                }]
              }}
              options={chartOptions}
            />
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
            Category Distribution
          </h3>
          <div className="h-80">
            <Doughnut 
              data={{
                labels: categoryDistribution?.distribution?.map(d => d.category) || [],
                datasets: [{
                  data: categoryDistribution?.distribution?.map(d => d.count) || [],
                  backgroundColor: [
                    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'
                  ],
                  borderWidth: 0,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, padding: 20, color: '#6B7280' }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Inventory Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
            Inventory Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">Total Stock</span>
              <span className="font-medium text-secondary-900 dark:text-secondary-100">
                {performanceMetrics?.inventory?.total || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">Low Stock Items</span>
              <span className="font-medium text-warning-600 dark:text-warning-400">
                {performanceMetrics?.inventory?.lowStock || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">Out of Stock</span>
              <span className="font-medium text-danger-600 dark:text-danger-400">
                {performanceMetrics?.inventory?.outOfStock || 0}
              </span>
            </div>
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Health Score</span>
                <span className="text-lg font-bold text-success-600 dark:text-success-400">
                  {performanceMetrics?.inventory?.healthScore || 0}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics; 