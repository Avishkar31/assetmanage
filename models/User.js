import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  siemensId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  segment: { type: String, required: true },
  role: { type: String, enum: ["regular", "admin"], default: "regular" }
});

  userSchema.pre("save", function (next) {    
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return candidatePassword === this.password;
};

export default mongoose.models.User || mongoose.model("User", userSchema);
