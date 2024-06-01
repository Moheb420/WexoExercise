import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieById } from "../Services/Api/fetchApi.js";
import "../Styles/MovieById.css";
import mrbeanImage from "../Data/mrbeanImage.jpg"; // Import the default image

const MovieById = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch movie details when component mounts or id changes
    const loadMovie = async () => {
      try {
        const data = await fetchMovieById(id); // Fetch movie data using id
        setMovie(data); // Update movie state with fetched data
      } catch (error) {
        setError("Failed to fetch movie"); // Handle fetch error
      } finally {
        setLoading(false); // Set loading state to false after fetch completes
      }
    };

    loadMovie();
  }, [id]); // Dependency array ensures useEffect runs when id changes

  // Memoize the movie object to prevent unnecessary re-renders
  const memoizedMovie = useMemo(() => movie, [movie]);

  // Function to add movie to wishlist
  const handleAddToWishlist = () => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isAlreadyInWishlist = storedWishlist.some((item) => item.id === id);
    if (!isAlreadyInWishlist) {
      const updatedWishlist = [...storedWishlist, memoizedMovie];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    }
  };

  // Render loading message while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error message if fetch fails
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render movie details if data is available
  return (
    <div>
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      {memoizedMovie && (
        <div className="movie-details">
          <h1>{memoizedMovie.title}</h1>
          <p>{memoizedMovie.description}</p>
          {/* Render movie thumbnail image or default image */}
          <img
            src={memoizedMovie["plmedia$defaultThumbnailUrl"] || mrbeanImage}
            alt={memoizedMovie.title}
            className="movie-image"
          />
          <div className="movie-actions">
            <button onClick={handleAddToWishlist} className="wishlist-button">
              Add to Wishlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieById;
