"use client"
import React, { useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { notFound, useRouter } from 'next/navigation'

const Login = () => {
    const { data: session } = useSession();
    const router = useRouter();

    // Use useEffect for navigation instead of doing it during render
    useEffect(() => {
        // If the user is already logged in, redirect to dashboard page
        if (session) {
            router.push('/dashboard')
        }
    }, [session, router]);

    return (
        <div className='text-white py-14 container mx-auto'>
            <h1 className='text-center font-bold text-3xl'>Login to Get your fans to support you!</h1>

            <div className="social-login-buttons flex flex-col justify-center items-center">
                <div className="flex flex-col gap-4 p-10 rounded-lg w-80">
                    {/* Google */}
                    <button 
                        onClick={() => {
                            // Sign in with Google
                            signIn('google', { callbackUrl: '/dashboard' });
                        }}
                        className="flex justify-between items-center bg-white border border-gray-300 rounded-lg shadow-md w-full px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 48 48">
                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <path d="M9.827,24c0-1.524,0.253-2.986,0.705-4.356l-7.909-6.04C1.082,16.734,0.214,20.26,0.214,24c0,3.737,0.867,7.261,2.406,10.388l7.905-6.051C10.077,26.973,9.827,25.517,9.827,24" fill="#FBBC05" />
                                <path d="M23.714,10.133c3.311,0,6.302,1.174,8.652,3.094l6.836-6.827c-4.166-3.627-9.507-5.867-15.488-5.867c-9.287,0-17.268,5.311-21.09,13.071l7.909,6.04C12.355,14.112,17.549,10.133,23.714,10.133" fill="#EB4335" />
                                <path d="M23.714,37.867c-6.164,0-11.359-3.979-13.182-9.51l-7.909,6.038c4.822,7.761,12.803,13.072,21.09,13.072c5.732,0,11.205-2.035,15.311-5.849l-7.507-5.804c-2.118,1.334-4.786,2.052-7.804,2.052" fill="#34A853" />
                                <path d="M46.145,24c0-1.387-0.213-2.88-0.534-4.267H23.714v9.067h12.604c-0.63,3.091-2.346,5.468-4.8,7.014l7.507,5.804c4.314-4.004,7.121-9.969,7.121-17.618" fill="#4285F4" />
                            </g>
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    

                    {/* Github */}
                    <button 
                        onClick={() => {
                            // Sign in with GitHub
                            signIn('github', { callbackUrl: '/dashboard' });
                        }}
                        className="flex justify-between items-center bg-white border border-gray-300 rounded-lg shadow-md w-full px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z" fill="#000000" />
                        </svg>
                        <span>Continue with Github</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
