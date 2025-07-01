import db from '@/db';
import { Router } from 'express';
const router = Router();

const productsMap = new Map<number, any>();
const productCommentsMap = new Map<number, number>();
const fetchProductCommentsCount = async () => {
  const result = await db.pg.query(
    'SELECT product_id, COUNT(*) AS comment_count FROM product_comments GROUP BY product_id'
  );

  result.rows.forEach(async (row: any) => {
    productsMap.set(
      row.product_id,
      (await db.pg.query('SELECT * FROM products where id = $1', [Number(row.product_id)])).rows[0]
    );
    productCommentsMap.set(row.product_id, Number(row.comment_count));
  });
};

const getTopProducts = async (page: number, size: number) => {
  const sortedProducts = Array.from(productCommentsMap.entries()).sort((a, b) => b[1] - a[1]);
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  return sortedProducts.slice(startIndex, endIndex).map(([productId, _]) => productId);
};

(function updateProductCommentsCount() {
  const clean = setInterval(() => {
    if (db.ready) {
      fetchProductCommentsCount(); // Initial fetch
      clearInterval(clean);
    }
  }, 3_000);

  setInterval(fetchProductCommentsCount, 6 * 60 * 60 * 1000);
})();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const size = parseInt(req.query.size as string) || 3;
  const topProductIDS = await getTopProducts(page, size);
  const topProducts = [] as any[];

  topProductIDS.forEach((id) => topProducts.push(productsMap.get(id)));

  res.json({ products: topProducts, total: productsMap.size });
});

export default router;
