import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  // Only return this in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'Only available in development mode' }, { status: 403 });
  }
  
  try {
    // Check MongoDB connection
    const connectionState = mongoose.connection.readyState;
    let connectionStatus;
    
    switch (connectionState) {
      case 0:
        connectionStatus = 'Disconnected';
        break;
      case 1:
        connectionStatus = 'Connected';
        break;
      case 2:
        connectionStatus = 'Connecting';
        break;
      case 3:
        connectionStatus = 'Disconnecting';
        break;
      default:
        connectionStatus = 'Unknown';
    }
    
    // If not connected, try to connect
    if (connectionState !== 1) {
      try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
        connectionStatus = 'Connected now';
      } catch (error) {
        return NextResponse.json({
          connectionStatus,
          error: error.message,
          mongoDbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
        });
      }
    }
    
    return NextResponse.json({
      connectionStatus,
      mongoDbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}