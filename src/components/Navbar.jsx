import React from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import { FaSearch } from 'react-icons/fa'
import { useState, useEffect } from 'react'


const Navbar = () => {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect (() => {
      const query = new URLSearchParams(location.search)
      const termFromURL = query.get('search') || ''
      setSearchTerm(termFromURL)
    }, [location.search])


    // 1. Debounce Logic using useEffect 
    useEffect (() => {
      const timer = setTimeout(() => {
        setDebouncedTerm(searchTerm); // only update after 500ms of no typing
      }, 500);

      // Cleanup: cancel the timer if user types again before 500ms
      return () => clearTimeout(timer);
    }, [searchTerm]);

    //2. Actual search logic runs only after debounce delay
    useEffect (() => {
      const trimmed = debouncedTerm.trim()

      if (trimmed === '') {
        //if search is cleared, go back to /jobs
        if (location.pathname === '/jobs') {
          navigate('/jobs')
        }
        return
      } 

        // Navigate to /jobs?search=value
      navigate(`/jobs?search=${encodeURIComponent(trimmed)}`)
    }, [debouncedTerm])

    const linkClass = ({ isActive }) =>
        isActive
        ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
        : 'text-white hover:bg-gray-900 hiver:text-white rounded-md px-3 py-2';

  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div
            className="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
          >
            
            <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
              <img
                className="h-10 w-auto"
                src={logo}
                alt="React Jobs"
              />
              <span className="hidden md:block text-white text-2xl font-bold ml-2"
                >React Jobs
            </span>
            </NavLink>
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <NavLink
                  to="/"
                  className={linkClass}
                  >Home
                </NavLink>
                <NavLink
                  to="/jobs"
                  className={linkClass}
                  >Jobs
                </NavLink>
                <NavLink
                  to="/add-job"
                  className={linkClass}
                  >Add Job
                </NavLink>
                <NavLink
                  to="/favorite-jobs"
                  className={linkClass}
                  >Favorites
                </NavLink>

                {/* Search Form */}
                <form
                  className="relative hidden sm:block"
                >
                  <input
                    type="text" 
                    placeholder="type here to search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900"
                  />

                  <button
                    className="absolute right-0 top-0 mt-1 mr-2 text-gray-500 hover:text-gray-700"
                  >
                    <FaSearch />
                  </button>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar