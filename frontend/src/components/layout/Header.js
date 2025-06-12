import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  const getAvatarText = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  return (
    <header className="glass-card border-b border-white/10 rounded-none h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
        >
          <span className="text-xl">☰</span>
        </button>

        {/* Search bar */}
        <div className="hidden md:block relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-secondary-500 dark:text-secondary-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              input pl-10 pr-4 py-2 w-64
              bg-white/10 dark:bg-black/10
              border-white/20 dark:border-white/10
              placeholder-secondary-400 dark:placeholder-secondary-500
              focus:bg-white/20 dark:focus:bg-black/20
            "
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="
            p-2 rounded-lg 
            hover:bg-white/10 dark:hover:bg-white/5 
            transition-all duration-200
            relative overflow-hidden
          "
          title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDarkMode ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDarkMode ? (
              <span className="text-xl">🌙</span>
            ) : (
              <span className="text-xl">☀️</span>
            )}
          </motion.div>
        </button>

        {/* Notifications */}
        <button className="
          p-2 rounded-lg 
          hover:bg-white/10 dark:hover:bg-white/5 
          transition-colors relative
        ">
          <span className="text-xl">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="
              flex items-center space-x-3 p-2 rounded-lg
              hover:bg-white/10 dark:hover:bg-white/5
              transition-all duration-200
            "
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium text-sm">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                getAvatarText(user?.name)
              )}
            </div>

            {/* User info (hidden on mobile) */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                {user?.name}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                {user?.role}
              </p>
            </div>

            {/* Chevron */}
            <motion.span
              animate={{ rotate: userMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-secondary-500 dark:text-secondary-400"
            >
              ▼
            </motion.span>
          </button>

          {/* User dropdown menu */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="
                  absolute right-0 mt-2 w-56 origin-top-right
                  glass rounded-xl shadow-lg border border-white/20
                  z-[9999]
                "
              >
                <div className="p-3">
                  {/* User info */}
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 dark:bg-black/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        getAvatarText(user?.name)
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {user?.name}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        {user?.email}
                      </p>
                      <span className="inline-block px-2 py-0.5 mt-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  {/* Menu items */}
                  <nav className="mt-3 space-y-1">
                    <a
                      href="/profile"
                      className="
                        flex items-center px-3 py-2 text-sm rounded-lg
                        hover:bg-white/10 dark:hover:bg-white/5
                        text-secondary-700 dark:text-secondary-300
                        transition-colors
                      "
                    >
                      <span className="mr-3">👤</span>
                      My Profile
                    </a>
                    <a
                      href="/settings"
                      className="
                        flex items-center px-3 py-2 text-sm rounded-lg
                        hover:bg-white/10 dark:hover:bg-white/5
                        text-secondary-700 dark:text-secondary-300
                        transition-colors
                      "
                    >
                      <span className="mr-3">⚙️</span>
                      Settings
                    </a>
                    <hr className="my-2 border-white/10" />
                    <button
                      onClick={handleLogout}
                      className="
                        w-full flex items-center px-3 py-2 text-sm rounded-lg
                        hover:bg-danger-500/10 dark:hover:bg-danger-500/20
                        text-danger-600 dark:text-danger-400
                        transition-colors
                      "
                    >
                      <span className="mr-3">🚪</span>
                      Sign out
                    </button>
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header; 