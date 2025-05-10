import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import logger from './middleware/logger.mjs';
import userRoutes from './routes/userRoutes.mjs';
import authRoutes from './routes/authRoutes.mjs';

// Load environment variables from .env file
// Which is accessed via process.env
dotenv.config();

// Make sure to set JWT_SECRET in your .env file
if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅Connected to MongoDB'))
    .catch((err) => console.log("❌", err));

// Create express app
const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());

// Logger middleware
app.use(logger);

// Routes
app.use('/api/users', userRoutes);

// Add auth routes
app.use('/api/auth', authRoutes);

// Default route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
    console.log(`Server is running at http://localhost:${PORT}`);
});
