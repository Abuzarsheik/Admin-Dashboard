#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🚀 Admin Dashboard Deployment Helper\n');

// Generate secure JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('🔐 Generated JWT Secret:');
console.log(`JWT_SECRET=${jwtSecret}\n`);

// Create environment files
const backendEnv = `# Production Environment Variables
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-app-name.vercel.app`;

const frontendEnv = `# Frontend Environment Variables
REACT_APP_API_URL=https://your-backend-domain.railway.app/api
REACT_APP_NAME=Admin Dashboard
REACT_APP_VERSION=1.0.0`;

// Write environment files
try {
  fs.writeFileSync(path.join(__dirname, 'backend', '.env.production'), backendEnv);
  fs.writeFileSync(path.join(__dirname, 'frontend', '.env.production'), frontendEnv);
  
  console.log('✅ Created environment files:');
  console.log('   - backend/.env.production');
  console.log('   - frontend/.env.production\n');
} catch (error) {
  console.log('⚠️  Could not create environment files. Please create them manually.\n');
}

// Deployment checklist
console.log('📋 Deployment Checklist:');
console.log('');
console.log('1. MongoDB Atlas:');
console.log('   □ Create new database: admin-dashboard-prod');
console.log('   □ Get connection string');
console.log('   □ Configure network access (0.0.0.0/0)');
console.log('');
console.log('2. Railway (Backend):');
console.log('   □ Create new project from GitHub');
console.log('   □ Set root directory: backend');
console.log('   □ Add environment variables (see above)');
console.log('   □ Deploy and get URL');
console.log('');
console.log('3. Vercel (Frontend):');
console.log('   □ Create new project from GitHub');
console.log('   □ Set root directory: frontend');
console.log('   □ Add environment variables');
console.log('   □ Deploy and get URL');
console.log('');
console.log('4. Final Steps:');
console.log('   □ Update CORS_ORIGIN in Railway');
console.log('   □ Seed production database');
console.log('   □ Test login with admin@example.com');
console.log('');
console.log('🎉 Happy deploying!');
console.log('');
console.log('📖 For detailed instructions, see DEPLOYMENT_GUIDE.md'); 