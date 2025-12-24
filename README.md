# MERN Stack eCommerce Application

A production-ready, full-featured eCommerce application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that looks, behaves, and is architected like a real startup product.

## 🚀 Features

### 👤 User Features
- **Authentication & Authorization**
  - Secure signup/login with JWT + Refresh Tokens
  - Email verification system
  - Password reset functionality
  - Role-based access control (User/Admin)
  - Account lockout after failed attempts

- **Product Browsing**
  - Advanced search with filters and pagination
  - Category-based navigation
  - Product reviews and ratings
  - Related and recommended products
  - Wishlist functionality

- **Shopping Experience**
  - Persistent shopping cart (DB + localStorage)
  - Multiple product variants support
  - Real-time inventory tracking
  - Coupon and discount system

- **Checkout & Payments**
  - Stripe payment integration
  - Multiple shipping addresses
  - Order tracking and history
  - Email notifications

### 🛠 Admin Features
- **Dashboard Analytics**
  - Sales reports and revenue metrics
  - User activity tracking
  - Inventory management alerts
  - Performance insights

- **Product Management**
  - Full CRUD operations for products
  - Category and inventory management
  - Bulk operations support
  - Image upload with Cloudinary

- **Order Management**
  - Order status updates
  - Shipping management
  - Refund processing
  - Customer communication

- **User Management**
  - User account management
  - Role assignment
  - Account activation/deactivation

## 🏗 Tech Stack

### Frontend
- **React.js** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Cloudinary** for image storage
- **Stripe** for payments
- **Nodemailer** for emails

### Security & Performance
- **Helmet** for security headers
- **Rate limiting** for API protection
- **Data sanitization** against NoSQL injection
- **CORS** configuration
- **Compression** middleware
- **Error handling** middleware

## 📁 Project Structure

```
mern-ecommerce/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   └── package.json
├── .env.example
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-ecommerce
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Configure Environment Variables**
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000

   # Database
   MONGODB_URI=mongodb://localhost:27017/mern-ecommerce

   # JWT Secrets
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Stripe Configuration
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

5. **Start the Application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev

   # Or run separately
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/v1/health

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/search` - Search products

### Cart & Wishlist
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/add` - Add item to cart
- `PUT /api/v1/cart/items/:id` - Update cart item
- `DELETE /api/v1/cart/items/:id` - Remove cart item

### Orders
- `GET /api/v1/orders` - Get user orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/:id` - Get single order
- `PUT /api/v1/orders/:id/cancel` - Cancel order

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password hashing** with bcrypt
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **CORS** configuration
- **Security headers** with Helmet
- **Account lockout** after failed attempts
- **Email verification** for new accounts

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set environment variables
2. Configure MongoDB Atlas
3. Set up Cloudinary
4. Configure Stripe webhooks
5. Deploy application

### Frontend Deployment (Vercel/Netlify)
1. Build the application: `npm run build`
2. Configure environment variables
3. Deploy build folder

## 📈 Performance Optimizations

- **Database indexing** for faster queries
- **Image optimization** with Cloudinary
- **Lazy loading** for components
- **Code splitting** for reduced bundle size
- **Caching strategies** for API responses
- **Compression** middleware for responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- MongoDB team for the database
- Stripe for payment processing
- Cloudinary for image management
- All open-source contributors

## 📞 Support

For support, email support@yourstore.com or join our Slack channel.

---

**Built with ❤️ using the MERN Stack**