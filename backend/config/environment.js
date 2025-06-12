const config = {
  development: {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-dashboard',
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    NODE_ENV: 'development'
  },
  production: {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    NODE_ENV: 'production'
  },
  test: {
    PORT: process.env.PORT || 5001,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-dashboard-test',
    JWT_SECRET: process.env.JWT_SECRET || 'test-jwt-secret',
    JWT_EXPIRE: '1h',
    CORS_ORIGIN: 'http://localhost:3000',
    NODE_ENV: 'test'
  }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment]; 