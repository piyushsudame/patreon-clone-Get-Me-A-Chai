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
        { error: 'You must be signed in to view users' },
        { status: 401 }
      );
    }
    
    // Get pagination parameters from the URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Validate pagination parameters
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 && limit <= 50 ? limit : 10;
    
    // Calculate skip value for pagination
    const skip = (validPage - 1) * validLimit;
    
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
    }
    
    // Get total count of users for pagination
    const totalUsers = await User.countDocuments();
    
    // Get users with pagination
    const users = await User.find()
      .select('name username email profilepic createdAt')
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(validLimit);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / validLimit);
    
    // Return the users with pagination info
    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        name: user.name,
        username: user.username,
        email: user.email,
        profilepic: user.profilepic,
        createdAt: user.createdAt
      })),
      pagination: {
        totalUsers,
        totalPages,
        currentPage: validPage,
        limit: validLimit,
        hasNextPage: validPage < totalPages,
        hasPrevPage: validPage > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}