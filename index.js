import express from 'express';
import mongoose from 'mongoose';
import auctionRoutes from './routes/auctionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import "./scheduler.js";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/auction', auctionRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use("/api/auth", authRoutes);

app.listen(PORT, "0.0.0.0", () => console.log(`✅ Server running on http://localhost:${PORT}`));
