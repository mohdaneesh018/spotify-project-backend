import Song from "../model/song.model.js";
import Artist from "../model/artist.model.js";
import Seller from "../model/seller.model.js";

// SONGS
export const getAllSongs = async (req, res) => {
    const songs = await Song.find();
    res.json(songs);
};

export const deleteSong = async (req, res) => {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: "Song deleted" });
};

// ARTISTS
export const getAllArtists = async (req, res) => {
    const artists = await Artist.find();
    res.json(artists);
};

export const deleteArtist = async (req, res) => {
    await Artist.findByIdAndDelete(req.params.id);
    res.json({ message: "Artist deleted" });
};

// SELLERS
export const getAllSellers = async (req, res) => {
    const sellers = await Seller.find();
    res.json(sellers);
};

export const deleteSeller = async (req, res) => {
    await Seller.findByIdAndDelete(req.params.id);
    res.json({ message: "Seller deleted" });
};
