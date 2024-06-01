import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import "../Styles/FrontPage.css";
import mrbeanImage from "../Data/mrbeanImage.jpg";
import {
  fetchMoviesByGenreAndLimit,
  fetchEntryCountByGenre,
} from "../Services/Api/fetchApi";

// Genres available for display
const genres = [
  "Action",
  "Comedy",
  "Thriller",
  "War",
  "Romance",
  "Drama",
  "Crime",
  "Documentary",
  "Horror",
];

// Initial number of genres to display
const INITIAL_GENRES_TO_SHOW = 2;

const FrontPage = () => {
  // State for holding fetched data and loading/error status
  const [mediaCounts, setMediaCounts] = useState({});
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genresToShow, setGenresToShow] = useState(INITIAL_GENRES_TO_SHOW);
  const [currentPage, setCurrentPage] = useState(1);
  const genreCache = useRef({}); // Cache to store fetched genres data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch entry counts in parallel
        const entryCounts = await Promise.all(
          genres.map(fetchEntryCountByGenre)
        );
        const genreCounts = genres.reduce((acc, genre, index) => {
          acc[genre] = entryCounts[index];
          return acc;
        }, {});
        setMediaCounts(genreCounts);

        // Fetch movies for visible genres
        const visibleGenres = genres.slice(0, genresToShow);
        const moviesDataPromises = visibleGenres.map(async (genre) => {
          if (genreCache.current[genre]) {
            return genreCache.current[genre];
          } else {
            const data = await fetchMoviesByGenreAndLimit(
              genre,
              3,
              currentPage
            );
            genreCache.current[genre] = data;
            return data;
          }
        });

        const moviesData = await Promise.all(moviesDataPromises);
        const moviesObj = visibleGenres.reduce((acc, genre, index) => {
          acc[genre] = moviesData[index];
          return acc;
        }, {});
        setMoviesByGenre(moviesObj);

        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, genresToShow]);

  const loadMoreGenres = () => {
    setGenresToShow(
      (prevGenresToShow) => prevGenresToShow + INITIAL_GENRES_TO_SHOW
    );
  };

  const loadMoreMovies = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const memoizedMoviesByGenre = useMemo(() => moviesByGenre, [moviesByGenre]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="front-page">
      <table className="genre-table">
        <thead>
          <tr>
            <th>Genre</th>
            <th>Total Movies</th>
            <th>Movies</th>
          </tr>
        </thead>
        <tbody>
          {genres.slice(0, genresToShow).map((genre) => (
            <tr key={genre} className="genre-section">
              <td>{genre}</td>
              <td>{mediaCounts[genre] || 0}</td>
              <td>
                {memoizedMoviesByGenre[genre] &&
                  memoizedMoviesByGenre[genre].map((movie) => (
                    <div key={movie.id} className="movie-item">
                      <Link
                        to={`/movies/${genre.toLowerCase()}`}
                        className="movie-link"
                      >
                        <img
                          src={
                            movie["plmedia$defaultThumbnailUrl"] || mrbeanImage
                          }
                          alt={movie.title}
                          className="movie-image"
                        />
                        <div className="movie-details">
                          <h3>{movie.title}</h3>
                          <p>{movie.description}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                {memoizedMoviesByGenre[genre] &&
                  memoizedMoviesByGenre[genre].length > 3 && (
                    <button
                      onClick={loadMoreMovies}
                      className="load-more-button"
                    >
                      Load More
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {genresToShow < genres.length && (
        <button onClick={loadMoreGenres} className="load-more-button">
          Load More Genres
        </button>
      )}
    </div>
  );
};

export default FrontPage;
