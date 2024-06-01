import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "../Styles/MoviesByGenre.css";
import mrbeanImage from "../Data/mrbeanImage.jpg"; // Import the default image
import { fetchMoviesByGenre } from "../Services/Api/fetchApi";

const MoviesByGenre = () => {
  const { genre } = useParams(); // Get the genre parameter from the URL
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        let cachedMovies = localStorage.getItem(`moviesByGenre_${genre}`);
        if (cachedMovies) {
          setMovies(JSON.parse(cachedMovies));
          setLoading(false);
        } else {
          const movies = await fetchMoviesByGenre(genre);
          setMovies(movies);
          localStorage.setItem(
            `moviesByGenre_${genre}`,
            JSON.stringify(movies)
          );
          setLoading(false);
        }
      } catch (error) {
        setError("Failed to fetch movies");
        setLoading(false);
      }
    };

    loadMovies();
  }, [genre]);

  // Memoize the movies array to prevent unnecessary re-renders
  const memoizedMovies = useMemo(() => movies, [movies]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="movies-by-genre">
      <h2 className="genre-title">{genre} Movies</h2>
      <ul className="movie-list">
        {memoizedMovies.map((movie) => {
          // Extract the relevant part of the ID from the URL
          const movieId = movie.id.split("/").pop();
          return (
            <li key={movieId} className="movie-item">
              <Link to={`/MovieById/${movieId}`}>
                <img
                  src={movie["plmedia$defaultThumbnailUrl"] || mrbeanImage}
                  alt={movie.title}
                  className="movie-image"
                />
                <div className="movie-details">
                  <h3>{movie.title}</h3>
                  <p>{movie.description}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MoviesByGenre;
