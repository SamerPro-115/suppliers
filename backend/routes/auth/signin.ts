import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Password from '@/services/Password';
import Config from '@/config';
import db from '@/db';
const router = Router();

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  const user = (
    await db.pg.query<{ id: number; password_hash: string; type: string }>('SELECT * FROM users where username = $1;', [
      username
    ])
  ).rows[0];
  if (!user || !Password.compare(user.password_hash, password)) {
    return res.status(404).send('Invalid username or password');
  }

  const token = jwt.sign({ id: user.id }, Config.JWTSecret);
  res.json({ token, type: user.type });
});

export default router;
