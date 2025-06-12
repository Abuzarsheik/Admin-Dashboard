import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      description: 'Overview & Analytics'
    },
    {
      name: 'Users',
      href: '/users',
      icon: '👥',
      description: 'User Management'
    },
    {
      name: 'Products',
      href: '/products',
      icon: '📦',
      description: 'Product Catalog'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: '📈',
      description: 'Reports & Insights'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: '👤',
      description: 'Account Settings'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: '⚙️',
      description: 'App Preferences'
    },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="glass-card h-full border-r-0 rounded-none p-0 overflow-hidden">
            {/* Logo Section */}
            <div className="flex items-center justify-center h-16 px-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <h1 className="text-xl font-bold text-gradient">
                  Admin Panel
                </h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-4 py-3 text-sm font-medium rounded-xl
                      transition-all duration-200 relative overflow-hidden
                      ${isActive 
                        ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400 shadow-colored' 
                        : 'text-secondary-600 dark:text-secondary-300 hover:bg-white/10 dark:hover:bg-white/5'
                      }
                    `}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    
                    <div className="flex-1 relative z-10">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                        {item.description}
                      </div>
                    </div>

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-primary-500 rounded-full ml-2"
                      />
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-white/10">
              <div className="glass rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      System Status
                    </p>
                    <p className="text-xs text-success-600 dark:text-success-400">
                      All systems operational
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-30 w-72 lg:hidden"
          >
            <div className="glass-card h-full border-r-0 rounded-none p-0 overflow-hidden">
              {/* Header with close button */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <h1 className="text-xl font-bold text-gradient">
                    Admin Panel
                  </h1>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={onClose}
                      className={`
                        group flex items-center px-4 py-3 text-sm font-medium rounded-xl
                        transition-all duration-200 relative overflow-hidden
                        ${isActive 
                          ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400 shadow-colored' 
                          : 'text-secondary-600 dark:text-secondary-300 hover:bg-white/10 dark:hover:bg-white/5'
                        }
                      `}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                          {item.description}
                        </div>
                      </div>

                      {isActive && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full ml-2" />
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Bottom Section */}
              <div className="p-4 border-t border-white/10">
                <div className="glass rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        System Status
                      </p>
                      <p className="text-xs text-success-600 dark:text-success-400">
                        All systems operational
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar; 