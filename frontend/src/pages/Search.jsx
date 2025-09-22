import axios from 'axios'
import React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { servalUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchData } from '../redux/userSlice'
import assets from '../assets/assets'

const Search = () => {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const searchInputRef = useRef(null)
  const cancelTokenRef = useRef(null)

  const { searchData } = useSelector(state => state.user)

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
    searchInputRef.current?.focus()
  }, [])

  // Save to recent searches
  const saveToRecent = (user) => {
    const updated = [user, ...recentSearches.filter(u => u._id !== user._id)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  // Debounce utility function
  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (searchTerm.trim().length === 0) {
        dispatch(setSearchData([]))
        setIsLoading(false)
        setHasSearched(false)
        return
      }

      if (searchTerm.trim().length < 2) {
        return // Don't search for single characters
      }

      try {
        setIsLoading(true)
        setHasSearched(true)

        // Cancel previous request if exists
        if (cancelTokenRef.current) {
          cancelTokenRef.current.cancel('Operation cancelled due to new request')
        }

        // Create new cancel token
        cancelTokenRef.current = axios.CancelToken.source()

        const result = await axios.get(
          `${servalUrl}/api/user/search?keyWord=${encodeURIComponent(searchTerm)}`,
          {
            withCredentials: true,
            cancelToken: cancelTokenRef.current.token,
            timeout: 10000 // 10 second timeout
          }
        )
        
        // console.log(result.data)
        dispatch(setSearchData(result.data || []))
      } catch (error) {
        if (!axios.isCancel(error)) {
          // console.log('Search error:', error)
          dispatch(setSearchData([]))
        }
      } finally {
        setIsLoading(false)
      }
    }, 300), // 300ms delay for faster response
    [dispatch]
  )

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    
    if (value.length === 0) {
      setIsLoading(false)
      setHasSearched(false)
      dispatch(setSearchData([]))
    } else {
      setIsLoading(true)
    }
    
    debouncedSearch(value)
  }

  // Clear search
  const handleClearSearch = () => {
    setInput("")
    setHasSearched(false)
    setIsLoading(false)
    dispatch(setSearchData([]))
    searchInputRef.current?.focus()
  }

  // Handle user click
  const handleUserClick = (user) => {
    saveToRecent(user)
    navigate(`/profile/${user.userName}`)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted')
      }
    }
  }, [])

  // User card component
  const UserCard = ({ user, isRecent = false }) => (
    <div 
      className='w-[90vw] max-w-[700px] h-[70px] rounded-xl bg-[#1a1a1a] flex items-center gap-4 px-4 mb-2 hover:bg-[#262626] transition-all duration-200 cursor-pointer border border-[#333]'
      onClick={() => handleUserClick(user)}
    >
      <div className='w-[45px] h-[45px] rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-600'>
        <img 
          src={user?.profileImage || assets.avataricon} 
          alt={user?.userName || 'User'} 
          className='w-full h-full object-cover'
          onError={(e) => {
            e.target.src = assets.avataricon
          }}
        />
      </div>
      <div className='flex-1 min-w-0'>
        <div className='text-white text-[16px] font-semibold truncate'>
          {user?.userName}
        </div>
        <div className='text-[14px] text-gray-400 truncate'>
          {user?.name}
        </div>
      </div>
      {isRecent && (
        <div className='text-gray-500 text-xs'>
          Recent
        </div>
      )}
    </div>
  )

  return (
    <div className='w-full min-h-screen bg-black flex items-center flex-col relative'>
      {/* Header */}
      <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] border-b border-[#333]'>
        <MdOutlineKeyboardBackspace
          className='text-white w-[25px] h-[25px] cursor-pointer hover:opacity-70 transition-opacity'
          onClick={() => navigate('/')}
        />
        <h1 className='text-white text-[20px] font-semibold'>Search</h1>
      </div>

      {/* Search Bar */}
      <div className='w-full h-[80px] flex items-center justify-center px-4'>
        <div className='w-[90%] max-w-[800px] h-[50px] rounded-full bg-[#0d1016] flex items-center px-5 border border-[#333] focus-within:border-[#555] transition-all duration-200'>
          <FiSearch className='w-[20px] h-[20px] text-gray-400 shrink-0'/>
          <input 
            ref={searchInputRef}
            type="text" 
            value={input} 
            placeholder='Search users...' 
            className='w-full h-full outline-0 bg-transparent text-white text-[16px] px-3' 
            onChange={handleInputChange}
            autoComplete="off"
            spellCheck="false"
          />
          {input && (
            <button
              onClick={handleClearSearch}
              className='text-gray-400 hover:text-white transition-colors p-1 ml-2'
            >
              <FiX className='w-[18px] h-[18px]'/>
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className='w-full flex-1 px-4 pb-4'>
        {/* Loading State */}
        {isLoading && (
          <div className='w-full flex justify-center py-8'>
            <div className='flex items-center gap-2'>
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              <span className='text-gray-400 text-sm'>Searching...</span>
            </div>
          </div>
        )}

        {/* Recent Searches (when no input) */}
        {!input && !isLoading && recentSearches.length > 0 && (
          <div className='w-full max-w-[700px] mx-auto'>
            <div className='flex items-center justify-between mb-4 px-2'>
              <h2 className='text-white text-[18px] font-semibold'>Recent</h2>
              <button 
                onClick={clearRecentSearches}
                className='text-blue-500 text-sm hover:text-blue-400 transition-colors'
              >
                Clear all
              </button>
            </div>
            {recentSearches.map((user) => (
              <UserCard key={user._id} user={user} isRecent={true} />
            ))}
          </div>
        )}

        {/* Search Results */}
        {
          input &&  searchData?.length > 0 && (
          <div className='w-full max-w-[700px] mx-auto'>
            {searchData.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )
        }
       

        {/* No Results */}
        {!isLoading && hasSearched && searchData?.length === 0 && input.trim().length > 0 && (
          <div className='w-full flex flex-col items-center justify-center py-16'>
            <div className='text-gray-400 text-center'>
              <FiSearch className='w-16 h-16 mx-auto mb-4 opacity-50' />
              <p className='text-lg mb-2'>No results found</p>
              <p className='text-sm'>Try searching for a different username</p>
            </div>
          </div>
        )}

        {/* Default State */}
        {!hasSearched && !input && recentSearches.length === 0 && (
          <div className='w-full flex flex-col items-center justify-center py-16'>
            <div className='text-gray-400 text-center'>
              <FiSearch className='w-16 h-16 mx-auto mb-4 opacity-50' />
              <p className='text-lg mb-2'>Search for users</p>
              <p className='text-sm'>Start typing to find people</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
