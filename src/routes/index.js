import { Router } from "express";
import authRoutes from "./authRoutes";
import labelRoutes from "./labelRoutes";

// ROUTER
const router = Router();

// USER ROUTES
router.use("/auth", authRoutes);

// LABEL ROUTES
router.use("/labels", labelRoutes);

// EXPORT ROUTER
export default router;
