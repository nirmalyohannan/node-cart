import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env file
// Which is accessed via process.env
dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅Connected to MongoDB'))
    .catch((err) => console.log("❌", err));


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send({ success: true, message: 'Welcome to the NodeCart API!' });
});

app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
});
