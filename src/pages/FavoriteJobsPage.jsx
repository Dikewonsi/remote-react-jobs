import React from 'react'
import { useState, useEffect } from 'react';
import JobListing from '../components/JobListing';
import { FaHeart } from 'react-icons/fa'


const FavoriteJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const favIds = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(favIds);

        const fetchJobs = async () => {
            const res = await fetch('/api/jobs');
            const data = await res.json();
            const favoriteJobs = data.filter(job => favIds.includes(job.id));
            setJobs(favoriteJobs);
        };

        fetchJobs
    }, []);

  return (
    <section className="bg-blue-50 px-4 py-10">
        <div className="container-xl lg:container m-auto">
            <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
                <FaHeart /> Favorite Jobs
            </h2>

            {jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {jobs.mpa(job => (
                        <JobListing key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600 text-lg mt-10">
                    You haven't favorited any jobs yet
                </p>
            )}
        </div>
    </section>

  )
}

export default FavoriteJobsPage