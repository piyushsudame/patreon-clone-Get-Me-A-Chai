import React from 'react'
import mongoose from 'mongoose';
import Image from 'next/image';
import User from '@/models/user';
import Payment from '@/models/Payment';
import PaymentForm from '@/components/PaymentForm';
import ToastMessages from './toast-messages';

// Set dynamic to force server-side rendering on each request
export const dynamic = 'force-dynamic';

const Username = async ({ params, searchParams }) => {
  // Extract username from params and decode URL encoding
  const resolvedParams = await params;
  let usernameParam = resolvedParams.username;
  
  // Await searchParams since it's a promise in Next.js 14+
  const resolvedSearchParams = await searchParams;
  
  // Replace hyphens with spaces and decode URL encoding
  const decodedUsername = decodeURIComponent(usernameParam.replace(/-/g, ' '));
  
  // Default images
  const defaultProfilePic = "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/aa52624d1cef47ba91c357da4a7859cf/eyJoIjozNjAsInciOjM2MH0%3D/4.gif?token-hash=azgx1FH6T0bGQdTA1e_RnurvaJeWxozUb5UkTyZfh_U%3D&token-time=1748131200";
  const defaultCoverPic = "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/452146dcfeb04f38853368f554aadde1/eyJ3IjoxNjAwLCJ3ZSI6MX0%3D/18.gif?token-hash=PII8uE5d9cF__tMhhAsgUcejp0XUEAo4wDFfuH2yPbs%3D&token-time=1748995200";
  
  // Initialize user data
  let userData = {
    name: decodedUsername,
    username: usernameParam,
    profilepic: defaultProfilePic,
    coverpic: defaultCoverPic
  };
  
  // Try to fetch user data from database
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai");
    }
    
    // Find user by username
    const user = await User.findOne({ username: usernameParam });
    
    // If user exists, update userData with database values
    if (user) {
      userData = {
        name: user.name || decodedUsername,
        username: user.username || usernameParam,
        profilepic: user.profilepic && user.profilepic.length > 0 ? user.profilepic : defaultProfilePic,
        coverpic: user.coverpic && user.coverpic.length > 0 ? user.coverpic : defaultCoverPic
      };
    }
  } catch (error) {
    // Error fetching user data
    // Continue with default data if there's an error
  }
  
  // Check for payment success or cancellation
  const paymentSuccess = resolvedSearchParams?.success === 'true';
  const paymentCanceled = resolvedSearchParams?.canceled === 'true';
  const paymentId = resolvedSearchParams?.payment_id;
  
  // Get actual payment data from database
  let paymentStats = {
    payments: 0,
    amountEarned: "₹0",
    topSupporters: []
  };
  
  try {
    console.log(`Fetching payments for user: ${usernameParam}`);
    
    // Get completed payments for this user
    const payments = await Payment.find({ 
      to_user: usernameParam,
      done: true
    }).sort({ createdAt: -1 });
    
    console.log(`Found ${payments.length} completed payments`);
    
    if (payments.length > 0) {
      // Calculate total amount
      const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
      
      // Format top supporters (sort by amount for top supporters)
      const sortedByAmount = [...payments].sort((a, b) => b.amount - a.amount);
      const topSupporters = sortedByAmount.slice(0, 10).map(payment => ({
        name: payment.name,
        amount: `₹${payment.amount.toLocaleString('en-IN')}`
      }));
      
      console.log(`Total amount: ₹${totalAmount}`);
      console.log(`Top supporters: ${topSupporters.length}`);
      
      paymentStats = {
        payments: payments.length,
        amountEarned: `₹${totalAmount.toLocaleString('en-IN')}`,
        topSupporters
      };
    } else {
      // No completed payments yet, show empty state
      console.log('No completed payments found');
      paymentStats = {
        payments: 0,
        amountEarned: "₹0",
        topSupporters: []
      };
    }
  } catch (error) {
    console.error("Error fetching payment data:", error);
    // Continue with empty data if there's an error
    paymentStats = {
      payments: 0,
      amountEarned: "₹0",
      topSupporters: []
    };
  }

  return (
    <>
    <ToastMessages />
    <div className="relative w-full pb-20">
      {/* Cover Image */}
      <div className='cover w-full bg-red-50'>
        <div className="overflow-hidden w-full relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
          <img 
            className='absolute transform -translate-x-1/2 -translate-y-1/2 h-full w-auto min-w-full object-cover' 
            src={userData.coverpic || defaultCoverPic} 
            alt={`${userData.name}'s cover`}
          />
        </div>
      </div>
      
      {/* Profile Image */}
      <div className="w-full flex justify-center">
        <div className="w-[150px] h-[150px] relative -mt-[75px] mb-[10px]">
          <div className="relative w-full h-full">
            <img 
              className='object-contain border-4 border-white rounded-full bg-white w-full h-full' 
              src={userData.profilepic || defaultProfilePic} 
              alt={`${userData.name}'s profile`}
            />
          </div>
        </div>
      </div>
      
      {/* Username */}
      <div className='info flex flex-col items-center'>
        <div className='username flex flex-col items-center text-center px-4'>
          <h1 className='text-2xl font-bold mb-2'>@{userData.username}</h1>
          <p className='text-xl mb-6'>Let';s help {userData.name} get a chai!</p>
        </div>
        
        {/* Toast notifications will handle payment status messages */}
        
        {/* Stats */}
        <div className='stats flex flex-col items-center mb-8'>
          <p className='text-lg font-medium'>{paymentStats.payments} payments</p>
          <p className='text-3xl font-bold text-white'>{paymentStats.amountEarned} raised!</p>
        </div>
        
        {/* Two-column layout for supporters and payment */}
        <div className='flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-7xl mx-auto px-4'>
          {/* Top Supporters */}
          <div className='supporters w-full md:w-1/2 max-w-[600px] bg-slate-900 rounded-lg p-6 shadow-sm h-full'>
            <h2 className='text-xl font-semibold mb-4 text-white'>Top 10 Supporters</h2>
            {paymentStats.topSupporters.length > 0 ? (
              <ul className='space-y-3'>
                {paymentStats.topSupporters.map((supporter, index) => (
                  <li key={index} className='flex justify-between items-center border-b border-slate-700 pb-2'>
                    <span className='font-medium text-white'>{supporter.name}</span>
                    <span className='text-white font-medium'>{supporter.amount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No supporters yet. Be the first to support!</p>
              </div>
            )}
          </div>
          
          {/* Make Payment - Using our new PaymentForm component */}
          <div className='w-full md:w-1/2 max-w-[600px]'>
            <PaymentForm username={userData.username} />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Username
