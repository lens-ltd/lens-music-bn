import { Router } from "express";
import authRoutes from "./authRoutes";

// ROUTER
const router = Router();

// USER ROUTES
router.use("/auth", authRoutes);

// EXPORT ROUTER
export default router;
