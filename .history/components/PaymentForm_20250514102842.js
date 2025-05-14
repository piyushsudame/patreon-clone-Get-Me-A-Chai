'use client';

import { useState } from 'react';
import { getStripe } from '@/utils/stripe';

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
        throw new Error('Please enter your name');
      }
      
      const amountNum = Number(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Please enter a valid amount');
      }

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

      const { sessionId, error: apiError } = await response.json();
      
      if (apiError) {
        throw new Error(apiError);
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      
      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPayment = async (quickAmount) => {
    setAmount(quickAmount);
    // If name is filled, submit the form automatically
    if (name.trim()) {
      setIsLoading(true);
      setError('');
      
      try {
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

        const { sessionId, error: apiError } = await response.json();
        
        if (apiError) {
          throw new Error(apiError);
        }

        // Redirect to Stripe Checkout
        const stripe = await getStripe();
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
        
        if (stripeError) {
          throw new Error(stripeError.message);
        }
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='payment w-full bg-slate-900 rounded-lg p-6 shadow-sm h-full'>
      <h2 className='text-xl font-semibold mb-4 text-white'>Make a Payment</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
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