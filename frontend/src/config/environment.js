// Environment configuration
const config = {
  development: {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    APP_NAME: 'Admin Dashboard',
    APP_VERSION: '1.0.0',
  },
  production: {
    API_URL: process.env.REACT_APP_API_URL || '/api',
    APP_NAME: 'Admin Dashboard',
    APP_VERSION: '1.0.0',
  }
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment]; 