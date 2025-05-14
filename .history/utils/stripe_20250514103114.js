import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe instance once and reuse it
let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Stripe publishable key is missing');
      throw new Error('Stripe configuration error');
    }
    console.log('Initializing Stripe with key prefix:', key.substring(0, 7));
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};