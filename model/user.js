import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    phone: { type: String, trim: true, required: true },
    countryCode: { type: String, trim: true, required: true },
}, { _id: false });

const userScheme = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    address: { type: String, trim: true, default: null },
    gender: { type: String, trim: true, enum:['FEMALE','MALE','OTHER' ], default: 'OTHER' },
    contact: contactSchema,
}, { timestamps: true });

userScheme.index({ 'contactNo.phone' : 1, 'contactNo.countryCode': 1 }, { unique: true });

export default mongoose.model(`user`, userScheme, `user`);