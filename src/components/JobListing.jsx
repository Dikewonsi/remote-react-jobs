import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaMapMarker, FaHeart } from 'react-icons/fa'

const JobListing = ({job}) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect (() =>{
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setIsFavorite(favorites.includes(job.id));
    }, [job.id])

    const toggleFavorite = () => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favorites.includes(job.id)) {
            favorites = favorites.filter(id => id !== job.id);
            setIsFavorite(false);
        } else {
            favorites.push(job.id);
            setIsFavorite(true);
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    }


    let description = job.description;

    if(!showFullDescription) {
        description = description.substring(0, 90) + '...';
    }
  return (
    <div className="bg-white rounded-xl shadow-md relative">
        <div className="p-4">
        <div className="mb-6">
            <div className="text-gray-600 my-2">{job.type}</div>
            <h3 className="text-xl font-bold">{job.title}</h3>
        </div>

        <button 
            onClick={toggleFavorite}
            className={`absolute top-4 right-4 text-xl ${
                isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
        >
            <FaHeart />
        </button>
        <div className="mb-5">
            {description}
        </div>

        <button
            onClick={() => setShowFullDescription((prevState) => !prevState)}
            className="text-indigo-500 mb-4 hover:text-indigo-800"
        >
            {showFullDescription ? 'Less' : 'More'}
        </button>

        <h3 className="text-indigo-500 mb-2">{job.salary} / Year</h3>

        <div className="border border-gray-100 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between mb-4">
            <div className="text-orange-700 mb-3">
                 <FaMapMarker className="fa-solid fa-location-dot text-lg text-orange-700 mr-2"
                    /> {job.location}
            </div>
            <Link
            to={`/job/${job.id}`}
            className="h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
            >
            Read More
            </Link>
        </div>
        </div>
    </div>
  )
}

export default JobListing