import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

// Register
router.post('/register', async (req, res) => {
    const { email, password, firstName, lastName, employeeId, company, role, department, securityQuestion, securityAnswer } = req.body;

    try {
        // Check if user exists
        const userExists = await query('SELECT * FROM profiles WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const securityAnswerHash = securityAnswer ? await bcrypt.hash(securityAnswer, salt) : null;

        // Start transaction
        await query('BEGIN');

        // Create user
        const userResult = await query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
            [email, passwordHash]
        );
        const userId = userResult.rows[0].id;

        // Create profile
        await query(
            `INSERT INTO profiles (
        id, email, first_name, last_name, employee_id, company, role, department, 
        security_question, security_answer_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [userId, email, firstName, lastName, employeeId, company, role, department, securityQuestion, securityAnswerHash]
        );

        await query('COMMIT');

        const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            token,
            user: { id: userId, email, firstName, lastName, role }
        });
    } catch (error) {
        await query('ROLLBACK');
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await query('SELECT u.id, u.password_hash, p.role, p.first_name, p.last_name FROM users u JOIN profiles p ON u.id = p.id WHERE u.email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

export default router;
