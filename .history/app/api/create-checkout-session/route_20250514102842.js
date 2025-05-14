import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import User from '@/models/user';
import Payment from '@/models/Payment';

export async function POST(request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = await request.json();
    const { name, message, amount, username } = body;

    // Validate input
    if (!name || !amount || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Chai for ${username}`,
              description: message ? `Message: ${message}` : 'Support with a chai',
            },
            unit_amount: amount * 100, // Convert to cents/paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/${username}?success=true&payment_id=${payment._id.toString()}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/${username}?canceled=true`,
      metadata: {
        payment_id: payment._id.toString(),
        name,
        to_user: username,
        message: message || '',
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}