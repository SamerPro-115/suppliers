import db from '@/db';
import { isAuthorized, isSupplier } from '@/services/Authenticator';
import { avatars, certificates, processAvatar } from '@/services/Uploads';
import UTypes from '@/services/Users.types';
import { Router } from 'express';
const router = Router();

router.use('/', isAuthorized);

const pl = 5;
router.get('/products', async (req, res) => {
  if (!req.query.page) req.query.page = '1';
  if (!req.query.size) req.query.size = String(pl);
  if (typeof req.query.page !== 'string') req.query.page = String(req.query.page);
  if (typeof req.query.size !== 'string') req.query.size = String(req.query.size);
  if (!req.user) return res.sendStatus(500);

  const page = parseInt(req.query.page || '1', 10);
  const size = parseInt(req.query.size, 10);
  const offset = (page - 1) * size;

  const count = await db.pg.query(`SELECT COUNT(*) AS products_count FROM products WHERE supplier_id = $1`, [
    req.user.id
  ]);
  const products = (
    await db.pg.query('SELECT * FROM products WHERE supplier_id = $1 ORDER BY id LIMIT $2 OFFSET $3', [
      req.user.id,
      size,
      offset
    ])
  ).rows;

  if (!products) res.sendStatus(500);
  res.status(200).send({ products, total: count.rows[0].products_count });
});

router.get('/user', async (req, res) => {
  if (!req.user) return res.sendStatus(500);
  delete (req.user as any).password_hash;
  if (UTypes.isSupplier(req.user.type)) {
    const supplier = (await db.pg.query('SELECT * FROM suppliers WHERE id = $1', [req.user.id])).rows[0];
    const certificate = (
      await db.pg.query('SELECT * FROM certificates WHERE supplier_id = $1 ORDER BY id DESC LIMIT 1', [req.user.id])
    ).rows[0];

    if (supplier) return res.send({ ...req.user, supplier: supplier, certificate: certificate ?? {} });
  }

  return res.send(req.user);
});

router.post('/user', avatars.single('avatar'), processAvatar, async (req, res) => {
  if (!req.user) return res.sendStatus(500);
  const keys = [];
  const values = [];

  if (req.body.name && typeof req.body.name === 'string' && req.body.name !== req.user.name) {
    keys.push('name');
    values.push(req.body.name);
  }

  if (req.body.username && typeof req.body.username === 'string' && req.body.username !== req.user.username) {
    req.body.username = String(req.body.username).toLowerCase();
    const existingUser = await db.pg.query('SELECT * FROM users where username = $1;', [req.body.username]);
    if ((existingUser.rowCount ?? 0) > 0) {
      return res.status(400).send('Username already exists');
    }

    keys.push('username');
    values.push(req.body.username);
  }

  if (UTypes.isSupplier(req.user.type)) {
    const sKeys = [];
    const sValues = [];

    if (req.body.about) {
      sKeys.push('about');
      sValues.push(req.body.about);
    }

    if (req.body.whatsapp_number) {
      sKeys.push('whatsapp_number');
      sValues.push(req.body.whatsapp_number);
    }

    sKeys.push('website_link');
    sValues.push(req.body.website_link ?? null);

    if (sKeys.length > 0) {
      sValues.push(req.user.id);
      const _keys = sKeys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      db.pg.query(`UPDATE suppliers SET ${_keys} WHERE id = $${sKeys.length + 1}`, sValues);
    }
  }

  if (keys.length === 0) return res.sendStatus(204);
  values.push(req.user.id);

  const _keys = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
  const update = (await db.pg.query(`UPDATE users SET ${_keys} WHERE id = $${keys.length + 1}`, values)).rowCount ?? 0;
  if (update > 0) res.sendStatus(200);
  else res.sendStatus(500);
});

router.post('/certificate', isSupplier, certificates.single('certificate'), async (req, res) => {
  if (!req.user) return res.sendStatus(500);
  if (!req.file) return res.status(400).send('Missing file "certificate"');
  const keys = [];
  const values = [];

  keys.push('supplier_id');
  values.push(req.user.id);

  keys.push('picture');
  values.push(req.file.filename);

  if (req.body.name) {
    keys.push('name');
    values.push(req.body.name);
  }

  const result = await db.insert('certificates', keys, values);
  if (!result) return res.sendStatus(500);
  res.status(200).send({ id: result, picture: req.file.path.replace(/^[^/]+/, '') });
});

router.patch('/certificate/:id', isSupplier, async (req, res) => {
  if (!req.user) return res.sendStatus(500);
  const keys = [];
  const values = [];

  if (req.body.name) {
    keys.push('name');
    values.push(req.body.name);
  }

  values.push(Number(req.params.id), req.user.id);

  const update = await db.pg.query(
    `UPDATE certificates SET ${keys.map((key, index) => `${key} = $${index + 1}`).join(', ')} 
     WHERE id = $${keys.length + 1} AND supplier_id = $${keys.length + 2}`,
    values
  );

  if (!update) return res.sendStatus(500);
  res.status(200).send({ id: update });
});

export default router;
