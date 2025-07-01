import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Password from '@/services/Password';
import Config from '@/config';
import db from '@/db';
import UTypes from '@/services/Users.types';
const router = Router();

router.post('/signup', async (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password) return res.sendStatus(400);
  const type = (req.body.type as string | undefined)?.toUpperCase();
  const existingUser = await db.pg.query('SELECT * FROM users where username = $1;', [username]);
  if ((existingUser.rowCount ?? 0) > 0) {
    return res.status(400).send('Username already exists');
  }

  req.body.username = String(req.body.username).toLowerCase();

  const hash = Password.hash(password);
  const keys = ['username', 'password_hash'];
  const values = [username, hash];
  if (name && typeof name === 'string') {
    keys.push('name');
    values.push(name);
  }

  if (UTypes.isValid(type)) {
    const missing = UTypes.enoughInfo(req.body);
    if (missing.length !== 0) {
      return res.status(400).send(`Missing properties for Type:${type}: {${missing.join(', ')}}`);
    }

    keys.push('type');
    values.push(type);
  }

  await db
    .insert('users', keys, values)
    .then(async (id) => {
      if (id) {
        const token = jwt.sign({ id }, Config.JWTSecret);
        if (keys.includes('type')) {
          await UTypes.handleCreation(type as string, { ...req.body, id });
        }

        res.status(200).json({ token });
      } else {
        res.sendStatus(500);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

export default router;
