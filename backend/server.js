import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import visaRoutes from './routes/visaRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import b2bRoutes from './routes/b2bRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import dummyTicketRoutes from './routes/dummyTicketRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { Visa } from './models/Visa.js';
import { Application } from './models/Application.js';
import { B2BPartner } from './models/B2BPartner.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/phelavisa';

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create a dummy sample PDF in uploads for testing
const dummyPdfPath = path.join(uploadsDir, 'dummy_passport.pdf');
if (!fs.existsSync(dummyPdfPath)) {
  fs.writeFileSync(dummyPdfPath, '%PDF-1.4 Pehla Visa Sample Passport Document');
}

// Middleware Configuration
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadsDir));

// API Routes Mount

app.use('/api/auth', authRoutes);
app.use('/api/visas', visaRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/b2b/partners', b2bRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/dummy-tickets', dummyTicketRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = process.env.SITE_URL || `${protocol}://${host}`;

  res.json({
    status: 'online',
    message: 'Pehla Visa Node.js Express REST API Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
    uploadsUrl: `${baseUrl}/uploads`,
  });
});

import bcrypt from 'bcryptjs';
import { Auth } from './models/Auth.js';
import { INITIAL_VISAS } from './routes/seedRoutes.js';

// Automatic Database Seeding on Startup (Ensures Default Admin & Visas Exist)
async function autoSeedDatabase() {
  try {
    const adminExists = await Auth.findOne({ email: 'admin@phelavisa.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123456', 10);
      await Auth.create({
        name: 'Pehla Visa Admin',
        email: 'admin@phelavisa.com',
        password: hashedPassword,
        phone: '9876543210',
        role: 'ADMIN',
      });
      console.log('🔑 Default Admin Account created in MongoDB Auth: admin@phelavisa.com / Admin@123456');
    }

    const visaCount = await Visa.countDocuments();
    if (visaCount === 0) {
      await Visa.insertMany(INITIAL_VISAS);
      console.log('🌍 Default Visa listings successfully seeded to MongoDB with verified pricing!');
    }
  } catch (err) {
    console.warn('Auto seed warning:', err.message);
  }
}

// Connect MongoDB and Start Express Server
async function startServer() {
  let connected = false;
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ Connected to MongoDB Database`);
    await autoSeedDatabase();
    connected = true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);

    if (MONGODB_URI.includes('mongodb+srv')) {
      console.log('\n------------------------------------------------------------');
      console.log('📌 MONGODB ATLAS TLS / IP WHITELIST ALERT:');
      console.log('MongoDB Atlas rejected the SSL/TLS connection (Alert 80 / IP Not Whitelisted).');
      console.log('1. Go to https://cloud.mongodb.com -> Network Access -> IP Access List.');
      console.log('2. Click "Add IP Address" and select "Allow Access From Anywhere" (0.0.0.0/0).');
      console.log('------------------------------------------------------------\n');

      console.log('⚠️ Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/phelavisa)...');
      try {
        await mongoose.connect('mongodb://127.0.0.1:27017/phelavisa', {
          serverSelectionTimeoutMS: 3000,
        });
        console.log('✅ Connected to Local MongoDB Database (127.0.0.1:27017)!');
        await autoSeedDatabase();
        connected = true;
      } catch (localErr) {
        console.warn('Local MongoDB fallback unavailable:', localErr.message);
      }
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Pehla Visa REST API Backend Server listening on http://localhost:${PORT}`);
    console.log(`📁 Uploads Directory: ${uploadsDir}`);
    if (!connected) {
      console.log('⚠️ Server running in memory fallback mode (database disconnected).');
    }
  });
}

startServer();
