import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "seller", "admin"],
    default: "user",
  },
});

const User = mongoose.model("user", userSchema);

export default User;