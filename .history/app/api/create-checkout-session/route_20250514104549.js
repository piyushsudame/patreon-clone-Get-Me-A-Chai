import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import User from '@/models/user';
import Payment from '@/models/Payment';

export async function POST(request) {
  try {
    // Check if Stripe key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key is missing');
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      );
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16', // Use a specific API version
    });
    
    const body = await request.json();
    console.log('Request body:', body);
    const { name, message, amount, username } = body;

    // Validate input
    if (!name || !amount || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB if not already connected
    try {
      if (mongoose.connection.readyState !== 1) {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
        console.log('MongoDB connected successfully');
      }
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection error', message: dbError.message },
        { status: 500 }
      );
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create a new payment record (initially marked as not done)
    const payment = new Payment({
      name,
      to_user: username,
      message: message || '',
      amount,
      oid: 'pending', // Will be updated after successful payment
      done: false
    });
    await payment.save();

    // Create Stripe checkout session
    console.log('Creating Stripe checkout session...');
    
    // Prepare session parameters
    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Chai for ${username}`,
              description: message ? `Message: ${message}` : 'Support with a chai',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents/paise and ensure it's an integer
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payment-success?payment_id=${payment._id.toString()}&redirect_to=${encodeURIComponent(`/${username}`)}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${username}?canceled=true`,
      metadata: {
        payment_id: payment._id.toString(),
        name,
        to_user: username,
        message: message || '',
      },
    };
    
    console.log('Session params:', JSON.stringify(sessionParams, null, 2));
    
    try {
      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log('Stripe session created:', session.id);
      return NextResponse.json({ sessionId: session.id });
    } catch (stripeError) {
      console.error('Stripe session creation error:', stripeError);
      
      // Delete the payment record since the session creation failed
      await Payment.findByIdAndDelete(payment._id);
      
      return NextResponse.json(
        { 
          error: 'Stripe checkout session creation failed', 
          message: stripeError.message 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    // Return more detailed error information for debugging
    return NextResponse.json(
      { 
        error: 'Error creating checkout session', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}