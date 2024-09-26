import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import generateImageRoute from './routes/GenerateImage.js';
import posts from './routes/Posts.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/generateImage/', generateImageRoute);
app.use('/api/post/', posts);

// Error handler middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Basic root route for testing
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello developers from GFG',
  });
});

// MongoDB connection function
const connectDB = () => {
  mongoose.set('strictQuery', true);
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
      console.error('Failed to connect to MongoDB');
      console.error(err);
    });
};

// Connect to MongoDB
connectDB();

// Export the app (Vercel will handle port binding)
export default app;
