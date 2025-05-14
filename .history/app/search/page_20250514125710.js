"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SearchPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(query);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Perform search when query changes
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/search-users?query=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      
      const data = await response.json();
      setSearchResults(data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL with search query
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      router.push(`/search?${params.toString()}`);
    }
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
      <h1 className="text-3xl font-bold mb-6 text-center">Search Users</h1>
      
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="search"
            className="flex-grow p-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by name, username, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto">
          {error}
        </div>
      ) : searchResults.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          <p className="mb-4 text-gray-400">Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''} matching "{query}"</p>
          <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
            <ul className="divide-y divide-slate-700">
              {searchResults.map((user) => (
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
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : query ? (
        <div className="text-center my-12 text-gray-400">
          <p className="text-xl">No users found matching "{query}"</p>
          <p className="mt-2">Try a different search term</p>
        </div>
      ) : (
        <div className="text-center my-12 text-gray-400">
          <p className="text-xl">Enter a search term to find users</p>
          <p className="mt-2">Search by name, username, or email</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;