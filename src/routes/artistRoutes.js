import { Router } from "express";
import multer from "multer";
import ArtistController from "../controllers/artistController";
import { isAuthenticated } from "../middlewares/authMiddleware";

// ROUTER
const router = Router();

// CREATE ARTIST
router.post("/", isAuthenticated, multer().single('file'), ArtistController.createArtist);

// LIST ARTISTS
router.get("/", isAuthenticated, ArtistController.listArtists);

// GET ARTIST
router.get("/:id", isAuthenticated, ArtistController.getArtist);

// DELETE ARTIST
router.delete("/:id", isAuthenticated, ArtistController.deleteArtist);

// UPDATE ARTIST
router.patch("/:id", isAuthenticated, multer().single('file'), ArtistController.updateArtist);

// EXPORT ROUTER
export default router;
