import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    otp: {
      type: String,
    },
    otpExpire: {
      type: Date,
    },
    photo: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    cartData: {
      type: Object,
      default: {},
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    coins: {
      type: Number,
      default: 0
    }
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;