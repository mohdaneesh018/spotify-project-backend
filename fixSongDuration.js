import mongoose from "mongoose";
import Song from "./model/song.model.js";
import { getAudioDurationInSeconds } from "get-audio-duration";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI =
    "mongodb+srv://mdaneesh537_db_user:sdreyhf8658@cluster0.l3hmxkk.mongodb.net/Spotify";

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        fixDurations();
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error", err);
    });

async function fixDurations() {
    try {
        const songs = await Song.find({
            $or: [
                { duration: { $exists: false } },
                { duration: 180 },
            ],
        });

        console.log(`🎵 Found ${songs.length} songs to fix`);

        const uploadsDir = path.join(__dirname, "uploads");

        for (const song of songs) {
            if (!song.audioUrl) continue;

            try {
                const fileName = song.audioUrl.split("/uploads/")[1];
                const localFilePath = path.join(uploadsDir, fileName);

                const durationInSeconds =
                    await getAudioDurationInSeconds(localFilePath);

                await Song.updateOne(
                    { _id: song._id },
                    { $set: { duration: Math.floor(durationInSeconds) } }
                );

                console.log(`✅ ${song.title} → ${Math.floor(durationInSeconds)} seconds`);

            } catch (err) {
                console.log(`❌ Failed for ${song.title}: ${err.message}`);
            }
        }

        console.log("🎉 All song durations fixed");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
}