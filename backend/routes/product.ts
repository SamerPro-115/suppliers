import db from '@/db';
import { isAuthorized, isSupplier, User } from '@/services/Authenticator';
import { productDEL, products } from '@/services/Uploads';
import { Router } from 'express';

const router = Router();
const routesToSkip = ['search', 'all'];

const ableToControlProduct = (user: User, product: any): boolean => product.supplier_id === user.id;

router.use('/:id', async (req, res, next) => {
  if (routesToSkip.includes(req.params.id)) return next();
  if (isNaN(Number(req.params.id)) || Number(req.params.id) < 0) return res.status(400).send('Invalid id');
  const product = (await db.pg.query('SELECT * FROM products where id = $1', [Number(req.params.id)])).rows[0];
  if (!product) return res.status(404).send("Product doesn't exist");
  (req as any).product = product;
  next();
});

router.delete('/:id', isAuthorized, isSupplier, async (req, res) => {
  if (!req.user) return res.sendStatus(500);
  if (!ableToControlProduct(req.user, (req as any).product)) return res.sendStatus(401);

  const deletion =
    (await db.pg.query('DELETE FROM products WHERE id = $1 AND supplier_id = $2', [Number(req.params.id), req.user.id]))
      .rowCount ?? -1;

  if (deletion > 0) res.sendStatus(200);
  else res.sendStatus(500);
});

router.patch('/:id', isAuthorized, isSupplier, products.single('picture'), async (req, res) => {
  if (!req.user) return res.sendStatus(500);
  if (!ableToControlProduct(req.user, (req as any).product)) return res.sendStatus(401);
  const keys = [];
  const values = [] as any[];

  const old = (req as any).product.picture;
  if (old && req.file) await productDEL(old).catch((err) => {});

  if (req.body.name) {
    keys.push('name');
    values.push(req.body.name);
  }

  if (req.body.price) {
    keys.push('price');
    values.push(req.body.price);
  }

  if (req.file) {
    keys.push('picture');
    values.push(req.file.filename);
  }

  if (req.body.description) {
    keys.push('description');
    values.push(req.body.description);
  }

  if (req.body.quantity) {
    keys.push('quantity');
    values.push(Number(req.body.quantity));
  }

  values.push(Number(req.params.id), req.user.id);

  const update = await db.pg.query(
    `UPDATE products SET ${keys.map((key, index) => `${key} = $${index + 1}`).join(', ')} 
    WHERE id = $${keys.length + 1} AND supplier_id = $${keys.length + 2}`,
    values
  );

  if (update.rowCount ?? -1 > 0) res.sendStatus(200);
  else res.sendStatus(500);
});

router.post('/', isAuthorized, isSupplier, products.single('picture'), async (req, res) => {
  if (!req.user) return res.sendStatus(500);
  const keys = [] as string[];
  const values = [] as any[];

  if (!req.body.name) return res.status(400).send('Missing key "name"');
  if (!req.body.price) return res.status(400).send('Missing key "price"');

  keys.push('supplier_id');
  values.push(req.user.id);

  keys.push('name');
  values.push(req.body.name);

  keys.push('price');
  values.push(req.body.price);

  if (req.body.quantity) {
    keys.push('quantity');
    values.push(Number(req.body.quantity));
  }

  if (req.file) {
    keys.push('picture');
    values.push(req.file.filename);
  }

  if (req.body.description) {
    keys.push('description');
    values.push(req.body.description);
  }

  const result = await db.insert('products', keys, values);
  if (!result) res.sendStatus(400);
  res.status(200).send({ id: result });
});

router.post('/:id/comment', isAuthorized, async (req, res) => {
  if (!req.user) return res.sendStatus(500);
  if (isNaN(Number(req.params.id)) || Number(req.params.id) < 0) return res.status(400).send('Invalid id');
  const keys = [] as string[];
  const values = [] as any[];

  if (!req.body.comment) return res.status(400).send('Missing key "comment"');

  keys.push('product_id');
  values.push(req.params.id);

  keys.push('user_id');
  values.push(req.user.id);

  keys.push('comment');
  values.push(req.body.comment);

  const result = await db.insert('product_comments', keys, values);
  if (!result) res.sendStatus(400);
  res.status(200).send({ id: result });
});

// -- GET

const pl = 5; // page length
router.get('/', async (req, res) => {
  if (!req.query.page) req.query.page = '1';
  if (!req.query.size) req.query.size = String(pl);
  if (typeof req.query.page !== 'string') req.query.page = String(req.query.page);
  if (typeof req.query.size !== 'string') req.query.size = String(req.query.size);

  const page = parseInt(req.query.page || '1', 10);
  const size = parseInt(req.query.size, 10);
  const offset = (page - 1) * size;

  const count = await db.pg.query(`SELECT COUNT(*) AS products_count FROM products`);
  const products = (await db.pg.query('SELECT * FROM products ORDER BY id DESC LIMIT $1 OFFSET $2', [size, offset]))
    .rows;

  if (!products) res.sendStatus(500);
  res.status(200).send({ products, total: count.rows[0].products_count });
});

router.get('/all', async (req, res) => {
  if (!req.query.page) req.query.page = '1';
  if (!req.query.size) req.query.size = String(pl);
  if (typeof req.query.page !== 'string') req.query.page = String(req.query.page);
  if (typeof req.query.size !== 'string') req.query.size = String(req.query.size);

  const page = parseInt(req.query.page || '1', 10);
  const size = parseInt(req.query.size, 10);
  const offset = (page - 1) * size;

  const count = await db.pg.query(`SELECT COUNT(*) AS products_count FROM products`);
  const products = (await db.pg.query('SELECT * FROM products ORDER BY name DESC LIMIT $1 OFFSET $2', [size, offset]))
    .rows;

  if (!products) res.sendStatus(500);
  res.status(200).send({ products, total: count.rows[0].products_count });
});

router.get('/search', async (req, res) => {
  if (!req.query.q || req.query.q.length === 0) return res.sendStatus(400);
  const query = `%${req.query.q}%`;

  const result = (await db.pg.query('SELECT * FROM products WHERE name ILIKE $1 LIMIT $2', [query, pl])).rows;

  if (!result) res.sendStatus(404);
  res.status(200).send(result);
});

router.get('/:id', async (req, res) => {
  const supplier = (await db.pg.query('SELECT * FROM suppliers WHERE id = $1', [(req as any).product.supplier_id]))
    .rows[0];
  const certificate = (
    await db.pg.query('SELECT * FROM certificates WHERE supplier_id = $1 ORDER BY id DESC LIMIT 1', [
      (req as any).product.supplier_id
    ])
  ).rows[0];

  if (supplier) delete supplier.password;
  res.status(200).send({ ...(req as any).product, supplier: supplier ?? {}, certificate: certificate ?? {} });
});

router.get('/:id/comments', async (req, res) => {
  if (!req.query.page) req.query.page = '1';
  if (typeof req.query.page !== 'string') req.query.page = String(req.query.page);
  const product_id = (req as any).product.id;
  const page = parseInt(req.query.page || '1', 10);
  const offset = (page - 1) * pl;

  const comments = (
    await db.pg.query(
      `SELECT pc.*, u.username 
      FROM product_comments pc
      JOIN public.users u ON pc.user_id = u.id
      WHERE pc.product_id = $1 
      ORDER BY pc.created_at DESC 
      LIMIT $2 OFFSET $3`,
      [product_id, pl, offset]
    )
  ).rows;

  if (!comments) res.sendStatus(500);
  res.status(200).send(comments);
});

export default router;
