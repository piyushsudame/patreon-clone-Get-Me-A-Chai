import React from 'react'
import mongoose from 'mongoose';
import User from '@/models/user';
import Payment from '@/models/Payment';

const Username = async ({ params }) => {
  // Extract username from params and decode URL encoding
  let usernameParam = params.username;
  
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
        profilepic: user.profilepic || defaultProfilePic,
        coverpic: user.coverpic || defaultCoverPic
      };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Continue with default data if there's an error
  }
  
  // Dummy data for UI (in a real app, this would come from the database)
  const dummyData = {
    payments: 128,
    amountEarned: "₹12,480",
    topSupporters: [
      { name: "John Doe", amount: "₹1,200" },
      { name: "Jane Smith", amount: "₹980" },
      { name: "Alex Johnson", amount: "₹750" },
      { name: "Sarah Williams", amount: "₹600" },
      { name: "Michael Brown", amount: "₹550" },
      { name: "Emily Davis", amount: "₹500" },
      { name: "David Miller", amount: "₹450" },
      { name: "Olivia Wilson", amount: "₹400" },
      { name: "James Taylor", amount: "₹350" },
      { name: "Sophia Anderson", amount: "₹950" }
    ]
  }

  return (
    <>
    
    <div className="relative w-full pb-20">
      {/* Cover Image */}
      <div className='cover w-full bg-red-50'>
        <div className="overflow-hidden w-full relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
          <img 
            className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-auto min-w-full' 
            src={userData.coverpic} 
            alt={`${userData.name}'s cover`} 
          />
        </div>
      </div>
      
      {/* Profile Image */}
      <div className="w-full flex justify-center">
        <div className="w-[150px] h-[150px] relative -mt-[75px] mb-[10px]">
          <img 
            className='object-contain border-4 border-white rounded-full w-full h-full bg-white' 
            src={userData.profilepic} 
            alt={`${userData.name}'s profile`} 
          />
        </div>
      </div>
      
      {/* Username */}
      <div className='info flex flex-col items-center'>
        <div className='username flex flex-col items-center text-center px-4'>
          <h1 className='text-2xl font-bold mb-2'>@{userData.username}</h1>
          <p className='text-xl mb-6'>Let's help {userData.name} get a chai!</p>
        </div>
        
        {/* Stats */}
        <div className='stats flex flex-col items-center mb-8'>
          <p className='text-lg font-medium'>{dummyData.payments} payments</p>
          <p className='text-3xl font-bold text-white'>{dummyData.amountEarned} raised!</p>
        </div>
        
        {/* Two-column layout for supporters and payment */}
        <div className='flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-7xl mx-auto px-4'>
          {/* Top Supporters */}
          <div className='supporters w-full md:w-1/2 max-w-[600px] bg-slate-900 rounded-lg p-6 shadow-sm h-full'>
            <h2 className='text-xl font-semibold mb-4 text-white'>Top 10 Supporters</h2>
            <ul className='space-y-3'>
              {dummyData.topSupporters.map((supporter, index) => (
                <li key={index} className='flex justify-between items-center border-b border-slate-700 pb-2'>
                  <span className='font-medium text-white'>{supporter.name}</span>
                  <span className='text-white font-medium'>{supporter.amount}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Make Payment */}
          <div className='payment w-full md:w-1/2 max-w-[600px] bg-slate-900 rounded-lg p-6 shadow-sm md:h-[528px]'>
            <h2 className='text-xl font-semibold mb-4 text-white'>Make a Payment</h2>
            <div className='space-y-4'>
              {/* Input fields */}
              <div className='space-y-3'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium mb-2 text-white'>Enter Name</label>
                  <input 
                    type='text' 
                    id='name' 
                    className='w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-500'
                    placeholder='Your name'
                  />
                </div>
                
                <div>
                  <label htmlFor='message' className='block text-sm font-medium mb-2 text-white'>Enter Message</label>
                  <textarea 
                    id='message' 
                    rows={2} 
                    className='w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-500'
                    placeholder='Write a message...'
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor='amount' className='block text-sm font-medium mb-2 text-white'>Enter Amount (₹)</label>
                  <input 
                    type='number' 
                    id='amount' 
                    className='w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-500'
                    placeholder='Amount in ₹'
                  />
                </div>
              </div>
              
              {/* Pay button */}
              <button type="button" className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Pay</button>
              
              {/* Quick payment buttons */}
              <div className='flex flex-wrap gap-3 mt-4'>
                <button className='flex-1 bg-slate-800 text-white rounded-lg py-2 px-4 font-medium hover:bg-slate-950 transition'>
                  Pay ₹10
                </button>
                <button className='flex-1 bg-slate-800 text-white rounded-lg py-2 px-4 font-medium hover:bg-slate-950 transition'>
                  Pay ₹20
                </button>
                <button className='flex-1 bg-slate-800 text-white rounded-lg py-2 px-4 font-medium hover:bg-slate-950 transition'>
                  Pay ₹30
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Username
