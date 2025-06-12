# 🚀 Modern Admin Dashboard - MERN Stack

A fully responsive, modern admin dashboard built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, real-time analytics, and a beautiful glassmorphism UI design.

![Dashboard Preview](https://via.placeholder.com/1200x600/3B82F6/FFFFFF?text=Admin+Dashboard+Preview)

## 🚀 Features

### 🔐 **Authentication & Security**
- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Protected routes with role-based access control
- Session management and auto-logout

### 📊 **Analytics Dashboard**
- Real-time data visualization with Chart.js
- Sales trends and revenue analytics
- User growth metrics
- Category distribution charts
- Top products analysis
- Recent activities feed

### 👥 **User Management**
- Complete CRUD operations for users
- Role-based permissions (Admin/User)
- User status management (Active/Inactive)
- Advanced search and filtering
- Pagination support

### 📦 **Product Management**
- Full product catalog management
- Image upload support
- Category and brand organization
- Stock management
- Advanced filtering and search

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: System preference detection
- **Glassmorphism**: Modern glass effects
- **Neumorphism**: Soft UI elements
- **Smooth Animations**: Framer Motion integration
- **Professional Layout**: Collapsible sidebar and topbar

### 🔍 **Advanced Features**
- Real-time search with debouncing
- Sortable and filterable data tables
- Export functionality
- Bulk operations
- Toast notifications
- Loading states and error handling

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Chart.js** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd admin-dashboard
```

### 2. Install Dependencies

**Install all dependencies (frontend + backend):**
```bash
npm install
```

**Or install individually:**
```bash
# Backend dependencies
cd backend && npm install

# Frontend dependencies
cd ../frontend && npm install
```

### 3. Environment Setup

**Backend (.env):**
Create `backend/.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/admin-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env):**
Create `frontend/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Admin Dashboard
REACT_APP_VERSION=1.0.0
```

### 4. Database Setup

**Start MongoDB:**
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, update MONGODB_URI in .env
```

**Seed Database (Optional):**
```bash
cd backend
npm run seed
```

## 🚀 Running the Application

### Development Mode

**Start both frontend and backend:**
```bash
npm run dev
```

**Or start individually:**
```bash
# Start backend (from root)
npm run server

# Start frontend (from root)
npm run client
```

### Production Mode

**Build and start:**
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 📱 Usage

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs

### Demo Credentials
```
Email: admin@admin.com
Password: admin123
```

### Available Scripts

**Root Package Scripts:**
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production
- `npm start` - Start production server

**Backend Scripts:**
- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run seed` - Seed database with sample data

**Frontend Scripts:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🏗️ Project Structure

```
admin-dashboard/
├── backend/
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── seeds/              # Database seeders
│   └── server.js           # Entry point
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── tailwind.config.js  # Tailwind configuration
├── package.json            # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Users
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/activate` - Toggle user status

### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories/list` - Get categories
- `GET /api/products/low-stock` - Get low stock products

### Analytics
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/sales-trends` - Sales trends
- `GET /api/analytics/user-growth` - User growth
- `GET /api/analytics/category-distribution` - Category stats

## 🎨 Customization

### Tailwind Configuration
Modify `frontend/tailwind.config.js` to customize:
- Color schemes
- Fonts
- Spacing
- Animations
- Components

### Theme Configuration
Update theme colors in `frontend/src/styles/index.css`:
- Primary colors
- Secondary colors
- Glass effects
- Dark mode variants

## 🔒 Security Features

- **JWT Authentication** with secure HTTP-only cookies
- **Password Hashing** with bcrypt
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **Input Validation** and sanitization
- **Role-based Access Control**

## 📊 Performance Features

- **Code Splitting** with React.lazy
- **Image Optimization** and lazy loading
- **API Request Caching**
- **Debounced Search** to reduce API calls
- **Pagination** for large datasets
- **Optimized Bundle Size**

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `build` folder
3. Configure environment variables

### Backend (Heroku/Railway)
1. Set environment variables
2. Configure MongoDB Atlas
3. Deploy backend code
4. Run database seeding if needed

### Full Stack (Docker)
```dockerfile
# Example Dockerfile provided
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- [ ] Real-time notifications with Socket.io
- [ ] Advanced reporting and exports
- [ ] Multi-language support
- [ ] Email notification system
- [ ] Advanced user permissions
- [ ] Audit logs and activity tracking
- [ ] Integration with third-party services
- [ ] Mobile app companion

---

**Built with ❤️ using the MERN Stack**

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Heroicons](https://heroicons.com/) for beautiful SVG icons
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Unsplash](https://unsplash.com/) for placeholder images

## 📞 Support

If you have any questions or need help, please:
- Create an issue on GitHub
- Email: support@yourdomain.com
- Join our Discord community

---

Made with ❤️ by [Your Name]

🌟 **Star this repository if you found it helpful!** 