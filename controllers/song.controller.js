import Song from "../model/song.model.js";
import User from "../model/user.model.js";
import Seller from "../model/seller.model.js";
import mongoose from "mongoose";

/* ===================== ALL SONGS ===================== */
export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate("sellerId", "name");
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAlbums = async (req, res) => {
  try {
    const albums = await Song.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "uploadedBy",
          foreignField: "_id",
          as: "seller"
        }
      },
      {
        $addFields: {
          sellerName: { $arrayElemAt: ["$seller.name", 0] }
        }
      },
      {
        $group: {
          _id: "$uploadedBy",
          sellerName: { $first: "$sellerName" },
          songs: { $push: "$$ROOT" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json(albums);
  } catch (err) {
    console.error("GET ALBUMS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSellerSongs = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const songs = await Song.find({ uploadedBy: sellerId });

    const seller = await User.findById(sellerId);

    res.status(200).json({
      sellerName: seller.name,
      songs
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ===================== POPULAR RADIO ===================== */
export const getPopularRadio = async (req, res) => {
  try {
    const radio = await Song.aggregate([
      { $sort: { likes: -1 } },

      {
        $group: {
          _id: "$sellerId",
          topSong: { $first: "$$ROOT" }
        }
      },

      {
        $sort: { "topSong.likes": -1 }
      },

      {
        $lookup: {
          from: "sellers",          // 🔥 collection name
          localField: "_id",         // sellerId from group
          foreignField: "_id",       // sellers._id
          as: "seller"
        }
      },

      {
        $unwind: "$seller"
      },

      {
        $project: {
          _id: 1,
          seller: {
            name: "$seller.name",
            image: "$seller.image"
          },
          topSong: {
            _id: "$topSong._id",
            title: "$topSong.title",
            imageUrl: "$topSong.imageUrl",
            audioUrl: "$topSong.audioUrl",
            likes: "$topSong.likes"
          }
        }
      }
    ]);

    res.json(radio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTopSongBySeller = async (req, res) => {
  const { sellerId } = req.params;

  const song = await Song.findOne({ sellerId })
    .sort({ likes: -1 })
    .limit(1);

  res.json(song);
};

export const getSellerRadio = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid sellerId" });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const topSong = await Song.findOne({ sellerId })
      .sort({ likes: -1 });

    if (!topSong) {
      return res.status(404).json({ message: "No songs found" });
    }

    res.json({
      seller: {
        _id: seller._id,
        name: seller.name,
        image: seller.image,
      },
      topSong,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



/* ===================== LIKE SONG ===================== */
export const likeSong = async (req, res) => {
  try {
    const { id } = req.params;

    const song = await Song.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.json(song);
  } catch (err) {
    res.status(500).json({ message: "Like failed" });
  }
};
