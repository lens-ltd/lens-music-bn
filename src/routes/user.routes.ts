import { Router } from "express";
import { UserController } from "../controllers/user.contoller";

// CREATE ROUTER
const router = Router();

/**
 * ROUTES
 */

// DELETE USER
router.delete("/:id", UserController.deleteUser);

// EXPORT ROUTER
export default router;
