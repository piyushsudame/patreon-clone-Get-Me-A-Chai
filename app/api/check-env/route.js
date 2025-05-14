import { NextResponse } from 'next/server';

export async function GET() {
  // Only return this in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'Only available in development mode' }, { status: 403 });
  }
  
  // Check if Stripe keys are set
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
  
  return NextResponse.json({
    stripePublishableKeySet: stripePublishableKey.length > 0,
    stripeSecretKeySet: stripeSecretKey.length > 0,
    stripePublishableKeyPrefix: stripePublishableKey.substring(0, 7),
    stripeSecretKeyPrefix: stripeSecretKey.substring(0, 7),
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextPublicAppUrl: process.env.NEXT_PUBLIC_APP_URL,
    mongoDbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
  });
}