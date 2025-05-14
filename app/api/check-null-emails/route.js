import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

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
    
    // Direct MongoDB query to find documents with null email
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Find users with null email using direct MongoDB query
    const usersWithNullEmail = await collection.find({ email: null }).toArray();
    
    // Count total users
    const totalUsers = await collection.countDocuments();
    
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