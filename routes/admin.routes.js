import express from "express";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";
import {
    getAllSongs,
    deleteSong,
    getAllArtists,
    deleteArtist,
    getAllSellers,
    deleteSeller
} from "../controllers/admin.controller.js";

const router = express.Router();

// ✅ Test dashboard route
router.get("/dashboard", auth, isAdmin, (req, res) => {
    res.json({
        message: "Welcome Admin (Backend API)",
        admin: req.user.email,
    });
});

// SONGS
router.get("/songs", auth, isAdmin, getAllSongs);
router.delete("/song/:id", auth, isAdmin, deleteSong);

// ARTISTS
router.get("/artists", auth, isAdmin, getAllArtists);
router.delete("/artist/:id", auth, isAdmin, deleteArtist);

// SELLERS
router.get("/sellers", auth, isAdmin, getAllSellers);
router.delete("/seller/:id", auth, isAdmin, deleteSeller);

export default router;
