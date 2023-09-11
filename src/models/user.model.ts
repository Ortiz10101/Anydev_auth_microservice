import mongoose, { Schema } from "mongoose";

const userSchema: Schema = new Schema(
  {
    name: { type: String, require: true, lowercase: true },
    lastname: { type: String, require: true, lowercase: true },
    email: { type: String, require: true, unique: true, lowercase: true },
    password: { type: String },
    salt: { type: String },
  },
  { collection: "user" }
);

export default mongoose.model("User", userSchema);
