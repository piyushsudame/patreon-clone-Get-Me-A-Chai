import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Payment from '@/models/Payment';

export async function GET(request) {
  // Only return this in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'Only available in development mode' }, { status: 403 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 });
    }
    
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
    }
    
    // Get all payments for this user
    const allPayments = await Payment.find({ to_user: username });
    
    // Get completed payments
    const completedPayments = await Payment.find({ 
      to_user: username,
      done: true
    });
    
    // Get pending payments
    const pendingPayments = await Payment.find({ 
      to_user: username,
      done: false
    });
    
    // Calculate total amount
    const totalAmount = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return NextResponse.json({
      username,
      totalPayments: allPayments.length,
      completedPayments: completedPayments.length,
      pendingPayments: pendingPayments.length,
      totalAmount,
      recentPayments: allPayments.slice(0, 5).map(p => ({
        id: p._id.toString(),
        name: p.name,
        amount: p.amount,
        done: p.done,
        createdAt: p.createdAt,
        oid: p.oid
      }))
    });
  } catch (error) {
    console.error('Error checking payments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}