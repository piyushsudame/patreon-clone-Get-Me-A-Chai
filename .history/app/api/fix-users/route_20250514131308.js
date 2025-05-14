import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/user';

export async function GET(request) {
  try {
    // Only allow in development mode
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
    
    // Fix users with null email
    const fixedUsers = [];
    for (const user of usersWithNullEmail) {
      // Generate a unique email based on username or ID
      const uniqueEmail = `${user.username || user._id.toString()}@placeholder-email.com`;
      
      // Update the user
      user.email = uniqueEmail;
      await user.save();
      
      fixedUsers.push({
        id: user._id.toString(),
        name: user.name,
        oldEmail: null,
        newEmail: uniqueEmail
      });
    }
    
    // Return the results
    return NextResponse.json({
      success: true,
      fixedUsers,
      count: fixedUsers.length
    });
    
  } catch (error) {
    console.error("Error fixing users:", error);
    return NextResponse.json(
      { error: 'Failed to fix users: ' + error.message },
      { status: 500 }
    );
  }
}