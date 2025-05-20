"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PaymentHistory from '@/components/PaymentHistory'
import DynamicStripeGuide from '@/components/DynamicStripeGuide'

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    profilePicture: '',
    coverPicture: '',
    stripePublishableId: '',
    stripeSecretId: ''
  })
  
  // Form data effect
  useEffect(() => {
    // Form data updated
  }, [formData])

  // Error state
  const [errors, setErrors] = useState({})
  // Success message state
  const [successMessage, setSuccessMessage] = useState('')

  // Use useEffect for navigation instead of doing it during render
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login')
    }
    
    // Debug session data
    if (session) {
      console.log("Session data:", {
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image
      });
    }
  }, [status, router, session])

  // Populate form with user data if available
  useEffect(() => {
    const fetchUserData = async () => {
      // Check if session and user email exist
      if (!session?.user) {
        console.log("No session or user available");
        return;
      }
      
      if (!session.user.email) {
        console.error("User email is missing in session");
        // Set form data with default values
        setFormData({
          name: session.user.name || '',
          email: '',
          username: session.user.name?.replace(/\s+/g, '-').toLowerCase() || '',
          profilePicture: '',
          coverPicture: '',
          stripePublishableId: '',
          stripeSecretId: ''
        });
        return;
      }
      
      try {
        // Fetch user data from the database
        console.log("Fetching user data for:", session.user.email);
        const response = await fetch(`/api/get-user?email=${encodeURIComponent(session.user.email)}`);
        
        if (response.ok) {
          const userData = await response.json();
          if (userData.user) {
            console.log("User data retrieved successfully");
            // Create the updated form data
            const updatedFormData = {
              name: userData.user.name || session.user.name || '',
              email: userData.user.email || session.user.email || '',
              username: userData.user.username || session.user.name?.replace(/\s+/g, '-').toLowerCase() || '',
              profilePicture: userData.user.profilepic || '',
              coverPicture: userData.user.coverpic || '',
              stripePublishableId: userData.user.stripePublishableId || '',
              stripeSecretId: userData.user.stripeSecretId || ''
            };
            setFormData(updatedFormData);
            return;
          }
        } else if (response.status === 404) {
          // If user not found in database, we'll create one when saving the profile
          console.log("User not found in database, will create on save");
        } else {
          console.error("Error fetching user data:", response.status);
          const errorText = await response.text();
          console.error("Error details:", errorText);
        }
      } catch (error) {
        // Error fetching user data
        console.error("Exception fetching user data:", error);
      }
      
      // Fallback to session data if API call fails
      console.log("Using fallback data from session");
      const fallbackData = {
        name: session.user.name || '',
        email: session.user.email || '',
        username: session.user.name?.replace(/\s+/g, '-').toLowerCase() || '',
        profilePicture: '',
        coverPicture: '',
        stripePublishableId: '',
        stripeSecretId: ''
      };
      
      // Using fallback data from session
      setFormData(fallbackData);
    };
    
    if (session?.user) {
      fetchUserData();
    }
  }, [session])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    // Email validation
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    // Ensure email matches session email
    if (formData.email !== session?.user?.email) {
      newErrors.email = 'Email must match your login email'
    }
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.includes(' ')) {
      newErrors.username = 'Username cannot contain spaces'
    }
    
    // URL validations for pictures (optional fields)
    if (formData.profilePicture && !isValidUrl(formData.profilePicture)) {
      newErrors.profilePicture = 'Please enter a valid URL'
    }
    
    if (formData.coverPicture && !isValidUrl(formData.coverPicture)) {
      newErrors.coverPicture = 'Please enter a valid URL'
    }
    
    // Stripe validations
    if (formData.stripePublishableId && formData.stripePublishableId.length < 5) {
      newErrors.stripePublishableId = 'Stripe Publishable ID seems too short'
    }
    
    if (formData.stripeSecretId && formData.stripeSecretId.length < 10) {
      newErrors.stripeSecretId = 'Stripe Secret ID seems too short'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Helper function to validate URLs
  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    
    if (validateForm()) {
      try {
        // Check if email is available
        if (!session?.user?.email) {
          console.error("No email in session:", session);
          setErrors({ form: 'Email is required. Please sign in again with a valid email.' });
          return;
        }
        
        // Double check that the email is valid
        if (!/\S+@\S+\.\S+/.test(session.user.email)) {
          console.error("Invalid email in session:", session.user.email);
          setErrors({ form: 'Your session contains an invalid email. Please sign in again.' });
          return;
        }
        
        console.log("Submitting form data:", {
          name: formData.name,
          username: formData.username,
          email: session.user.email
        });
        
        // Send the data to our API endpoint
        const response = await fetch('/api/update-user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            username: formData.username,
            profilePicture: formData.profilePicture,
            coverPicture: formData.coverPicture,
            stripePublishableId: formData.stripePublishableId,
            stripeSecretId: formData.stripeSecretId
          }),
        });
        
        // Try to parse the response as JSON
        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          console.error("Error parsing JSON response:", jsonError);
          const textResponse = await response.text();
          console.error("Raw response:", textResponse);
          throw new Error('Invalid response from server');
        }
        
        if (!response.ok) {
          console.error("API error:", response.status, result);
          
          // If we get a 404, it means the user doesn't exist in the database yet
          // Let's try to create the user by making another request
          if (response.status === 404) {
            console.log("User not found, attempting to create user first");
            
            // First, try to fetch the user again to trigger user creation
            const createUserResponse = await fetch(`/api/get-user?email=${encodeURIComponent(session.user.email)}`);
            
            if (createUserResponse.ok) {
              console.log("User created successfully, retrying update");
              
              // Now try updating again
              const retryResponse = await fetch('/api/update-user', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: formData.name,
                  username: formData.username,
                  profilePicture: formData.profilePicture,
                  coverPicture: formData.coverPicture,
                  stripePublishableId: formData.stripePublishableId,
                  stripeSecretId: formData.stripeSecretId
                }),
              });
              
              let retryResult;
              try {
                retryResult = await retryResponse.json();
              } catch (jsonError) {
                const textResponse = await retryResponse.text();
                console.error("Raw retry response:", textResponse);
                throw new Error('Invalid response from server on retry');
              }
              
              if (!retryResponse.ok) {
                console.error("Retry failed:", retryResponse.status, retryResult);
                throw new Error(retryResult.error || 'Failed to update profile after user creation');
              }
              
              // If we get here, the retry was successful
              console.log("Retry successful");
              setSuccessMessage('Profile updated successfully!');
              
              // Format the username for URL and redirect
              const formattedUsername = formData.username.replace(/\s+/g, '-').toLowerCase();
              setTimeout(() => {
                router.push(`/${formattedUsername}`);
              }, 1500);
              
              return;
            } else {
              console.error("Failed to create user:", await createUserResponse.text());
              throw new Error('Failed to create user profile');
            }
          } else {
            throw new Error(result.error || 'Failed to update profile');
          }
        }
        
        // Profile updated successfully
        console.log("Profile updated successfully");
        setSuccessMessage('Profile updated successfully!');
        
        // Format the username for URL
        const formattedUsername = formData.username.replace(/\s+/g, '-').toLowerCase();
        
        // Redirect to user settings after 1.5 seconds
        setTimeout(() => {
          router.push(`/${formattedUsername}`);
        }, 1500);
      } catch (error) {
        // Error updating profile
        setErrors({ form: error.message || 'Failed to update profile. Please try again.' });
      }
    }
  }

  // While loading, show a loading state
  if (status === "loading") {
    return <div className="container mx-auto p-4">Loading...</div>
  }
  
  // If not authenticated, show minimal content while redirecting
  if (!session) {
    return <div className="container mx-auto p-4">Redirecting to login...</div>
  }

  // Format the username for URL
  const formattedUsername = session?.user?.name?.replace(/\s+/g, '-').toLowerCase()

  return (
    <>
      <div className='w-[85%] lg:w-[70%] mx-auto'>
        <h2 className='py-10 text-center text-3xl font-bold'>Welcome to your Dashboard</h2>
        
        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        
        {/* Form error */}
        {errors.form && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.form}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <form onSubmit={handleSubmit}>
              <div className='inputs bg-slate-900 p-6 rounded-lg shadow-lg mb-8'>
                <h3 className="text-xl font-semibold mb-4 text-white">Profile Settings</h3>
                
                <div className="Name flex flex-col mb-4">
                  <label htmlFor="name" className="text-sm font-medium mb-2 text-white">Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`} />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                
                <div className="Email flex flex-col mb-4">
                  <label htmlFor="email" className="text-sm font-medium mb-2 text-white">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    readOnly 
                    className={`w-full bg-slate-700 border ${errors.email ? 'border-red-500' : 'border-slate-700'} text-gray-300 rounded-lg p-2.5 focus:outline-none cursor-not-allowed`} 
                  />
                  <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="Username flex flex-col mb-4">
                  <label htmlFor="username" className="text-sm font-medium mb-2 text-white">Username</label>
                  <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className={`w-full bg-slate-800 border ${errors.username ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`} />
                  {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                </div>
                
                <div className="Profile Picture flex flex-col mb-4">
                  <label htmlFor="profilePicture" className="text-sm font-medium mb-2 text-white">Profile Picture</label>
                  <input type="text" id="profilePicture" name="profilePicture" value={formData.profilePicture} onChange={handleChange} placeholder="https://example.com/image.jpg" className={`w-full bg-slate-800 border ${errors.profilePicture ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`} />
                  {errors.profilePicture && <p className="mt-1 text-sm text-red-500">{errors.profilePicture}</p>}
                </div>
                
                <div className="Cover Picture flex flex-col mb-4">
                  <label htmlFor="coverPicture" className="text-sm font-medium mb-2 text-white">Cover Picture</label>
                  <input type="text" id="coverPicture" name="coverPicture" value={formData.coverPicture} onChange={handleChange} placeholder="https://example.com/cover.jpg" className={`w-full bg-slate-800 border ${errors.coverPicture ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`} />
                  {errors.coverPicture && <p className="mt-1 text-sm text-red-500">{errors.coverPicture}</p>}
                </div>
                
                <div className="stripe-settings mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">Stripe Payment Settings</h3>
                  <p className="text-slate-300 mb-4">
                    Connect your Stripe account to receive payments directly. Your Stripe keys allow you to process payments through your own Stripe account.
                  </p>
                  
                  {/* Import the StripeGuide component */}
                  <div className="mb-6">
                    <DynamicStripeGuide />
                  </div>
                  
                  <div className="grid gap-4 mt-4">
                    <div className="flex flex-col">
                      <label htmlFor="stripePublishableId" className="text-sm font-medium mb-2 text-white flex items-center">
                        <span>Stripe Publishable Key</span>
                        <span className="ml-2 px-2 py-0.5 bg-slate-700 rounded text-xs">Required for payments</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          id="stripePublishableId" 
                          name="stripePublishableId" 
                          value={formData.stripePublishableId} 
                          onChange={handleChange} 
                          placeholder="pk_live_..." 
                          className={`w-full bg-slate-800 border ${errors.stripePublishableId ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg p-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`} 
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-slate-400">pk_</span>
                        </div>
                      </div>
                      {errors.stripePublishableId && <p className="mt-1 text-sm text-red-500">{errors.stripePublishableId}</p>}
                    </div>
                    
                    <div className="flex flex-col">
                      <label htmlFor="stripeSecretId" className="text-sm font-medium mb-2 text-white flex items-center">
                        <span>Stripe Secret Key</span>
                        <span className="ml-2 px-2 py-0.5 bg-slate-700 rounded text-xs">Required for payments</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="password" 
                          id="stripeSecretId" 
                          name="stripeSecretId" 
                          value={formData.stripeSecretId} 
                          onChange={handleChange} 
                          placeholder="sk_live_..." 
                          className={`w-full bg-slate-800 border ${errors.stripeSecretId ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg p-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`} 
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-slate-400">sk_</span>
                        </div>
                      </div>
                      {errors.stripeSecretId && <p className="mt-1 text-sm text-red-500">{errors.stripeSecretId}</p>}
                      <p className="mt-2 text-xs text-slate-400">Your secret key is stored securely and only used to process payments to your account.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                    <button type="submit" className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-300 shadow-lg hover:shadow-blue-500/20">Save</button>
                </div>
              </div>
            </form>
          </div>
          
          <div className="lg:w-1/2">
            {formData.username && <PaymentHistory username={formData.username} />}
            
            <div className="mt-6 bg-slate-900 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Your Payment Page</h3>
              <p className="text-white mb-4">Share this link with your fans so they can buy you a chai:</p>
              <div className="flex items-center">
                <input 
                  type="text" 
                  readOnly 
                  value={`${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/${formData.username}`} 
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/${formData.username}`);
                    alert('Link copied to clipboard!');
                  }}
                  className="ml-2 bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Copy
                </button>
              </div>
              <div className="mt-4">
                <Link 
                  href={`/${formData.username}`}
                  className="inline-block text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  View Your Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
