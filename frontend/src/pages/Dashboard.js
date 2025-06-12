import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { analyticsAPI, apiHelpers } from '../utils/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [salesTrends, setSalesTrends] = useState(null);
  const [userGrowth, setUserGrowth] = useState(null);
  const [categoryDistribution, setCategoryDistribution] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load all dashboard data in parallel
      const [
        dashboardRes,
        salesRes,
        userRes,
        categoryRes,
        productsRes,
        activitiesRes
      ] = await Promise.all([
        analyticsAPI.getDashboardData(),
        analyticsAPI.getSalesTrends(selectedPeriod),
        analyticsAPI.getUserGrowth(selectedPeriod),
        analyticsAPI.getCategoryDistribution(),
        analyticsAPI.getTopProducts({ limit: 5 }),
        analyticsAPI.getRecentActivities(10)
      ]);

      setDashboardData(apiHelpers.formatResponse(dashboardRes));
      setSalesTrends(apiHelpers.formatResponse(salesRes));
      setUserGrowth(apiHelpers.formatResponse(userRes));
      setCategoryDistribution(apiHelpers.formatResponse(categoryRes));
      setTopProducts(apiHelpers.formatResponse(productsRes).products || []);
      setRecentActivities(apiHelpers.formatResponse(activitiesRes).activities || []);
    } catch (error) {
      apiHelpers.handleError(error, 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Chart configurations
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
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
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
    }
  };

  // Chart data
  const salesChartData = {
    labels: salesTrends?.trends?.map(t => t.period) || [],
    datasets: [
      {
        label: 'Sales Revenue',
        data: salesTrends?.trends?.map(t => t.revenue) || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const userGrowthData = {
    labels: userGrowth?.growth?.map(g => g.period) || [],
    datasets: [
      {
        label: 'New Users',
        data: userGrowth?.growth?.map(g => g.newUsers) || [],
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        borderWidth: 2,
      }
    ]
  };

  const categoryChartData = {
    labels: categoryDistribution?.distribution?.map(d => d.category) || [],
    datasets: [
      {
        data: categoryDistribution?.distribution?.map(d => d.count) || [],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#F97316',
        ],
        borderWidth: 0,
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input w-auto"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total Revenue',
            value: `$${dashboardData?.sales?.totalRevenue?.toLocaleString() || '0'}`,
            change: 12.5,
            icon: '💰',
            color: 'success'
          },
          {
            title: 'Total Users',
            value: dashboardData?.users?.total?.toLocaleString() || '0',
            change: dashboardData?.users?.growth || 0,
            icon: '👥',
            color: 'primary'
          },
          {
            title: 'Total Products',
            value: dashboardData?.products?.total?.toLocaleString() || '0',
            change: 8.2,
            icon: '📦',
            color: 'warning'
          },
          {
            title: 'Active Users',
            value: dashboardData?.users?.active?.toLocaleString() || '0',
            change: 15.3,
            icon: '📈',
            color: 'info'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20 flex items-center justify-center`}>
                  <span className="text-lg">{stat.icon}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                    {stat.title}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.change >= 0 ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      <span>{stat.change >= 0 ? '↗' : '↘'}</span>
                      <span className="ml-1">{Math.abs(stat.change)}%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
              Sales Trends
            </h3>
            <span className="text-sm text-secondary-500 dark:text-secondary-400">
              Revenue over time
            </span>
          </div>
          <div className="h-80">
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
              User Growth
            </h3>
            <span className="text-sm text-secondary-500 dark:text-secondary-400">
              New registrations
            </span>
          </div>
          <div className="h-80">
            <Bar data={userGrowthData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
              Category Distribution
            </h3>
            <span className="text-sm text-secondary-500 dark:text-secondary-400">
              Sales by category
            </span>
          </div>
          <div className="h-80">
            <Doughnut data={categoryChartData} options={doughnutOptions} />
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
              Top Products
            </h3>
            <span className="text-sm text-secondary-500 dark:text-secondary-400">
              Best sellers
            </span>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product._id} className="flex items-center justify-between p-3 bg-white/5 dark:bg-black/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-400">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      {product.name}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      {product.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    {product.sales?.totalSold || 0} sold
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
            Recent Activities
          </h3>
          <button className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            View all
          </button>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 hover:bg-white/5 dark:hover:bg-black/5 rounded-lg transition-colors">
              <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-secondary-900 dark:text-secondary-100">
                  {activity.details || `${activity.action} ${activity.item}` || `Activity ${index + 1}`}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Just now'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 