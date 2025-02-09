import mongoose from "mongoose";



// Passward set validation for user




const UserSchema = new mongoose.Schema({
  name: String,
  createdDate: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is invalid",
    ],
  },
  password: {
    type: String,
    required: true
  }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
