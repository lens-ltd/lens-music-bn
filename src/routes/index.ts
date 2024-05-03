import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// AUTH
router.use('/auth', authRoutes);

// USER
router.use('/users', userRoutes);

// EXPORT ROUTER
export default router;
