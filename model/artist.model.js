import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    name: String,
    slug: { type: String, unique: true },
    image: String,
});

const Artist = mongoose.model("Artist", artistSchema);

export default Artist; 