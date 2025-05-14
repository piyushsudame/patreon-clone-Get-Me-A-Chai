import { loadStripe } from '@stripe/stripe-js';

// Store Stripe instances by key
const stripeInstances = new Map();

export const getStripe = async (userPublishableKey = null) => {
  // Try to use the user's publishable key if provided
  const key = userPublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!key) {
    console.error('Stripe publishable key is missing');
    throw new Error('Stripe configuration error');
  }
  
  // Check if we already have an instance for this key
  if (!stripeInstances.has(key)) {
    console.log('Initializing Stripe with key prefix:', key.substring(0, 7));
    stripeInstances.set(key, await loadStripe(key));
  }
  
  return stripeInstances.get(key);
};