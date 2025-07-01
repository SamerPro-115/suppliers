import db from '@/db';
import { Request, Response, NextFunction } from 'express';
import { unlinkSync } from 'fs';
import multer from 'multer';

function DEL(dest: string): (file: string) => Promise<boolean> {
  return async (file: string): Promise<boolean> => {
    const filePath = `${dest}/${file}`;
    try {
      unlinkSync(filePath);
      return true;
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      return false;
    }
  };
}

export const avatars = multer({ dest: 'public/uploads/avatars/' });
export const avatarDEL = DEL('public/uploads/avatars');
export const processAvatar = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.sendStatus(500);
  if (!req.file) return next();
  const old = req.user.picture;
  if (old) await avatarDEL(old).catch((err) => {});

  const update =
    (await db.pg.query(`UPDATE users SET picture = $1 WHERE id = $2`, [req.file.filename, req.user.id])).rowCount ?? 0;

  if (!(update > 0)) {
    return res.status(400).send('Encountered an error while processing avatar');
  }

  next();
};

export const certificates = multer({ dest: 'public/uploads/certificates/' });
export const certificateDEL = DEL('public/uploads/certificates');

export const products = multer({ dest: 'public/uploads/products/' });
export const productDEL = DEL('public/uploads/products');
