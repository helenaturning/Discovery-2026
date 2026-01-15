import express from 'express';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Create check-in
router.post('/', authMiddleware, async (req, res) => {
    const { site_id, pair_id, type, verification_method, latitude, longitude, status, ai_confidence_score, pair_present, distance_to_pair, photo_url } = req.body;
    const userId = (req as any).user.id;

    try {
        const result = await query(
            `INSERT INTO check_ins (
        employee_id, site_id, pair_id, type, verification_method, 
        latitude, longitude, status, ai_confidence_score, 
        pair_present, distance_to_pair, photo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [userId, site_id, pair_id, type, verification_method, latitude, longitude, status, ai_confidence_score, pair_present, distance_to_pair, photo_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating check-in:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get check-ins for logged-in employee today
router.get('/today', authMiddleware, async (req, res) => {
    const userId = (req as any).user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const result = await query(
            'SELECT * FROM check_ins WHERE employee_id = $1 AND timestamp >= $2 ORDER BY timestamp DESC',
            [userId, today.toISOString()]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching today\'s check-ins:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
