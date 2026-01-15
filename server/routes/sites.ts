import express from 'express';
import { query } from '../db';
import { authMiddleware, supervisorOnly } from '../middleware/auth';

const router = express.Router();

// Get all sites
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM sites WHERE active = true ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sites:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get sites by supervisor
router.get('/supervisor/:id', authMiddleware, async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM sites WHERE supervisor_id = $1 AND active = true ORDER BY name',
            [req.params.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching supervisor sites:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create site
router.post('/', authMiddleware, supervisorOnly, async (req, res) => {
    const { name, address, city, latitude, longitude, radius, supervisor_id } = req.body;
    try {
        const result = await query(
            `INSERT INTO sites (name, address, city, latitude, longitude, radius, supervisor_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, address, city, latitude, longitude, radius || 100, supervisor_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating site:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update site
router.put('/:id', authMiddleware, supervisorOnly, async (req, res) => {
    const { name, address, city, latitude, longitude, radius, supervisor_id, active } = req.body;
    try {
        const result = await query(
            `UPDATE sites SET 
        name = COALESCE($1, name), 
        address = COALESCE($2, address), 
        city = COALESCE($3, city), 
        latitude = COALESCE($4, latitude), 
        longitude = COALESCE($5, longitude), 
        radius = COALESCE($6, radius), 
        supervisor_id = COALESCE($7, supervisor_id),
        active = COALESCE($8, active)
       WHERE id = $9 RETURNING *`,
            [name, address, city, latitude, longitude, radius, supervisor_id, active, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Site not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating site:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
