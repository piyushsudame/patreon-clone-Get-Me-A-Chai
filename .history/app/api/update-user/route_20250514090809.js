import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/user';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function PUT(request) {
  try {
    // Get the current session to verify the user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'You must be signed in to update your profile' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const data = await request.json();
    
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
    }
    
    // Find the user by email
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update user fields
    if (data.name) user.name = data.name;
    if (data.username) user.username = data.username;
    
    // Handle profile picture and cover picture updates
    // These fields should be updated even if they're empty strings
    user.profilepic = data.profilePicture;
    user.coverpic = data.coverPicture;
    
    if (data.stripePublishableId) user.stripePublishableId = data.stripePublishableId;
    if (data.stripeSecretId) user.stripeSecretId = data.stripeSecretId;
    
    // Update user data in database
    
    // Save the updated user
    await user.save();
    
    // Return the updated user
    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
        profilepic: user.profilepic,
        coverpic: user.coverpic,
        stripePublishableId: user.stripePublishableId,
        stripeSecretId: user.stripeSecretId
      }
    });
    
  } catch (error) {
    // Error updating user
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}