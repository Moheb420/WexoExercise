import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Movies.css";
import { fetchMovies } from "../Services/Api/fetchApi.js";
import mrbeanImage from "../Data/mrbeanImage.jpg";

const MoviesComponent = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1); // Track current page for pagination
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true); // Track if more movies are available
  const [totalMovies, setTotalMovies] = useState(0); // Track total number of movies
  const navigate = useNavigate();

  // Fetch movies data from API when component mounts or page changes
  useEffect(() => {
    const getMovies = async () => {
      try {
        setLoading(true);
        const moviesData = await fetchMovies(page);
        // console.log("Fetched movies data:", moviesData); // Debugging
        if (moviesData.length > 0) {
          setTotalMovies((prevTotal) => prevTotal + moviesData.length);
          setMovies((prevMovies) => {
            // Filter out movies that are already in the state
            const filteredMovies = moviesData.filter(
              (newMovie) =>
                !prevMovies.some((movie) => movie.id === newMovie.id)
            );
            return [...prevMovies, ...filteredMovies];
          });
        } else {
          setHasMore(false); // No more movies to load
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    getMovies();
  }, [page]); // Fetch movies when page changes

  // Function to extract release year from date string
  const getReleaseYear = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getFullYear()) ? date.getFullYear() : "N/A";
  };

  // Memoize the getReleaseYear function to avoid unnecessary recalculations
  const memoizedGetReleaseYear = useMemo(() => {
    return getReleaseYear;
  }, []);

  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      <h1>Movies</h1>
      <div className="movies-container">
        {movies.map((movie) => (
          <div key={movie.id} className="movie">
            <h2>{movie.title}</h2>
            <p>{movie.description}</p>
            <p>
              Release Year: {memoizedGetReleaseYear(movie["plprogram$pubDate"])}
            </p>
            {movie["plprogram$credits"] && (
              <div>
                <p>Actors:</p>
                <ul>
                  {movie["plprogram$credits"]
                    .filter(
                      (credit) => credit["plprogram$creditType"] === "actor"
                    )
                    .map((actor, index) => (
                      <li key={index}>{actor["plprogram$personName"]}</li>
                    ))}
                </ul>
              </div>
            )}
            <img
              src={movie["plmedia$defaultThumbnailUrl"] || mrbeanImage}
              alt={movie.title}
            />
            {movie["plmedia$defaultImageUrl"] && (
              <img src={movie["plmedia$defaultImageUrl"]} alt={movie.title} />
            )}
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>
      {!loading && hasMore && totalMovies !== movies.length && (
        <button onClick={loadMoreMovies} className="load-more-button">
          Load More
        </button>
      )}
    </div>
  );
};

export default MoviesComponent;
