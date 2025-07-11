import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import AuthRoutes from './routes/AuthRoutes.js';
import DataRoutes from './routes/DataRoutes.js';
import uploadRoute from './routes/uploadRoute.js';
import userRoutes from './routes/userRoutes.js';

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();
// Connect to MongoDB
connectDB();

// Routes

// Auth routes
app.use('/api/auth', AuthRoutes);
app.use('/api/auth', DataRoutes);
app.use('/api/auth', uploadRoute);
app.use('/api/auth', userRoutes);
app.get('/', (req, res) => {
  res.send('Hello, Modular Backend!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});