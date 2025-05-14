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
    
    // Direct MongoDB query to find and update documents with null email
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Find users with null email
    const usersWithNullEmail = await collection.find({ email: null }).toArray();
    
    // Update each user with a unique email
    const fixedUsers = [];
    for (const user of usersWithNullEmail) {
      const uniqueEmail = `user-${user._id.toString()}@placeholder-email.com`;
      
      // Update the user
      await collection.updateOne(
        { _id: user._id },
        { $set: { email: uniqueEmail } }
      );
      
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