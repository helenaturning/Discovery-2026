import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import siteRoutes from './routes/sites';
import pairRoutes from './routes/pairs';
import sessionRoutes from './routes/sessions';
import checkinRoutes from './routes/checkins';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/pairs', pairRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/checkins', checkinRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
