"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Handle clicks outside the search component to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        resultsRef.current && 
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search-users?query=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      
      const data = await response.json();
      setSearchResults(data.users || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchQuery.trim().length >= 2) {
      setShowResults(true);
    }
  };

  return (
    <div className="relative">
      <div className="relative" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          className="block w-full p-2 pl-10 text-sm bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="w-4 h-4 border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {showResults && searchResults.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute z-10 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          <ul className="py-2">
            {searchResults.map((user) => (
              <li key={user.username} className="px-4 py-2 hover:bg-slate-800">
                <Link href={`/${user.username}`} className="flex items-center" onClick={() => setShowResults(false)}>
                  <div className="flex-shrink-0 mr-3">
                    {user.profilepic ? (
                      <Image 
                        src={user.profilepic} 
                        alt={user.name || user.username} 
                        width={40} 
                        height={40} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {(user.name || user.username || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{user.name || user.username}</p>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {showResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && !isLoading && (
        <div 
          ref={resultsRef}
          className="absolute z-10 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-lg"
        >
          <div className="px-4 py-3 text-sm text-gray-400">
            No users found matching &quot;{searchQuery}&quot;
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;