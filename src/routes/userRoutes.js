import { Router } from "express";
import UserController from "../controllers/userController";

// ROUTER
const router = Router();

// SIGNUP
router.post("/signup", UserController.signup);

// LOGIN
router.post("/login", UserController.login);

// EXPORT ROUTER
export default router;
