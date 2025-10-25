import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Spinner from './Spinner'
import JobListing from './JobListing'
import { FaCircleXmark } from 'react-icons/fa6'

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation();

  // Here Joblisting reads the query in the URL 
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get("search");

  useEffect (() => {
    const fetchJobs = async () => {
      const apiUrl = isHome
        ? '/api/jobs?_limit=3'
        : '/api/jobs';
      try {
        const res = await fetch(apiUrl)
        const data = await res.json()

        if(searchTerm) {
          const filtered = data.filter(
            (job) =>
              job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.company.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setJobs(filtered);
        } else {
          setJobs(data)
        }
      } catch (error) {
        console.error('Error fethcing Jobs', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [searchTerm]);

  return (
     <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? 'Recent Jobs' : 'Browse Jobs'}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Spinner loading={loading} />
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobListing key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg mt-10">
            ❌ No results found
            {searchTerm && (
              <>
                {' '}for "<span className="font-semibold text-indigo-600">{searchTerm}</span>"
              </>
            )}
          </p>
        )}
      </div>
    </section>
  )
}

export default JobListings