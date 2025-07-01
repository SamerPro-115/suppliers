import { Router } from 'express';
import signup from './auth/signup';
import signin from './auth/signin';
import profile from './settings';
import product from './product';
import misc from './misc.routes';
import top from './top.routes';
const router = Router();

// -- Auth
router.use('/auth', signup);
router.use('/auth', signin);

// -- Settings
router.use('/settings', profile);

// -- Products
router.use('/product', product);

// -- Misc
router.use('/', misc);
router.use('/top', top);

export default router;
