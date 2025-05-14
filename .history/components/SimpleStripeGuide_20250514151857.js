'use client';

import { useState } from 'react';

export default function SimpleStripeGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-700 text-white py-3 px-4 text-left font-medium hover:bg-slate-600 transition"
        type="button"
      >
        {isOpen ? '▼ Hide Stripe Setup Guide' : '▶ How to Get Your Stripe API Keys'}
      </button>
      
      {isOpen && (
        <div className="p-4 text-white">
          <h3 className="text-lg font-semibold mb-3">Getting Your Stripe API Keys</h3>
          
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <p><strong>Create a Stripe Account</strong></p>
              <p className="text-slate-300">Go to <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://dashboard.stripe.com/register</a> and sign up.</p>
            </li>
            
            <li>
              <p><strong>Go to API Keys</strong></p>
              <p className="text-slate-300">In the Stripe Dashboard, click "Developers" from the left sidebar, then click "API keys".</p>
            </li>
            
            <li>
              <p><strong>Copy Your Keys</strong></p>
              <p className="text-slate-300">You'll see your Publishable key (starts with pk_) and Secret key (starts with sk_). Click "Reveal live key token" to see the secret key.</p>
            </li>
            
            <li>
              <p><strong>Add Keys to Your Profile</strong></p>
              <p className="text-slate-300">Copy and paste both keys into the fields below.</p>
            </li>
          </ol>
          
          <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md">
            <p className="text-red-300 font-medium">⚠️ Important: Keep your Secret Key safe and never share it publicly.</p>
          </div>
        </div>
      )}
    </div>
  );
}