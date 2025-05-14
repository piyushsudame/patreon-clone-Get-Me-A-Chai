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
    
    // Get direct access to the collection
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Get all indexes on the collection
    const indexes = await collection.indexes();
    
    // Find the problematic index
    const emailIndexes = indexes.filter(index => 
      Object.keys(index.key).some(key => key.toLowerCase() === 'email')
    );
    
    // Drop all email-related indexes
    const droppedIndexes = [];
    for (const index of emailIndexes) {
      try {
        await collection.dropIndex(index.name);
        droppedIndexes.push(index.name);
      } catch (error) {
        console.error(`Error dropping index ${index.name}:`, error);
      }
    }
    
    // Create a new case-sensitive index on the lowercase email field
    let newIndexResult = null;
    try {
      newIndexResult = await collection.createIndex(
        { email: 1 }, 
        { 
          unique: true, 
          sparse: true,  // Skip documents where email is null
          collation: { locale: 'en', strength: 2 }  // Case-insensitive
        }
      );
    } catch (error) {
      console.error("Error creating new index:", error);
    }
    
    // Find and fix any users with null emails
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
      originalIndexes: indexes,
      droppedIndexes,
      newIndex: newIndexResult,
      fixedUsers,
      fixedCount: fixedUsers.length
    });
    
  } catch (error) {
    console.error("Error fixing email index:", error);
    return NextResponse.json(
      { error: 'Failed to fix email index: ' + error.message },
      { status: 500 }
    );
  }
}