"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

  // Error state
  const [errors, setErrors] = useState({})
  // Success message state
  const [successMessage, setSuccessMessage] = useState('')

  // Use useEffect for navigation instead of doing it during render
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login')
    }
  }, [status, router])

  // Populate form with user data if available
  useEffect(() => {
    if (session?.user) {
      setFormData(prevData => ({
        ...prevData,
        name: session.user.name || '',
        email: session.user.email || '',
        username: session.user.name?.replace(/\s+/g, '-').toLowerCase() || ''
      }))
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
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
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
        // Here you would typically send the data to your API
        // For now, we'll just simulate a successful update
        console.log('Form data submitted:', formData)
        
        // Show success message
        setSuccessMessage('Profile updated successfully! Redirecting... ')
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          const formattedUsername = formData.username.replace()
        }, 1500)
      } catch (error) {
        console.error('Error updating profile:', error)
        setErrors({ form: 'Failed to update profile. Please try again.' })
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
      <div className='w-[85%] lg:w-[40%] mx-auto'>
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
        
        <form onSubmit={handleSubmit}>
          <div className='inputs bg-slate-900 p-6 rounded-lg shadow-lg mb-8'>
            <div className="Name flex flex-col mb-4">
              <label htmlFor="name" className="text-sm font-medium mb-2 text-white">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`} />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="Email flex flex-col mb-4">
              <label htmlFor="email" className="text-sm font-medium mb-2 text-white">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`} />
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
            
            <div className="Stripe Publishable Id flex flex-col mb-4">
              <label htmlFor="stripePublishableId" className="text-sm font-medium mb-2 text-white">Stripe Publishable Id</label>
              <input type="text" id="stripePublishableId" name="stripePublishableId" value={formData.stripePublishableId} onChange={handleChange} className={`w-full bg-slate-800 border ${errors.stripePublishableId ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`} />
              {errors.stripePublishableId && <p className="mt-1 text-sm text-red-500">{errors.stripePublishableId}</p>}
            </div>
            
            <div className="Stripe Secret Id flex flex-col mb-4">
              <label htmlFor="stripeSecretId" className="text-sm font-medium mb-2 text-white">Stripe Secret Id</label>
              <input type="password" id="stripeSecretId" name="stripeSecretId" value={formData.stripeSecretId} onChange={handleChange} className={`w-full bg-slate-800 border ${errors.stripeSecretId ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`} />
              {errors.stripeSecretId && <p className="mt-1 text-sm text-red-500">{errors.stripeSecretId}</p>}
            </div>
            
            <div className="mt-6">
                <button type="submit" className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-300 shadow-lg hover:shadow-blue-500/20">Save</button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Dashboard
