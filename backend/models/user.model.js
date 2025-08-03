import mongoose, { Model } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
); //createdAt, updatedAt

const User = mongoose.model("User", userSchema);
//in above line, it must be model (models and Model will be wrong). secondly it must be User with capital U and singular. mongoDB will automatically create a collection named users.

export default User;
