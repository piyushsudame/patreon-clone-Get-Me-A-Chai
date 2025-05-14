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
    let user;
    
    // First try to find by email
    if (session.user.email) {
      user = await User.findOne({ email: session.user.email });
    }
    
    // If no user found and we have a null email issue, try to find users with null email
    if (!user && (!session.user.email || session.user.email === 'null')) {
      // This is a special case to handle users with null emails
      const usersWithNullEmail = await User.find({ 
        $or: [
          { email: null },
          { email: "" }
        ]
      });
      
      if (usersWithNullEmail.length > 0) {
        // Use the first user with null email
        user = usersWithNullEmail[0];
        
        // Update the user's email to a placeholder
        const uniqueEmail = `user-${Date.now()}@placeholder-email.com`;
        user.email = uniqueEmail;
        
        // Update the session email
        session.user.email = uniqueEmail;
        
        console.log("Found user with null email, updating to:", uniqueEmail);
      }
    }
    
    // If user doesn't exist in the database but exists in the session, create a new user
    if (!user) {
      // Ensure email is not null or empty
      if (!session.user.email) {
        return NextResponse.json(
          { error: 'Email is required to create a user' },
          { status: 400 }
        );
      }
      
      // Create a new user with the session data
      user = new User({
        name: session.user.name || 'User',
        email: session.user.email, // This should never be null at this point
        username: session.user.name?.replace(/\s+/g, '-').toLowerCase() || `user-${Date.now()}`,
        profilepic: session.user.image || '',
        coverpic: ''
      });
      
      try {
        await user.save();
        console.log("New user created successfully in update-user API:", session.user.email);
      } catch (error) {
        console.error("Error creating new user in update-user:", error);
        return NextResponse.json(
          { error: 'Failed to create user: ' + error.message },
          { status: 500 }
        );
      }
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