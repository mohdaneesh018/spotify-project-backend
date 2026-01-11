import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import mainRouter from "./routes/index.js";
import sellerRoutes from "./routes/seller.routes.js";
import artistRoutes from "./routes/artist.routes.js";
import songRoutes from "./routes/song.routes.js";
import playlistRoutes from "./routes/playlist.routes.js"; 
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();


app.set("trust proxy", 1);


app.use(cors({
    // origin: "http://localhost:5173",
    origin: ["https://awdiz-project.vercel.app", "http://localhost:5173"],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use("/api", mainRouter);
app.use("/api/seller", sellerRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/artists", artistRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/admin", adminRoutes);


mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Hello Aneesh, Database is Connected.");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
