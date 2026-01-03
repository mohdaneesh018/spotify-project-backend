import { Router } from "express";
import Playlist from "../model/playlist.model.js";
import { deletePlaylist, getPlaylistById, removeSongFromPlaylist } from "../controllers/playlist.controller.js";

const router = Router();

router.post("/create", async (req, res) => {
    const { name } = req.body;
    const playlist = await Playlist.create({ name, songs: [] });
    res.json(playlist);
});

router.get("/", async (req, res) => {
    const playlists = await Playlist.find();
    res.json(playlists);
});

router.post("/:playlistId/add/:songId", async (req, res) => {
    const { playlistId, songId } = req.params;
    await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { songs: songId } }
    );
    res.json({ success: true });
});

router.get("/:id", getPlaylistById);
router.delete("/delete/:id", deletePlaylist);

router.post("/:playlistId/add/:songId", async (req, res) => {
    const { playlistId, songId } = req.params;

    await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { songs: songId } }
    );

    res.json({ success: true });
});

router.put("/reorder/:id", async (req, res) => {
    await Playlist.findByIdAndUpdate(req.params.id, {
        songs: req.body.songs
    });
    res.json({ success: true });
});

router.delete(
    "/:playlistId/remove/:songId",
    removeSongFromPlaylist
);

export default router;