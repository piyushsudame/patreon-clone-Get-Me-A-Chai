import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/user';

export async function GET(request) {
  try {
    // Only return this in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ message: 'Only available in development mode' }, { status: 403 });
    }
    
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
    }
    
    // Find users with null or empty email
    const usersWithNullEmail = await User.find({ 
      $or: [
        { email: null },
        { email: "" }
      ]
    });
    
    // Count total users
    const totalUsers = await User.countDocuments();
    
    // Return the results
    return NextResponse.json({
      success: true,
      totalUsers,
      usersWithNullEmail: usersWithNullEmail.length,
      users: usersWithNullEmail.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username
      }))
    });
    
  } catch (error) {
    console.error("Error checking database:", error);
    return NextResponse.json(
      { error: 'Failed to check database: ' + error.message },
      { status: 500 }
    );
  }
}