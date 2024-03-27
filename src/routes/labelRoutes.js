import { Router } from "express";
import LabelController from "../controllers/labelController";
import { isAuthenticated } from "../middlewares/authMiddleware";

// ROUTER
const router = Router();

// CREATE LABEL
router.post("/", isAuthenticated, LabelController.createLabel);

// LIST LABELS
router.get("/", isAuthenticated, LabelController.listLabels);

// GET LABEL
router.get("/:id", isAuthenticated, LabelController.getLabel);

// DELETE LABEL
router.delete("/:id", isAuthenticated, LabelController.deleteLabel);

// UPDATE LABEL
router.patch("/:id", isAuthenticated, LabelController.updateLabel);

// EXPORT ROUTER
export default router;
