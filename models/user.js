import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Define the user schema
const userSchema = new Schema({
    name: { type: String, default: 'User' },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0 && /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    username: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: props => 'Username cannot be empty!'
        }
    },
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

// Pre-save middleware to update the updatedAt field and validate email
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    
    // Ensure email is not null or empty
    if (!this.email) {
        return next(new Error('Email is required and cannot be null or empty'));
    }
    
    // Ensure username is not null or empty
    if (!this.username) {
        this.username = `user-${Date.now()}`;
    }
    
    next();
});

export default mongoose.models.User || model("User", userSchema); 