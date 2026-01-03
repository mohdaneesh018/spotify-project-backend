import { Router } from "express";
import { getAlbums, getAllSongs, getPopularRadio, getSellerSongs, getTopSongBySeller, getSellerRadio, likeSong } from "../controllers/song.controller.js";
import Song from "../model/song.model.js";

const songRouter = Router()

songRouter.get("/get-songs", getAllSongs);
songRouter.get("/popular-radio", getPopularRadio);
songRouter.put("/like/:id", likeSong);
songRouter.get("/get-albums", getAlbums);
songRouter.get("/seller/:sellerId", getSellerSongs);
songRouter.get("/top-song/:sellerId", getTopSongBySeller);
songRouter.get("/radio/:sellerId", getSellerRadio);

songRouter.get("/:id", async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ message: "Song not found" });

        res.json(song);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

songRouter.get("/songs", async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch songs" });
    }
});

export default songRouter;