import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

export const supervisorOnly = (req: Request, res: Response, next: NextFunction) => {
    if (!['supervisor', 'admin'].includes((req as any).user?.role)) {
        return res.status(403).json({ error: 'Supervisor access required' });
    }
    next();
};
