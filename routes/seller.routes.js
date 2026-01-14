import express from "express";
import multer from "multer";
import path from "path";
import { auth, isSeller } from "../middlewares/auth.middleware.js";
import { deleteSong, getMySongs, getSingleSong, updateSong, uploadSong } from "../controllers/seller.controller.js";
import Song from "../model/song.model.js";

const router = express.Router();
const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.post("/upload-song", auth, isSeller, upload.single("audio"), uploadSong);

router.get("/my-songs", auth, isSeller, getMySongs);

router.get("/song/:id", auth, isSeller, getSingleSong);

router.put("/update-song/:id", auth, isSeller, ingle("audio"), updateSong);

router.put("/increase-play/:id", auth, isSeller, async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ error: "Song not found" });

        song.plays += 1;
        await song.save();

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed" });
    }
});

router.put("/like-song/:id", auth, isSeller, async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ error: "Song not found" });

        song.likes += 1;
        await song.save();

        res.json({ success: true, likes: song.likes });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed" });
    }
});

router.get("/get-song/:id", async (req, res) => {
    try {
        const song = await Song.findById(req.params.id).populate("uploadedBy");
        res.json(song);
    } catch (err) {
        res.status(500).send("Error fetching song");
    }
});

router.delete("/delete-song/:id", auth, isSeller, deleteSong);

export default router;
