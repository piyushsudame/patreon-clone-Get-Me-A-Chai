'use client';

import { useState } from 'react';
import { getStripe } from '@/utils/stripe';
import { toast } from 'react-toastify';

export default function PaymentForm({ username }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!name.trim()) {
        toast.error('Please enter your name');
        throw new Error('Please enter your name');
      }
      
      const amountNum = Number(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        toast.error('Please enter a valid amount');
        throw new Error('Please enter a valid amount');
      }
      
      console.log('Submitting payment:', {
        name,
        message,
        amount: amountNum,
        username
      });

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          message,
          amount: amountNum,
          username,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data);
        toast.error(data.message || data.error || 'Failed to create checkout session');
        throw new Error(data.message || data.error || 'Failed to create checkout session');
      }
      
      toast.info('Redirecting to payment page...');
      
      const { sessionId } = data;

      // Redirect to Stripe Checkout
      try {
        console.log('Redirecting to Stripe checkout with session ID:', sessionId);
        
        // First, fetch the user's Stripe publishable key
        const userResponse = await fetch(`/api/get-user?username=${username}`);
        const userData = await userResponse.json();
        
        // Use the user's publishable key if available, otherwise fall back to the global one
        const userPublishableKey = userData.user?.stripePublishableId || null;
        const stripe = await getStripe(userPublishableKey);
        
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
        
        if (stripeError) {
          console.error('Stripe redirect error:', stripeError);
          toast.error(`Stripe error: ${stripeError.message}`);
          throw new Error(stripeError.message);
        }
      } catch (stripeError) {
        console.error('Error during Stripe redirect:', stripeError);
        throw new Error(`Stripe checkout error: ${stripeError.message}`);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPayment = async (quickAmount) => {
    console.log('Quick payment clicked:', quickAmount);
    setAmount(quickAmount);
    // If name is filled, submit the form automatically
    if (name.trim()) {
      console.log('Name is filled, proceeding with quick payment');
      setIsLoading(true);
      setError('');
      
      try {
        console.log('Submitting quick payment:', {
          name,
          message,
          amount: quickAmount,
          username
        });
        // Create checkout session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            message,
            amount: quickAmount,
            username,
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('API Error:', data);
          throw new Error(data.message || data.error || 'Failed to create checkout session');
        }
        
        const { sessionId } = data;

        // Redirect to Stripe Checkout
        try {
          console.log('Redirecting to Stripe checkout with session ID:', sessionId);
          
          // First, fetch the user's Stripe publishable key
          const userResponse = await fetch(`/api/get-user?username=${username}`);
          const userData = await userResponse.json();
          
          // Use the user's publishable key if available, otherwise fall back to the global one
          const userPublishableKey = userData.user?.stripePublishableId || null;
          const stripe = await getStripe(userPublishableKey);
          
          const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
          
          if (stripeError) {
            console.error('Stripe redirect error:', stripeError);
            throw new Error(stripeError.message);
          }
        } catch (stripeError) {
          console.error('Error during Stripe redirect:', stripeError);
          throw new Error(`Stripe checkout error: ${stripeError.message}`);
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='payment w-full bg-slate-900 rounded-lg p-6 shadow-sm h-full'>
      <h2 className='text-xl font-semibold mb-4 text-white'>Make a Payment</h2>
      
      {/* Toast notifications will handle errors */}
      
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-3'>
          <div>
            <label htmlFor='name' className='block text-sm font-medium mb-2 text-white'>Enter Name</label>
            <input 
              type='text' 
              id='name' 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-500'
              placeholder='Your name'
              required
            />
          </div>
          
          <div>
            <label htmlFor='message' className='block text-sm font-medium mb-2 text-white'>Enter Message</label>
            <textarea 
              id='message' 
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-500'
              placeholder='Write a message...'
            ></textarea>
          </div>
          
          <div>
            <label htmlFor='amount' className='block text-sm font-medium mb-2 text-white'>Enter Amount (₹)</label>
            <input 
              type='number' 
              id='amount' 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className='w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-500'
              placeholder='Amount in ₹'
              required
            />
          </div>
        </div>
        
        {/* Pay button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          {isLoading ? 'Processing...' : 'Pay'}
        </button>
      </form>
      
      {/* Quick payment buttons */}
      <div className='flex flex-wrap gap-3 mt-4'>
        <button 
          onClick={() => handleQuickPayment(10)}
          className='flex-1 bg-slate-800 text-white rounded-lg py-2 px-4 font-medium hover:bg-slate-950 transition'
        >
          Pay ₹10
        </button>
        <button 
          onClick={() => handleQuickPayment(20)}
          className='flex-1 bg-slate-800 text-white rounded-lg py-2 px-4 font-medium hover:bg-slate-950 transition'
        >
          Pay ₹20
        </button>
        <button 
          onClick={() => handleQuickPayment(30)}
          className='flex-1 bg-slate-800 text-white rounded-lg py-2 px-4 font-medium hover:bg-slate-950 transition'
        >
          Pay ₹30
        </button>
      </div>
    </div>
  );
}