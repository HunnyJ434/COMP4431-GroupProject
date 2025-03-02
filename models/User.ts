// models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  bankAccount: Object, // Adjust according to your actual schema
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
