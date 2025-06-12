#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Admin Dashboard...\n');

// Check if Node.js version is sufficient
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Function to run commands
function runCommand(command, description) {
  try {
    console.log(`📦 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ Failed to ${description.toLowerCase()}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Create environment files
function createEnvFiles() {
  console.log('📝 Creating environment files...');
  
  // Backend .env
  const backendEnv = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/admin-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000`;

  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  if (!fs.existsSync(backendEnvPath)) {
    fs.writeFileSync(backendEnvPath, backendEnv);
    console.log('✅ Created backend/.env');
  } else {
    console.log('⚠️  backend/.env already exists, skipping');
  }

  // Frontend .env
  const frontendEnv = `REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Admin Dashboard
REACT_APP_VERSION=1.0.0`;

  const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
  if (!fs.existsSync(frontendEnvPath)) {
    fs.writeFileSync(frontendEnvPath, frontendEnv);
    console.log('✅ Created frontend/.env');
  } else {
    console.log('⚠️  frontend/.env already exists, skipping');
  }
  
  console.log('');
}

// Main setup process
async function setup() {
  try {
    // Install root dependencies
    runCommand('npm install', 'Installing root dependencies');
    
    // Install backend dependencies
    process.chdir(path.join(__dirname, 'backend'));
    runCommand('npm install', 'Installing backend dependencies');
    
    // Install frontend dependencies
    process.chdir(path.join(__dirname, 'frontend'));
    runCommand('npm install', 'Installing frontend dependencies');
    
    // Go back to root
    process.chdir(__dirname);
    
    // Create environment files
    createEnvFiles();
    
    console.log('🎉 Setup completed successfully!\n');
    console.log('📋 Next steps:');
    console.log('1. Make sure MongoDB is running on your system');
    console.log('2. Update the environment variables in backend/.env and frontend/.env as needed');
    console.log('3. Run "npm run dev" to start both frontend and backend\n');
    console.log('🔗 URLs:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend:  http://localhost:5000');
    console.log('   API:      http://localhost:5000/api\n');
    console.log('🔑 Demo Login:');
    console.log('   Email:    admin@admin.com');
    console.log('   Password: admin123\n');
    console.log('Happy coding! 🚀');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup(); 