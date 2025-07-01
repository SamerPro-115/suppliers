import db from '@/db';
import { Router } from 'express';
const router = Router();

const pl = 3; // default page length
router.get('/reviews', async (req, res) => {
  if (isNaN(Number(req.query.page))) req.query.page = '1';
  let page = parseInt(String(req.query.page) || ('1' as string), 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  let count = parseInt(String(req.query.count) || String(pl), 10);
  if (isNaN(count) || count < 1) {
    count = pl;
  }

  const offset = (page - 1) * count;
  const reviews = (
    await db.pg.query(
      `
        SELECT 
            pc.*, 
            p.name as product_name, 
            u.username 
         FROM 
            product_comments pc 
         JOIN 
            products p ON pc.product_id = p.id 
         JOIN 
            users u ON pc.user_id = u.id 
         ORDER BY 
            pc.id DESC 
         LIMIT $1 
         OFFSET $2`,
      [count, offset]
    )
  ).rows;

  if (!reviews) return res.sendStatus(500);
  else res.status(200).send(reviews);
});

export default router;
