"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const UsersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    totalPages: 0,
    currentPage: page,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch users when page changes
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsers(page);
    }
  }, [page, status]);

  const fetchUsers = async (pageNum) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/get-all-users?page=${pageNum}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToPage = (pageNum) => {
    const params = new URLSearchParams();
    params.set('page', pageNum.toString());
    router.push(`/users?${params.toString()}`);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const { totalPages, currentPage } = pagination;
    const pageButtons = [];
    
    // Previous button
    pageButtons.push(
      <button
        key="prev"
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        className={`px-3 py-1 rounded-md ${
          pagination.hasPrevPage
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        Previous
      </button>
    );
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    // First page
    if (startPage > 1) {
      pageButtons.push(
        <button
          key={1}
          onClick={() => navigateToPage(1)}
          className="px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-white"
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis1" className="px-2 py-1 text-gray-400">
            ...
          </span>
        );
      }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => navigateToPage(i)}
          className={`px-3 py-1 rounded-md ${
            i === currentPage
              ? 'bg-blue-700 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="ellipsis2" className="px-2 py-1 text-gray-400">
            ...
          </span>
        );
      }
      
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => navigateToPage(totalPages)}
          className="px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-white"
        >
          {totalPages}
        </button>
      );
    }
    
    // Next button
    pageButtons.push(
      <button
        key="next"
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className={`px-3 py-1 rounded-md ${
          pagination.hasNextPage
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        Next
      </button>
    );
    
    return pageButtons;
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Users</h1>
        <Link href="/search" className="text-blue-500 hover:text-blue-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Users
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden mb-6">
            {users.length > 0 ? (
              <ul className="divide-y divide-slate-700">
                {users.map((user) => (
                  <li key={user.username} className="p-4 hover:bg-slate-800 transition-colors">
                    <Link href={`/${user.username}`} className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        {user.profilepic ? (
                          <Image 
                            src={user.profilepic} 
                            alt={user.name || user.username} 
                            width={60} 
                            height={60} 
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {(user.name || user.username || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white">{user.name || user.username}</h2>
                        <p className="text-gray-400">@{user.username}</p>
                        {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
                        <p className="text-xs text-gray-500">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-400">
                <p>No users found</p>
              </div>
            )}
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 my-6">
              {renderPagination()}
            </div>
          )}
          
          <div className="text-center text-gray-400 mt-4">
            Showing {users.length} of {pagination.totalUsers} users
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;