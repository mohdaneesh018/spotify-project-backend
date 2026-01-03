import Playlist from "../model/playlist.model.js";

export const getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id)
            .populate("songs");

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePlaylist = async (req, res) => {
    try {
        const deleted = await Playlist.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        res.json({ message: "Playlist deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeSongFromPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.params;

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $pull: { songs: songId } },
            { new: true }
        );

        res.json({
            success: true,
            message: "Song removed from playlist",
            playlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove song"
        });
    }
};
