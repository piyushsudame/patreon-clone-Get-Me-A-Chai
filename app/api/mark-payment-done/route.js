import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Payment from '@/models/Payment';

export async function GET(request) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'Only available in development mode' }, { status: 403 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');
    
    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID parameter is required' }, { status: 400 });
    }
    
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
    }
    
    // Find the payment
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    
    // Mark as done
    payment.done = true;
    payment.oid = payment.oid || `manual_${Date.now()}`;
    await payment.save();
    
    return NextResponse.json({
      message: 'Payment marked as done',
      payment: {
        id: payment._id.toString(),
        name: payment.name,
        to_user: payment.to_user,
        amount: payment.amount,
        done: payment.done,
        oid: payment.oid
      }
    });
  } catch (error) {
    console.error('Error marking payment as done:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}