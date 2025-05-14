"use client"
import React from 'react'
import { SessionProvider } from "next-auth/react"

const SessionWrapper = ({children}) => {
  return (
    <SessionProvider 
      // Adding session configuration options
      options={{
        staleTime: 0, // Time in seconds after which the session is considered stale
        refetchInterval: 5 * 60, // Refetch session every 5 minutes
        refetchOnWindowFocus: true, // Refetch when window gets focus
        clientMaxAge: 0 // Force a session refresh on client side
      }}
    >
      {children}
    </SessionProvider>
  )
}

export default SessionWrapper
