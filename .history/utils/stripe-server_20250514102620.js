import Stripe from 'stripe';

// Initialize Stripe with the secret key
let stripe;

export const getStripeInstance = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
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