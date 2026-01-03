import Song from "../model/song.model.js";
import { getAudioDurationInSeconds } from "get-audio-duration";

export const uploadSong = async (req, res) => {
    try {
        const { title, imageUrl, artistSlug } = req.body;
        const durationInSeconds = await getAudioDurationInSeconds(req.file.path);

        if (!artistSlug) {
            return res.status(400).json({ message: "Artist is required" });
        }

        const audioUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        const song = new Song({
            title,
            imageUrl,
            audioUrl,
            artistSlug,
            duration: Math.floor(durationInSeconds),
            uploadedBy: req.user._id
        });

        await song.save();

        res.json({ success: true, song });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Upload failed" });
    }
};

export const getMySongs = async (req, res) => {
    try {
        const userId = req.user._id;

        const songs = await Song.find({ uploadedBy: userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: songs.length,
            songs,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getSingleSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        if (req.user && song.uploadedBy.toString() !== req.user._id.toString()) {
            console.warn("⚠ Unauthorized edit attempt");
        }

        res.json({ song });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateSong = async (req, res) => {
    try {
        const { title, imageUrl } = req.body;

        let updateData = { title, imageUrl };

        if (req.file) {
            updateData.audioUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const updated = await Song.findOneAndUpdate(
            { _id: req.params.id, uploadedBy: req.user._id },
            updateData,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Song not found" });
        }

        res.json({ message: "Song updated successfully", updated });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const deleteSong = async (req, res) => {
    try {
        const song = await Song.findOneAndDelete({
            _id: req.params.id,
            uploadedBy: req.user._id
        });

        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        res.json({ message: "Song deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};