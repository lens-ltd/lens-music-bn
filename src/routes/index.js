import { Router } from "express";
import authRoutes from "./authRoutes";
import labelRoutes from "./labelRoutes";
import artistRoutes from "./artistRoutes";

// ROUTER
const router = Router();

// USER ROUTES
router.use("/auth", authRoutes);

// LABEL ROUTES
router.use("/labels", labelRoutes);

// ARTIST ROUTES
router.use("/artists", artistRoutes);

// EXPORT ROUTER
export default router;
