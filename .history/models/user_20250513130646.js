import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Define the user schema
const userSchema = new Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    profilepic: { type: String, default: '' },
    coverpic: { type: String, default: '' },
    stripePublishableId: { type: String, default: '' },
    stripeSecretId: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    // Add timestamps option to automatically update the updatedAt field
    timestamps: true
});

// Pre-save middleware to update the updatedAt field
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.User || model("User", userSchema); 