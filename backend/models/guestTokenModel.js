import mongoose from "mongoose";

const guestTokenSchema = new mongoose.Schema({
    fcmToken: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const guestTokenModel = mongoose.models.guestToken || mongoose.model("guestToken", guestTokenSchema);

export default guestTokenModel;
