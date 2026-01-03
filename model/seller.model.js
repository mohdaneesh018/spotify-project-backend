import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: String,
  image: String,
});

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;