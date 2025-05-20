import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <div className="relative mb-8">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image 
              src="/tea.gif" 
              alt="Chai Cup" 
              className="invertImg"
              fill
              priority
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-2">
            <div className="relative w-8 h-8">
              <Image src="/coin.gif" alt="Coin" fill />
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-6">About Get Me A Chai</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
          Empowering creators through community support, one chai at a time.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-8 rounded-xl backdrop-blur-sm border border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Our Mission</h2>
          <p className="mb-4 text-gray-300">
            At Get Me A Chai, we believe every creator deserves the opportunity to bring their vision to life. Our platform connects passionate creators with supportive fans who want to contribute to their success.
          </p>
          <p className="text-gray-300">
            We&apos;re building a community where creativity thrives through direct support, eliminating barriers between creators and their audience.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-800/30 p-6 rounded-lg border border-white/10 flex flex-col items-center text-center">
              <div className="relative bg-slate-400 rounded-full p-2 w-16 h-16 mb-3">
                <Image src="/man.gif" alt="Creator" fill />
              </div>
              <h3 className="font-bold mb-2">For Creators</h3>
              <p className="text-sm text-gray-300">Share your projects and receive direct support</p>
            </div>
            <div className="bg-purple-800/30 p-6 rounded-lg border border-white/10 flex flex-col items-center text-center">
              <div className="relative bg-slate-400 rounded-full p-2 w-16 h-16 mb-3">
                <Image src="/group.gif" alt="Community" fill />
              </div>
              <h3 className="font-bold mb-2">For Supporters</h3>
              <p className="text-sm text-gray-300">Directly fund the creators you love</p>
            </div>
            <div className="bg-indigo-800/30 p-6 rounded-lg border border-white/10 flex flex-col items-center text-center">
              <img src="/coin.gif" alt="Funding" className="bg-slate-400 rounded-full p-2 w-16 h-16 mb-3" />
              <h3 className="font-bold mb-2">Simple Funding</h3>
              <p className="text-sm text-gray-300">Easy, transparent support system</p>
            </div>
            <div className="bg-violet-800/30 p-6 rounded-lg border border-white/10 flex flex-col items-center text-center">
              <img src="/avatar.gif" alt="Community" className="bg-slate-400 rounded-full p-2 w-16 h-16 mb-3" />
              <h3 className="font-bold mb-2">Community</h3>
              <p className="text-sm text-gray-300">Join a network of creators and supporters</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-20">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 p-8 rounded-xl backdrop-blur-sm border border-white/10 flex flex-col items-center text-center">
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-6 text-xl font-bold">1</div>
            <h3 className="text-xl font-bold mb-4">Create Your Profile</h3>
            <p className="text-gray-300">Sign up and create your creator profile showcasing your projects and goals.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 p-8 rounded-xl backdrop-blur-sm border border-white/10 flex flex-col items-center text-center">
            <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mb-6 text-xl font-bold">2</div>
            <h3 className="text-xl font-bold mb-4">Share Your Page</h3>
            <p className="text-gray-300">Share your unique profile link with your audience across social media.</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/20 p-8 rounded-xl backdrop-blur-sm border border-white/10 flex flex-col items-center text-center">
            <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-6 text-xl font-bold">3</div>
            <h3 className="text-xl font-bold mb-4">Receive Support</h3>
            <p className="text-gray-300">Your supporters can buy you a chai, helping fund your creative projects.</p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-20">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 rounded-xl backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">✓</span>
              Transparency
            </h3>
            <p className="text-gray-300 ml-11">We believe in complete transparency in all transactions between creators and supporters.</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 rounded-xl backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">✓</span>
              Community
            </h3>
            <p className="text-gray-300 ml-11">We foster a supportive community where creators and fans can connect directly.</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 rounded-xl backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">✓</span>
              Accessibility
            </h3>
            <p className="text-gray-300 ml-11">Our platform is designed to be accessible to creators of all sizes and backgrounds.</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 rounded-xl backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">✓</span>
              Innovation
            </h3>
            <p className="text-gray-300 ml-11">We continuously improve our platform to better serve creators and their supporters.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-10 rounded-2xl backdrop-blur-sm border border-white/10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Join our community today and start receiving support for your creative projects.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/login" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-6 py-3 text-center">
            Create Your Profile
          </Link>
          <Link href="/" className="text-white bg-gradient-to-br from-blue-600 to-purple-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-6 py-3 text-center">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  )
}
