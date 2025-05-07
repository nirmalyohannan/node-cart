# NodeCart - Express.js E-commerce Template

A modular, scalable, and reusable eCommerce backend template built with Node.js and Express.js. This template provides a solid foundation for building full-featured e-commerce applications with a clean architecture and modern JavaScript (ES modules) support.

## 🚀 Features

- **RESTful API** - Clean and well-documented API endpoints
- **MongoDB Integration** - Using Mongoose ODM for database operations
- **Environment Configuration** - Easy configuration using environment variables
- **Modular Architecture** - Organized directory structure for better code management
- **Error Handling** - Centralized error handling middleware
- **Request Logging** - Built-in request logging middleware
- **User Management** - Basic user CRUD operations
- **ES Modules** - Modern JavaScript with ES modules support

## 🛠️ Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/node-cart.git
   cd node-cart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`

## 📂 Project Structure

```
node-cart/
├── models/           # Database models
│   └── user.mjs     # User model
├── routes/          # API routes
│   └── userRoutes.mjs # User routes
├── middleware/      # Custom middleware
│   └── logger.mjs   # Request logger
├── index.mjs        # Application entry point
└── package.json     # Project dependencies and scripts
```

## 📚 API Endpoints

### Users

- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a single user by ID
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## 🛠️ Development

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

## 🔧 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Package Manager**: npm
- **Environment Management**: dotenv

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📬 Contact

For any questions or feedback, please open an issue or contact the project maintainers.
