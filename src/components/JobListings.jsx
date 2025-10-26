import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Spinner from './Spinner'
import JobListing from './JobListing'
import { FaCircleXmark } from 'react-icons/fa6'

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortOption, setSortOption] = useState('')
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

        let result = [];
        
        if (searchTerm) {
          result = data.filter(
            (job) =>
              job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.company.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else {
          result = data;
        }

        // Apply sorting
       if (sortOption === 'asc') {
  result.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
} else if (sortOption === 'desc') {
  result.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
}


        setJobs(result);


      } catch (error) {
        console.error('Error fethcing Jobs', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [searchTerm]);

  // Extracts an average numeric salary value from strings like "$50K - $60K"
  const parseSalary = (salaryStr) => {
    if (!salaryStr) return 0;

    // Extract all numbers
    const numbers = salaryStr.match(/\d+/g);

    if (!numbers) return 0;

    // Convert to full numbers (e.g., 50 -> 50000)
    const parsed = numbers.map((n) => parseInt(n) * 1000);

    // Return average if range, or single number
    if (parsed.length === 2) {
      return (parsed[0] + parsed[1]) / 2;
    }
    return parsed[0];
  };

  useEffect(() => {
  if (jobs.length > 0) {
    const sortedJobs = [...jobs];

    if (sortOption === 'asc') {
      sortedJobs.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
    } else if (sortOption === 'desc') {
      sortedJobs.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
    }

    setJobs(sortedJobs);
  }
}, [sortOption]);

  return (
     <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? 'Recent Jobs' : 'Browse Jobs'}
        </h2>

        {/* Sort Dropdown */}
        {!isHome && (
          <div className="flex justify-end mb-6">
            <select
              className="border rounded-md px-3 py-2 text-gray-700"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort by Salary</option>
              <option value="asc">Salary: Low → High</option>
              <option value="desc">Salary: High → Low</option>
            </select>
          </div>
        )}

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