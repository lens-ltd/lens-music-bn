import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import labelRoutes from './label.routes';

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// AUTH
router.use('/auth', authRoutes);

// USERS
router.use('/users', userRoutes);

// LABELS
router.use('/labels', labelRoutes);

// EXPORT ROUTER
export default router;
