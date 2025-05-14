import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Payment from '@/models/Payment';

export async function GET(request) {
  try {
    // Get username from query params
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
    }

    // Find payments for the specified user
    const payments = await Payment.find({ 
      to_user: username,
      done: true
    }).sort({ createdAt: -1 });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Error fetching payments' },
      { status: 500 }
    );
  }
}