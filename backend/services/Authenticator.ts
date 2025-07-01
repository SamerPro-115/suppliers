import Config from '@/config';
import db from '@/db';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UTypes from './Users.types';

export interface User {
  id: number;
  name?: string;
  username: string;
  picture?: string;
  about?: string;
  type: string;
  whatsapp_number?: string;
  website_link?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function isAuthorized(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: 'No authorization token provided' });
  }

  jwt.verify(token, Config.JWTSecret, async (err, decoded) => {
    if (err || !decoded || typeof decoded !== 'object' || !decoded.id || typeof decoded.id !== 'number') {
      return res.sendStatus(401);
    }

    const user = (await db.pg.query('SELECT * FROM users where id = $1', [decoded.id])).rows[0];
    if (!user) return res.status(401).send('Unknown User');

    (req.user = user), next();
  });
}

export function isSupplier(req: Request, res: Response, next: NextFunction) {
  if (!req.user || !UTypes.isSupplier(req.user.type)) return res.sendStatus(401);
  next();
}
