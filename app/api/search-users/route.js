import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/user';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    // Get the current session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to search users' },
        { status: 401 }
      );
    }
    
    // Get the search query from the URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
    }
    
    // Create a search regex for case-insensitive partial matching
    const searchRegex = new RegExp(query, 'i');
    
    // Search for users matching the query in name, username, or email
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { username: searchRegex },
        { email: searchRegex }
      ]
    }).select('name username email profilepic'); // Only select necessary fields
    
    // Return the search results
    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        name: user.name,
        username: user.username,
        email: user.email,
        profilepic: user.profilepic
      }))
    });
    
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}