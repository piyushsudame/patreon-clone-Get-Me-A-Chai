import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/user';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    // Get the current session to verify the user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'You must be signed in to access user data' },
        { status: 401 }
      );
    }
    
    // Get the email from the query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    // Ensure the requested email matches the session user's email
    if (email !== session.user.email) {
      return NextResponse.json(
        { error: 'You can only access your own user data' },
        { status: 403 }
      );
    }
    
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
    }
    
    // Find the user by email
    let user = await User.findOne({ email });
    
    // If user doesn't exist in the database but exists in the session, create a new user
    if (!user) {
      // Ensure email is not null or empty
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required to create a user' },
          { status: 400 }
        );
      }
      
      // Create a new user with the session data
      user = new User({
        name: session.user.name || 'User',
        email: email, // This should never be null at this point
        username: session.user.name?.replace(/\s+/g, '-').toLowerCase() || `user-${Date.now()}`,
        profilepic: session.user.image || '',
        coverpic: ''
      });
      
      try {
        await user.save();
        console.log("New user created successfully in get-user API:", email);
      } catch (error) {
        console.error("Error creating new user:", error);
        return NextResponse.json(
          { error: 'Failed to create user: ' + error.message },
          { status: 500 }
        );
      }
    }
    
    // Return the user data
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
    // Error fetching user
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}