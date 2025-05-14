import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Payment from '@/models/Payment';

export async function GET(request) {
  try {
    // Get payment ID and redirect URL from query params
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');
    const redirectTo = searchParams.get('redirect_to') || '/';

    if (!paymentId) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${redirectTo}?error=missing_payment_id`);
    }

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
    }

    // Mark payment as done
    await Payment.findByIdAndUpdate(paymentId, {
      done: true,
      oid: `manual_${Date.now()}` // Generate a temporary ID for manual completion
    });

    console.log(`Payment ${paymentId} marked as done`);

    // Redirect back to the original page with success parameter
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${redirectTo}?success=true`);
  } catch (error) {
    console.error('Error processing payment success:', error);
    
    // Redirect with error
    const redirectTo = new URL(request.url).searchParams.get('redirect_to') || '/';
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${redirectTo}?error=payment_processing`);
  }
}