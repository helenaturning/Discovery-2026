import express from 'express';
import { query } from '../db';
import { authMiddleware, supervisorOnly } from '../middleware/auth';

const router = express.Router();

// Get all active pairs
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await query(`
      SELECT p.*, 
             a.first_name as employee_a_first_name, a.last_name as employee_a_last_name,
             b.first_name as employee_b_first_name, b.last_name as employee_b_last_name,
             s.name as site_name
      FROM pairs p
      JOIN profiles a ON p.employee_a_id = a.id
      JOIN profiles b ON p.employee_b_id = b.id
      JOIN sites s ON p.site_id = s.id
      WHERE p.active = true
      ORDER BY p.created_at DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching pairs:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create pair
router.post('/', authMiddleware, supervisorOnly, async (req, res) => {
    const { employee_a_id, employee_b_id, site_id, start_date, end_date } = req.body;
    try {
        const result = await query(
            `INSERT INTO pairs (employee_a_id, employee_b_id, site_id, start_date, end_date) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [employee_a_id, employee_b_id, site_id, start_date, end_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating pair:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Deactivate pair
router.delete('/:id', authMiddleware, supervisorOnly, async (req, res) => {
    try {
        await query('UPDATE pairs SET active = false WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deactivating pair:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
