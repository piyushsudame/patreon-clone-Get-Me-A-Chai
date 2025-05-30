import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/user';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    // Get the query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const username = searchParams.get('username');
    
    // If neither email nor username is provided, return an error
    if (!email && !username) {
      return NextResponse.json(
        { error: 'Either email or username must be provided' },
        { status: 400 }
      );
    }
    
    // If email is provided, verify the user is authorized to access this data
    if (email) {
      // Get the current session to verify the user
      const session = await getServerSession(authOptions);
      
      if (!session || !session.user || !session.user.email) {
        return NextResponse.json(
          { error: 'You must be signed in to access user data by email' },
          { status: 401 }
        );
      }
      
      // Ensure the requested email matches the session user's email
      if (email !== session.user.email) {
        return NextResponse.json(
          { error: 'You can only access your own user data' },
          { status: 403 }
        );
      }
    }
    
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
    }
    
    // Find the user by email or username
    let user;
    
    // Try to find by username first if provided
    if (username) {
      user = await User.findOne({ username });
      
      // If found by username, return only public data
      if (user) {
        return NextResponse.json({
          success: true,
          user: {
            name: user.name,
            username: user.username,
            profilepic: user.profilepic,
            coverpic: user.coverpic,
            stripePublishableId: user.stripePublishableId
            // Note: We don't include stripeSecretId for username-based lookups
          }
        });
      } else {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    }
    
    // If we're here, we're looking up by email (for the logged-in user)
    // First try to find by email
    if (email) {
      user = await User.findOne({ email });
    }
    
    // If no user found and we have a null email issue, try to find users with null email
    if (!user && (!email || email === 'null')) {
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
        
        // Save the user with the new email
        await user.save();
        
        console.log("Found user with null email, updating to:", uniqueEmail);
      }
    }
    
    // If user doesn't exist in the database but exists in the session, create a new user
    if (!user) {
      // Get the session since we're creating a new user
      const session = await getServerSession(authOptions);
      
      // Ensure email is not null or empty
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required to create a user' },
          { status: 400 }
        );
      }
      
      // Create a new user with the session data
      user = new User({
        name: session?.user?.name || 'User',
        email: email, // This should never be null at this point
        username: session?.user?.name?.replace(/\s+/g, '-').toLowerCase() || `user-${Date.now()}`,
        profilepic: session?.user?.image || '',
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