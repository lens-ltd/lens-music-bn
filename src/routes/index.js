import { Router } from "express";
import userRoutes from "./userRoutes";

// ROUTER
const router = Router();

// USER ROUTES
router.use("/users", userRoutes);

// EXPORT ROUTER
export default router;
