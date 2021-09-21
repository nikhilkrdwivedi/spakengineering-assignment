import mongoose from "mongoose";

const userTokensScheme = new mongoose.Schema({
    userId: { type: String, trim: true, required: true },
    tokens: [{ type: String, trim: true, required: true }],
}, { timestamps: true });

export default mongoose.model(`user-tokens`, userTokensScheme, `user-tokens`);