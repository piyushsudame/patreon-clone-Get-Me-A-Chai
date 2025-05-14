"use client"
import React, { useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'

const Navbar = () => {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  
  return (
    <nav className='bg-gray-900 text-white flex flex-wrap justify-between px-4 py-3 items-center relative'>
      <div className='text-lg logo font-bold flex justify-center items-center'>
        <Link className='flex justify-center items-center gap-2' href={'/'}>
          <span><img width={36} height={36} src="/tea.gif" alt="" className="invertImg min-w-[36px]" /></span>
          <span className="text-base sm:text-lg whitespace-nowrap">Get Me A Chai!</span>
        </Link>
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden flex items-center px-3 py-2 border rounded text-gray-300 border-gray-400 hover:text-white hover:border-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
        </svg>
      </button>
      
      {/* Menu items */}
      <div className={`${menuOpen ? 'block' : 'hidden'} md:flex w-full md:w-auto md:items-center mt-4 md:mt-0`}>
        {status === "loading" ? (
          <div className="animate-pulse">Loading...</div>
        ) : session ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Link href={`/${session.user.name?.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-center gap-2">
              {session.user.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "User"} 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="truncate max-w-[150px]">{session.user.name || session.user.email}</span>
            </Link>
            <Link href={'/dashboard'} className="w-full md:w-auto">
              <button type="button" className="w-full md:w-auto text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Dashboard</button>
            </Link>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full md:w-auto text-white bg-gradient-to-br from-red-500 to-pink-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link href={"/login"} className="w-full md:w-auto">
            <button type="button" className="w-full md:w-auto text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Login</button>
          </Link>
        )}
      </div>      
    </nav>
  )
}

export default Navbar
