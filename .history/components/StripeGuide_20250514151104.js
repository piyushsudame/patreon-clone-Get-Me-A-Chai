'use client';

import { useState } from 'react';

export default function StripeGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="stripe-guide-container">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="guide-toggle-button"
      >
        {isOpen ? 'Hide Stripe Setup Guide' : 'How to Get Your Stripe API Keys'}
      </button>
      
      {isOpen && (
        <div className="guide-content">
          <div className="guide-header">
            <h2>🔐 How to Get Your Stripe API Keys</h2>
            <p className="guide-subtitle">Follow these steps to set up your Stripe account and get your API keys</p>
          </div>
          
          <div className="guide-steps">
            <div className="guide-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create a Stripe Account</h3>
                <ul>
                  <li>Go to <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer">https://dashboard.stripe.com/register</a></li>
                  <li>Sign up using your email, name, and password</li>
                  <li>Set your country and complete the initial setup</li>
                </ul>
              </div>
            </div>
            
            <div className="guide-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Business Information</h3>
                <ul>
                  <li>If Stripe asks for business details, you can:</li>
                  <li>Skip the step (if possible), or</li>
                  <li>Enter a business name and any other required information</li>
                  <li><em>Note: You can update this information later</em></li>
                </ul>
              </div>
            </div>
            
            <div className="guide-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Choose a Setup Option</h3>
                <ul>
                  <li>Stripe may ask "How do you want to start?"</li>
                  <li>Select "Skip for now" or choose any available option</li>
                  <li>This won't affect access to your API keys</li>
                </ul>
              </div>
            </div>
            
            <div className="guide-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Go to API Keys</h3>
                <ul>
                  <li>Once you're in the Stripe Dashboard:</li>
                  <li>Click "Developers" from the left sidebar</li>
                  <li>Then click "API keys"</li>
                </ul>
                <div className="image-placeholder">
                  <img 
                    src="/images/stripe-dashboard-nav.png" 
                    alt="Stripe Dashboard Navigation" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="guide-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Copy Your Keys</h3>
                <ul>
                  <li>You'll see:</li>
                  <li><strong>Publishable key</strong> (starts with pk_live_ or pk_test_)</li>
                  <li><strong>Secret key</strong> (starts with sk_live_ or sk_test_)</li>
                  <li>Click "Reveal live key token" to see the secret key</li>
                  <li>Copy and paste both keys into the corresponding fields in your profile settings</li>
                </ul>
                <div className="image-placeholder">
                  <img 
                    src="/images/stripe-api-keys.png" 
                    alt="Stripe API Keys" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="guide-warning">
            <h3>⚠️ Important Security Notice</h3>
            <p>Keep your Secret Key safe and never share it publicly. It gives full access to your Stripe account.</p>
            <p>Our application securely stores your keys and only uses them for processing payments directed to your account.</p>
          </div>
          
          <div className="guide-footer">
            <p>Need help? Contact our support team for assistance.</p>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .stripe-guide-container {
          margin: 1.5rem 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .guide-toggle-button {
          background: linear-gradient(to right, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: center;
          font-size: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .guide-toggle-button:hover {
          background: linear-gradient(to right, #4f46e5, #7c3aed);
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .guide-content {
          margin-top: 1.5rem;
          background-color: #1e293b;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid #334155;
        }
        
        .guide-header {
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          padding: 1.5rem;
          color: white;
        }
        
        .guide-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .guide-subtitle {
          margin: 0.5rem 0 0 0;
          opacity: 0.9;
          font-size: 1rem;
        }
        
        .guide-steps {
          padding: 1.5rem;
        }
        
        .guide-step {
          display: flex;
          margin-bottom: 1.5rem;
          color: #e2e8f0;
        }
        
        .step-number {
          background: linear-gradient(to bottom right, #6366f1, #8b5cf6);
          color: white;
          width: 2rem;
          height: 2rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
          margin-right: 1rem;
          margin-top: 0.25rem;
        }
        
        .step-content {
          flex: 1;
        }
        
        .step-content h3 {
          margin: 0 0 0.75rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
        }
        
        .step-content ul {
          margin: 0;
          padding-left: 1.25rem;
          line-height: 1.6;
        }
        
        .step-content li {
          margin-bottom: 0.5rem;
        }
        
        .step-content a {
          color: #93c5fd;
          text-decoration: none;
          border-bottom: 1px dotted #93c5fd;
        }
        
        .step-content a:hover {
          color: #bfdbfe;
          border-bottom: 1px solid #bfdbfe;
        }
        
        .image-placeholder {
          margin-top: 1rem;
          background-color: #334155;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid #475569;
        }
        
        .image-placeholder img {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .guide-warning {
          background-color: rgba(239, 68, 68, 0.1);
          border-left: 4px solid #ef4444;
          padding: 1rem 1.5rem;
          margin: 0 1.5rem 1.5rem 1.5rem;
          border-radius: 0.25rem;
          color: #fecaca;
        }
        
        .guide-warning h3 {
          margin: 0 0 0.75rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #fca5a5;
        }
        
        .guide-warning p {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        
        .guide-footer {
          padding: 1rem 1.5rem;
          background-color: #0f172a;
          border-top: 1px solid #334155;
          color: #94a3b8;
          font-size: 0.875rem;
          text-align: center;
        }
        
        .guide-footer p {
          margin: 0;
        }
      `}</style>
    </div>
  );
}