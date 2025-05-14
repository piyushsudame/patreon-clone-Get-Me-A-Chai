import Stripe from 'stripe';

// Store Stripe instances by key
const stripeInstances = new Map();

export const getStripeInstance = (secretKey = null) => {
  // Try to use the provided secret key, otherwise fall back to the global one
  const key = secretKey || process.env.STRIPE_SECRET_KEY;
  
  if (!key) {
    throw new Error('Stripe secret key is missing');
  }
  
  // Check if we already have an instance for this key
  if (!stripeInstances.has(key)) {
    stripeInstances.set(key, new Stripe(key, {
      apiVersion: '2023-10-16',
    }));
  }
  
  return stripeInstances.get(key);
};

// Retrieve a payment by ID
export const retrievePayment = async (paymentIntentId) => {
  const stripe = getStripeInstance();
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};

// Create a payment intent
export const createPaymentIntent = async ({ amount, currency = 'inr', metadata = {} }) => {
  const stripe = getStripeInstance();
  return await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
  });
};

// Retrieve a checkout session
export const retrieveCheckoutSession = async (sessionId) => {
  const stripe = getStripeInstance();
  return await stripe.checkout.sessions.retrieve(sessionId);
};

// List payments for a customer
export const listPayments = async (customerId, limit = 10) => {
  const stripe = getStripeInstance();
  return await stripe.paymentIntents.list({
    customer: customerId,
    limit,
  });
};