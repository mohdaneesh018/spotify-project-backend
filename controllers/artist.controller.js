import Artist from "../model/artist.model.js";
import Song from "../model/song.model.js";

export const getArtistBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const artist = await Artist.findOne({ slug });
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const songs = await Song.find({ artistSlug: slug }).sort({ createdAt: -1 });

        const totalDuration = songs.reduce(
            (sum, song) => sum + (song.duration || 0),
            0
        );

        res.json({
            _id: artist._id,
            name: artist.name,
            image: artist.image,
            songs,
            totalDuration,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
