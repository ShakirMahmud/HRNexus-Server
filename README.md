
# 🌐 HRNexus - Server Side

## 🚀 Backend Repository for Employee Management Platform

## 📋 Project Overview

This is the server-side implementation for HRNexus, providing robust backend services for employee management, authentication, and data processing.

## 🛠 Technologies Used

### Core Technologies
- Node.js
- Express.js
- MongoDB
- JSON Web Token (JWT)

### Key Dependencies
- cors
- dotenv
- jsonwebtoken
- mongodb
- stripe

## 🌟 Key Features

1. **Authentication**
   - JWT-based authentication
   - Role-based access control
   - Middleware for route protection

2. **Database Management**
   - MongoDB connection
   - Efficient data retrieval and storage
   - Secure database operations

3. **Route Handlers**
   - Users management
   - Worksheet tracking
   - Payment processing
   - Contact form submissions

4. **Security**
   - Token verification
   - Role-specific middleware
   - Environment variable protection

5. **Payment Integration**
   - Stripe payment gateway support
   - Secure transaction processing

## 🔐 Authentication Middleware

### Middleware Types
- `verifyToken`: Basic token authentication
- `verifyAdmin`: Admin-only route protection
- `verifyHR`: HR-specific route protection
- `verifyEmployee`: Employee-only route protection
- `verifyAdminOrHR`: Dual-role route access

## 📦 Dependencies

```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.12.0",
    "stripe": "^17.5.0"
  }
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Stripe Account

### Installation Steps
1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```
4. Run the server
   ```bash
   npm start
   ```

## 🌐 Environment Configuration

### Required Environment Variables
- `PORT`: Server running port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `STRIPE_SECRET_KEY`: Stripe payment gateway secret key

## 📂 Project Structure

```
server/
│
├── src/
│   ├── config/
│   │   └── dbConnection.js
│   ├── routes/
│   │   ├── usersRoutes.js
│   │   ├── workSheetRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── contactRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── utils/
│       └── jwtCreateToken.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

## 🔒 Security Best Practices

- Use environment variables for sensitive information
- Implement role-based access control
- Validate and sanitize all input data
- Use HTTPS in production
- Regularly update dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or support, please open a GitHub issue or contact shakirmahmud50@gmail.com



---

