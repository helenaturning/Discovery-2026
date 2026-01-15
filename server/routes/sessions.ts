import express from 'express';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get active session for logged-in employee
router.get('/active', authMiddleware, async (req, res) => {
    const userId = (req as any).user.id;
    try {
        const result = await query(
            `SELECT s.*, st.name as site_name, st.address as site_address
       FROM sessions s
       JOIN sites st ON s.site_id = st.id
       WHERE s.employee_id = $1 AND s.end_time IS NULL
       LIMIT 1`,
            [userId]
        );
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error('Error fetching active session:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start a session
router.post('/', authMiddleware, async (req, res) => {
    const { site_id, pair_id } = req.body;
    const userId = (req as any).user.id;

    try {
        // Check if there's already an active session
        const activeCheck = await query('SELECT id FROM sessions WHERE employee_id = $1 AND end_time IS NULL', [userId]);
        if (activeCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Session already active' });
        }

        const result = await query(
            `INSERT INTO sessions (employee_id, site_id, pair_id, status) 
       VALUES ($1, $2, $3, 'present') RETURNING *`,
            [userId, site_id, pair_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error starting session:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// End a session
router.post('/:id/end', authMiddleware, async (req, res) => {
    const sessionId = req.params.id;
    const userId = (req as any).user.id;

    try {
        const sessionResult = await query('SELECT start_time FROM sessions WHERE id = $1 AND employee_id = $2', [sessionId, userId]);
        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found or unauthorized' });
        }

        const startTime = new Date(sessionResult.rows[0].start_time);
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000); // minutes

        const result = await query(
            `UPDATE sessions SET 
        end_time = $1, 
        status = 'absent',
        total_duration = $2
       WHERE id = $3 RETURNING *`,
            [endTime, duration, sessionId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
