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

                    {/* LinkedIn */}
                    <button className="flex justify-between items-center bg-white border border-gray-300 rounded-lg shadow-md w-full px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z" fill="#007EBB" />
                        </svg>
                        <span>Continue with LinkedIn</span>
                    </button>

                    {/* Twitter */}
                    <button 
                        onClick={() => {
                            // Sign in with Twitter
                            signIn('twitter', { callbackUrl: '/dashboard' });
                        }}
                        className="flex justify-between items-center bg-white border border-gray-300 rounded-lg shadow-md w-full px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M22,5.8a8.6,8.6,0,0,1-2.36.65,4.07,4.07,0,0,0,1.8-2.27,8.1,8.1,0,0,1-2.6,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07,4.09,4.09,0,0,0,1.82,3.41,4.05,4.05,0,0,1-1.86-.51v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z" fill="#00AAEC" />
                        </svg>
                        <span>Continue with Twitter</span>
                    </button>

                    {/* Facebook */}
                    <button 
                        onClick={() => {
                            // Sign in with Facebook
                            signIn('facebook', { callbackUrl: '/dashboard' });
                        }}
                        className="flex justify-between items-center bg-white border border-gray-300 rounded-lg shadow-md w-full px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M20.9,2H3.1A1.1,1.1,0,0,0,2,3.1V20.9A1.1,1.1,0,0,0,3.1,22h9.58V14.25h-2.6v-3h2.6V9a3.64,3.64,0,0,1,3.88-4,20.26,20.26,0,0,1,2.33.12v2.7H17.3c-1.26,0-1.5.6-1.5,1.47v1.93h3l-.39,3H15.8V22h5.1A1.1,1.1,0,0,0,22,20.9V3.1A1.1,1.1,0,0,0,20.9,2Z" fill="#4460A0" />
                        </svg>
                        <span>Continue with Facebook</span>
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

                    {/* Apple */}
                    <button className="flex justify-between items-center bg-white border border-gray-300 rounded-lg shadow-md w-full px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M17.05,12.04c-0.03-2.89,2.35-4.27,2.46-4.34c-1.34-1.96-3.43-2.23-4.17-2.26c-1.76-0.18-3.46,1.04-4.36,1.04 c-0.91,0-2.3-1.02-3.79-0.99C5.23,5.52,3.51,6.57,2.58,8.2C0.66,11.51,2.07,16.39,3.93,19.08c0.92,1.34,2.01,2.83,3.44,2.77 c1.39-0.06,1.91-0.89,3.59-0.89c1.67,0,2.14,0.89,3.61,0.86c1.49-0.03,2.44-1.35,3.35-2.7c1.07-1.54,1.5-3.05,1.52-3.13 C19.4,15.98,17.08,14.37,17.05,12.04z M14.69,4.7c0.75-0.92,1.26-2.19,1.12-3.47c-1.08,0.05-2.43,0.73-3.2,1.63 c-0.69,0.8-1.3,2.1-1.14,3.33C12.66,6.27,13.92,5.62,14.69,4.7z" fill="#000000" />
                        </svg>
                        <span>Continue with Apple</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
