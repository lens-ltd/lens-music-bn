import { Router } from "express";
import AuthController from "../controllers/AuthController";

// ROUTER
const router = Router();

// SIGNUP
router.post("/signup", AuthController.signup);

// LOGIN
router.post("/login", AuthController.login);

// EXPORT ROUTER
export default router;
